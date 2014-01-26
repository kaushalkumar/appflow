var lastNodeNumber = 0;
var appNodesText = $("#appNodesData").text();
var appNodesData = JSON.parse(appNodesText);
if (appNodesData != null && appNodesData.length > 0){
	lastNodeNumber = appNodesData[0].lastNodeNumber;
}

window.onload = function() {
	highlightMenu('menu_manage');

	plotStatusGraph(appNodesData);
}

function plotStatusGraph(appNodesData) {
	
}

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

	var _endpointStyle = { 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:2
	}

	var _paintStyle = { 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:1,
			lineWidth:3 
	}
	var _connector = [ "Flowchart", { stub:[40, 60], gap:5, cornerRadius:5, alwaysRespectStubs:true } ];
	
	// the definition of endpoint point (the small blue ones)
	var endpoint = {
		isTarget:true,
		isSource:true,
		maxConnections:-1,
		endpoint:"Dot",
		paintStyle:_paintStyle,
		connector:_connector,
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
		dragOptions:{}
	};		

	// the definition of anchor point (the small blue ones)
	var sourceEndpoint = {
		isSource:true,
		maxConnections:-1,
		endpoint:"Dot",
		paintStyle:_paintStyle,
		connector:_connector,
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
		dragOptions:{}
	};		
	
	// the definition of anchor point (the small blue ones)
	var targetEndpoint = {
		isTarget:true,
		maxConnections:-1,
		endpoint:"Dot",
		paintStyle:_paintStyle,
		connector:_connector,
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
		dragOptions:{}
	};


