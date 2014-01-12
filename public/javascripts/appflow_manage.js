window.onload = function() {
	highlightMenu('menu_manage');
}

jsPlumb.ready(function() {
	var containerId = "flowDiagramDivId";
	var instance = jsPlumb.getInstance({
	// default drag options
	DragOptions : { cursor: 'pointer', zIndex:2000 },
	// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
	// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
	ConnectionOverlays : [
		[ "Arrow", { location:1 } ],
		[ "Label", { 
			location:0.1,
			id:"label",
			cssClass:"aLabel"
		}]
	],
	Container:containerId
	});		
	var connectorPaintStyle = {
		lineWidth:4,
		strokeStyle:"#61B7CF",
		joinstyle:"round",
		outlineColor:"white",
		outlineWidth:2
	};
	// .. and this is the hover style. 
	var connectorHoverStyle = {
		lineWidth:4,
		strokeStyle:"#216477",
		outlineWidth:2,
		outlineColor:"white"
	};
	var endpointHoverStyle = {
		fillStyle:"#216477",
		strokeStyle:"#216477"
	};

	// the definition of source endpoints (the small blue ones)
	var endpoint = {
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
	
	var _addEndpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, endpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};

	function addStartEndNodeDivs() {
		var parentDiv = $("div"+"#"+containerId);
		$(parentDiv).css("position","relative");
		var parentDivHeight = $(parentDiv).height();
		var parentDivWidth = $(parentDiv).width();
		
		var startId = 'startId';
		$(parentDiv).append("<div id='"+startId+"' class='startNode'></div>" );
		$('div#'+startId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"left":"5px"
								}
		);
		try{
			_addEndpoints(startId, ["TopCenter", "BottomCenter", "RightMiddle"]);
		}catch (err) {
			console.log("Error=>"+err);
		}
		var endId = 'endId';
		$(parentDiv).append("<div id='"+endId+"' class='endNode'></div>" );
		$('div#'+endId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"right":"5px"
								}
		);
		_addEndpoints(endId, ["TopCenter", "BottomCenter", "LeftMiddle"]);
	}
	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {
		addStartEndNodeDivs();

		// make all the window divs draggable						
//		instance.draggable($(".startNode"), { containment:"parent"});
//		instance.draggable($(".endNode"), { containment:"parent" });

	});


	$("a#addNodeId").click(function addNode() {
		var parentDiv = $("div"+"#"+containerId);
		$(parentDiv).css("position","relative");

		var appstatus = $("input#statusId").val();
		var appstatuscode = $("input#statusCodeId").value;

		var nodeId = 'node1Id';
		var nodeGroupId = 'node1GroupId';
		var nodeNameId = 'node1NameId';
		var nodeFrequencyId = 'node1FrequencyId';
		var nodeLinkId = 'node1LinkId';

		$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>"+appstatus+"</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''> Lookup</a></div></div></div>" );
		$('div#'+nodeId).css(	{"position":"absolute",
								"top":0,
								"left":0
								}
		);
		//make node draggable
		instance.draggable($("#"+nodeId), { containment:"parent" });
		_addEndpoints(nodeId, ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"]);
	});


});

