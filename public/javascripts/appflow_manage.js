var lastNodeNumber = 0;
window.onload = function() {
	highlightMenu('menu_manage');
	//TODO:populate last node number
	//show saved data
	plotStatusGraph();
}

function plotStatusGraph() {

}
jsPlumb.ready(function() {
	var containerId = "flowDiagramDivId";
	var instance = jsPlumb.getInstance({
	// default drag options
	DragOptions : { cursor: 'pointer', zIndex:2000 },
	// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
	// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
	ConnectionOverlays : [
		[ "Arrow", { location:0.99, width:10, length:7 } ],
		[ "Label", { 
			location:0.1,
			id:"label",
			cssClass:"aLabel"
		}]
	],
	Container:containerId
	});		
	var connectorPaintStyle = {
		lineWidth:3,
		strokeStyle:"#61B7CF",
		joinstyle:"round",
		outlineColor:"white",
		outlineWidth:1
	};
	// .. and this is the hover style. 
	var connectorHoverStyle = {
		lineWidth:3,
		strokeStyle:"#216477",
		outlineWidth:1,
		outlineColor:"white"
	};
	var endpointHoverStyle = {
		fillStyle:"#216477",
		strokeStyle:"#216477"
	};

	// the definition of anchor point (the small blue ones)
	var anchorpoint = {
		isTarget:true,
		isSource:true,
		maxConnections:-1,
		endpoint:"Dot",
		paintStyle:{ 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:1,
			lineWidth:3 
		},				
		connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
		dragOptions:{}
	};		

	// the definition of anchor point (the small blue ones)
	var sourceanchorpoint = {
		isSource:true,
		maxConnections:-1,
		endpoint:"Dot",
		paintStyle:{ 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:1,
			lineWidth:3 
		},				
		connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
		dragOptions:{}
	};		
	
	// the definition of anchor point (the small blue ones)
	var targetanchorpoint = {
		isTarget:true,
		maxConnections:-1,
		endpoint:"Dot",
		paintStyle:{ 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:1,
			lineWidth:3 
		},				
		connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
		dragOptions:{}
	};

	var _addAnchorpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, anchorpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};

	var _addSourceAnchorpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, sourceanchorpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};

	var _addTargetAnchorpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, targetanchorpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};

	function addStartEndNodeDivs() {
		var parentDiv = $("div"+"#"+containerId);
		$(parentDiv).css("position","relative");
		var parentDivHeight = $(parentDiv).height();
		var parentDivWidth = $(parentDiv).width();
		
		var startId = '_nodeStartId';
		$(parentDiv).append("<div id='"+startId+"' class='startNode'></div>" );
		$('div#'+startId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"left":"5px"
								}
		);
		var anchorArr = new Array(3);
		_addSourceAnchorpoints(startId, ["TopCenter", "BottomCenter", "RightMiddle"]);
		var endId = '_nodeEndId';
		$(parentDiv).append("<div id='"+endId+"' class='endNode'></div>" );
		$('div#'+endId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"right":"5px"
								}
		);
		_addTargetAnchorpoints(endId, ["TopCenter", "BottomCenter", "LeftMiddle"]);
	}
	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {
		addStartEndNodeDivs();

	});


	$("a#addNodeId").click(function addNode() {
		var parentDiv = $("div"+"#"+containerId);
		$(parentDiv).css("position","relative");

		var appstatus = $('select[name="statuscode"]').find('option:selected').text();
		var appstatuscode = $('select[name="statuscode"]').find('option:selected').val();

		lastNodeNumber = lastNodeNumber+1;
		var nodeId = '_nodeId'+lastNodeNumber;
		var nodeGroupId = '_nodeGroupId'+lastNodeNumber;
		var nodeNameId = '_nodeNameId'+lastNodeNumber;
		var nodeCodeId = '_nodeCodeId'+lastNodeNumber;
		var nodeFrequencyId = '_nodeFrequencyId'+lastNodeNumber;
		var nodeLinkId = '_nodeLinkId'+lastNodeNumber;
		
		$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>"+appstatus+"</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''><input type='hidden' id='"+nodeCodeId+"' value='"+appstatuscode+"'/>Lookup</a></div></div></div>" );
		$('div#'+nodeId).css(	{"position":"absolute",
								"top":0,
								"left":0
								}
		);
		//make node draggable
		instance.draggable($("#"+nodeId), { containment:"parent" });
		_addAnchorpoints(nodeId, ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"]);
	});

	$("a#saveAppFlowId").click(function saveAppFlow() {
		alert('hi');
		var parentDiv = $("div"+"#"+containerId);
		$(parentDiv).css("position","relative");

		var startnode = $("div#_nodeStartId");
		var startNodeTop = $("div#_nodeStartId").css('top')
		var startNodeLeft = $("div#_nodeStartId").css('left')

		var endnode = $("div#_nodeEndId");
		var endNodeTop = $("div#_nodeStartId").css('top')
		var endNodeLeft = $("div#_nodeStartId").css('left')

		var nodes = $("div[id^=_nodeId]");
		for (counter = 0; counter<nodes.length; counter++)
		{
			var node = nodes[counter];
			var nodeId = node.id;
			var nodeTop = node.style.top;
			var nodeLeft = node.style.left;
			var nodeStatus = node.children[0].children[0].innerText;
			var nodeStatusCode = node.children[0].children[2].children[0].children[0].value;
			console.log(node);
		}
		console.log(jsPlumb.getDefaultScope());
		var connections = instance.getConnections();
		console.log(connections.length)
		for(i=0; i<connections.length; i++) { 
			var target = connections[i].targetId ; 
			var source = connections[i].sourceId ;
			console.log(target);
			console.log(source);
		}
		console.log(connections);

	});


});