jsPlumb.ready(function() {
	var containerId = "flowDiagramDivId";
	var instance = jsPlumb.getInstance({
	// default drag options
	DragOptions : { cursor: 'pointer', zIndex:2000 },
	// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
	// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
	ConnectionOverlays : [
		[ "Arrow", { location:-1, width:10, length:7 } ],
		[ "Label", { 
			location:0.1,
			id:"label",
			cssClass:"aLabel"
		}]
	],
	Container:containerId
	});		

	var _addEndpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, endpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};
	
	var _addSourceEndpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, sourceEndpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};

	var _addTargetEndpoints = function(nodeId, anchorArr) {
		for (var i = 0; i < anchorArr.length; i++) {
			var anchorUUID = nodeId + anchorArr[i];
			instance.addEndpoint(nodeId, targetEndpoint, { anchor:anchorArr[i], uuid:anchorUUID });						
		}
	};
	var _connect = function(_source, _target, _sourceAnchor, _targetAnchor){
		instance.connect({
			uuids:[_source+_sourceAnchor, _target+_targetAnchor],
			source:_source,
			target:_target,
			endpoint:"Dot",
			endpointStyle:_endpointStyle,
			paintStyle:_paintStyle,
			connector:_connector,
			connectorStyle:connectorPaintStyle,
			hoverPaintStyle:endpointHoverStyle,
			connectorHoverStyle:connectorHoverStyle,
			dragOptions:{}
		});
	}

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
		_addSourceEndpoints(startId, ["TopCenter", "BottomCenter", "RightMiddle"]);
		var endId = '_nodeEndId';
		$(parentDiv).append("<div id='"+endId+"' class='endNode'></div>" );
		$('div#'+endId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"right":"5px"
								}
		);
		_addTargetEndpoints(endId, ["TopCenter", "BottomCenter", "LeftMiddle"]);
	}

	function addExistingNodes() {
		if (appNodesData[0].nodes.length > 0) {
			for (i=0; i< appNodesData[0].nodes.length; i++)
			{
				var parentDiv = $("div"+"#"+containerId);
				$(parentDiv).css("position","relative");

				var nodeId = appNodesData[0].nodes[i].id;
				var appstatus = appNodesData[0].nodes[i].appstatus;
				var appstatuscode = appNodesData[0].nodes[i].appstatuscode;

				var nodeNumber = nodeId.replace("_nodeId","");
				var nodeDeleteAnchorId = '_nodeDeleteAnchorId'+nodeNumber;
				var nodeGroupId = '_nodeGroupId'+nodeNumber;
				var nodeNameId = '_nodeNameId'+nodeNumber;
				var nodeCodeId = '_nodeCodeId'+nodeNumber;
				var nodeFrequencyId = '_nodeFrequencyId'+nodeNumber;
				var nodeLinkId = '_nodeLinkId'+nodeNumber;
				
				$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeDeleteAnchorId+"' href='#'> <span class='glyphicon glyphicon-remove-circle nodeRemove'/> </div><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>"+appstatus+"</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''><input type='hidden' id='"+nodeCodeId+"' value='"+appstatuscode+"'/>Lookup</a></div></div></div>" );
				$('div#'+nodeId).css(	{"position":"absolute",
										"top":appNodesData[0].nodes[i].top,
										"left":appNodesData[0].nodes[i].left
										}
				);
				$("div#"+nodeDeleteAnchorId).click(function removeNode() {
					 var nodeIDToBeDeleted = $("div#"+this.id).parent().attr('id');
					 var isDelete = confirm("Delete node?");
					 if (isDelete == true)
					 {
						 instance.remove(nodeIDToBeDeleted);
					 }
					 
				});
				
				$("div#"+nodeDeleteAnchorId).mouseover(function () {
					 $(this).children().addClass('nodeRemoveHover'); 
				});
				$("div#"+nodeDeleteAnchorId).mouseout(function () {
					 $(this).children().removeClass('nodeRemoveHover'); 
				});
				//make node draggable
				instance.draggable($("#"+nodeId), { containment:"parent" });
				_addEndpoints(nodeId, ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"]);
			}
		}
	}

	
	function addExistingConections(){
		if (appNodesData[0].connections != null)
		{
			for(var i=0;i<appNodesData[0].connections.length;i++){
				console.log(appNodesData[0].connections[i].sourcenode+','+appNodesData[0].connections[i].targetnode+','+appNodesData[0].connections[i].sourceanchor+','+appNodesData[0].connections[i].targetanchor);
				_connect(appNodesData[0].connections[i].sourcenode,appNodesData[0].connections[i].targetnode,appNodesData[0].connections[i].sourceanchor,appNodesData[0].connections[i].targetanchor);
			}
		}
		console.log(instance.getConnections());	
	}

	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {
		console.log(instance.getConnections());
		addStartEndNodeDivs();
		if (appNodesData != null && appNodesData.length > 0)
		{
			addExistingNodes();
			addExistingConections();
		}
	}); 


	$("a#addNodeId").click(function addNode() {
		var parentDiv = $("div"+"#"+containerId);
		$(parentDiv).css("position","relative");

		var appstatus = $('select[name="statuscode"]').find('option:selected').text();
		var appstatuscode = $('select[name="statuscode"]').find('option:selected').val();
		lastNodeNumber = lastNodeNumber+1;
		var nodeId = '_nodeId'+lastNodeNumber;
		var nodeDeleteAnchorId = '_nodeDeleteAnchorId'+lastNodeNumber;
		var nodeGroupId = '_nodeGroupId'+lastNodeNumber;
		var nodeNameId = '_nodeNameId'+lastNodeNumber;
		var nodeCodeId = '_nodeCodeId'+lastNodeNumber;
		var nodeFrequencyId = '_nodeFrequencyId'+lastNodeNumber;
		var nodeLinkId = '_nodeLinkId'+lastNodeNumber;
		
		$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeDeleteAnchorId+"' href='#'> <span class='glyphicon glyphicon-remove-circle nodeRemove'/> </div><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>"+appstatus+"</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''><input type='hidden' id='"+nodeCodeId+"' value='"+appstatuscode+"'/>Lookup</a></div></div></div>" );
		$('div#'+nodeId).css(	{"position":"absolute",
								"top":0,
								"left":0
								}
		);
		$("div#"+nodeDeleteAnchorId).click(function removeNode() {
			 var nodeIDToBeDeleted = $("div#"+this.id).parent().attr('id');
			 var isDelete = confirm("Delete node?");
			 if (isDelete == true)
			 {
				 instance.remove(nodeIDToBeDeleted);
			 }
			 
		});
		
		$("div#"+nodeDeleteAnchorId).mouseover(function () {
			 $(this).children().addClass('nodeRemoveHover'); 
		});
		$("div#"+nodeDeleteAnchorId).mouseout(function () {
			 $(this).children().removeClass('nodeRemoveHover'); 
		});
		//make node draggable
		instance.draggable($("#"+nodeId), { containment:"parent" });
		_addEndpoints(nodeId, ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"]);
	});

	$("a#saveAppFlowId").click(function saveAppFlow() {
		var nodes = $("div[id^=_nodeId]");
		console.log('nodes.length : ' +nodes.length);
		var jnodes = [nodes.length]
		for (counter = 0; counter<nodes.length; counter++)
		{
			var node = nodes[counter];
			var nodeId = node.id;
			var nodeTop = node.style.top;
			var nodeLeft = node.style.left;
			var nodeStatus = node.children[1].children[0].innerText;
			var nodeStatusCode = node.children[1].children[2].children[0].children[0].value;

			jnodes[counter] = {id : nodeId, appstatus : nodeStatus, appstatuscode : nodeStatusCode, top : nodeTop, left : nodeLeft}
		}
		console.log('jnodes : '+jnodes)

		console.log(jsPlumb.getDefaultScope());
		var connections = instance.getConnections();
		jconnections = [connections.length]
		for(i=0; i<connections.length; i++) {
			var target = connections[i].targetId ; 
			var source = connections[i].sourceId ;
			var sourceanchor = null;
			var targetanchor = null;
			var connection = null;
			if (source == connections[i].endpoints[0].anchor.elementId)
			{
				sourceanchor = connections[i].endpoints[0].anchor.type;
				targetAnchor = connections[i].endpoints[1].anchor.type;
			} else {
				sourceanchor = connections[i].endpoints[1].anchor.type;
				targetAnchor = connections[i].endpoints[0].anchor.type;
			}
			jconnections[i] = {sourcenode : source, sourceanchor : sourceanchor, targetnode : target, targetanchor : targetAnchor};
		}
		console.log(connections);
		console.log('jconnections : '+jconnections)

		var jFlows = {nodes : jnodes, connections : jconnections, lastNodeNumber : lastNodeNumber};

		var request = $.ajax({
			url: "/manage",
			async: false,
			type: "POST",
			data: JSON.stringify(jFlows),
			contentType: "application/json",
			dataType: "json"
		});


		request.success(function(result) {
		alert("Successfully saved...");
			console.log(result);
			
		});

		request.fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});

	});

	// bind click listener; delete connections on click			
	instance.bind("click", function(conn) {
		instance.detach(conn);
	});
	
	// bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
	// will be prompted to confirm deletion.
	instance.bind("beforeDetach", function(conn) {
		return confirm("Delete connection?");
	});
});

