window.onload = function() {
	highlightMenu('menu_index');
	createStatusHashTable();
	addStatusNodeDivs('flowDiagramDivId');
	refreshStatusCount();
}
var appNodesText = $("#appNodesData").text();
var appNodesData = JSON.parse(appNodesText);
var appStatusData = JSON.parse($("#appStatuses").text());
var appInfoDatas = JSON.parse($("#appDatas").text());
var statusHash = {};
/*
$(document).ready(function() {
      var divs = $("div");
      for( i=0; i<divs.length; i++ ){
         alert("Found div: " + divs[i].innerHTML);
	  }
});
*/
function plotStatusGraph() {
	var divs = $("div");
	for( i=0; i<divs.length; i++ ){
	 alert("Found div: " + divs[i].innerHTML);
	 /*
	 <div id="node1Id" class="node">
		<div id="node1GroupId" class="nodeGroup">
			<div id="node1NameId" class="nodeName">StarAAAAAAAA Atttt tttttt ggggfffffffffffff ffffffffff ffffffffffffff</div>
			<div id="node1FrequencyId" class="nodeFrequency">4</div>
			<div id="node1LinkId" class="nodeLink"><a href=""> Lookup</a></div>
		</div>
	</div>
	*/
	}
}
function addStatusNodeDivs(parentDivId) {
	
	var parentDiv = $("div"+"#"+parentDivId);
	$(parentDiv).css("position","relative");
	var parentDivHeight = $(parentDiv).height();
	var parentDivWidth = $(parentDiv).width();

	//connect divs STARTS
	jsPlumb.bind("ready", function() {

		// this is the paint style for the connecting lines..		
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
		
		var _addEndpoints = function(toId, ancArr){
			for (var i = 0; i < ancArr.length; i++) {
					var sourceUUID = toId + ancArr[i];
					jsPlumb.addEndpoint(toId, endpoint, { anchor:ancArr[i], uuid:sourceUUID});						
				}
		};

		var _connect = function(_source, _target, _sourceAnchor, _targetAnchor){
			jsPlumb.connect({
					source:_source,
					target:_target,
					anchor:[_sourceAnchor, _targetAnchor],
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
					overlays:[["Arrow",{location:-1}]],
					dragOptions:{}
				});
		}

		var startId = '_nodeStartId';
		$(parentDiv).append("<div id='"+startId+"' class='startNode'></div>" );
		$('div#'+startId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"left":"5px"
								}
		);
		
		///this will be in loop STARTS

	    for(var i=0;i<appNodesData[0].nodes.length;i++){
	    	var j = i+1
	    	var nodeId = '_nodeId'+j;
	    	var nodeGroupId = 'node'+j+'GroupId';
	    	var nodeNameId = 'node'+j+'NameId';
	    	var nodeFrequencyId = 'node'+j+'FrequencyId';
	    	var nodeLinkId = 'node'+j+'LinkId';
	    	var nodeStatusCD = appNodesData[0].nodes[i].appstatuscode;
	    	$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>"+appNodesData[0].nodes[i].appstatus+"</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>NaN</div><div id='"+nodeLinkId+"' class='nodeLink'><a href='/appSearch?statuscode='" + nodeStatusCD + "'> Lookup</a></div></div></div>" );
			
			$('div#'+nodeId).css(	{"position":"absolute",
									"top":(appNodesData[0].nodes[i].top)-$('div#'+nodeId).outerHeight()/2,
									"left":(appNodesData[0].nodes[i].left)-$('div#'+nodeId).outerWidth()/2
									}
			);
			_addEndpoints('_nodeId'+j, ["TopCenter", "BottomCenter","LeftMiddle", "RightMiddle"]);
	    }

	    var endId = '_nodeEndId';
		$(parentDiv).append("<div id='"+endId+"' class='endNode'></div>" );
		$('div#'+endId).css(	{"position":"absolute",
								"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
								"right":"5px"
								}
		);

		_addEndpoints("_nodeStartId",["TopCenter", "BottomCenter","LeftMiddle", "RightMiddle"]);
		_addEndpoints("_nodeEndId",["TopCenter", "BottomCenter","LeftMiddle", "RightMiddle"]);

		for(var i=0;i<appNodesData[0].connections.length;i++){
			_connect(appNodesData[0].connections[i].sourcenode,appNodesData[0].connections[i].targetnode,appNodesData[0].connections[i].sourceanchor,appNodesData[0].connections[i].targetanchor);
		}
     });
	//connect divs ENDS

//	for( i=0; i<divs.length; i++ ){
//	 alert("Found div: " + divs[i].innerHTML);
	 /*
	 <div id="node1Id" class="node">
		<div id="node1GroupId" class="nodeGroup">
			<div id="node1NameId" class="nodeName">StarAAAAAAAA Atttt tttttt ggggfffffffffffff ffffffffff ffffffffffffff</div>
			<div id="node1FrequencyId" class="nodeFrequency">4</div>
			<div id="node1LinkId" class="nodeLink"><a href=""> Lookup</a></div>
		</div>
	</div>
	*/
//	}
}

function createStatusHashTable(){
	for (var i=0;i<appStatusData.length;i++){
		statusHash[appStatusData[i].appstatuscode] = 0;
	}
}

function refreshStatusCount(){
	setTimeout( function () {
		createStatusHashTable();
		$.ajax({
			type:'get',
			dataType: "json",
			url:'/fetchAppFlowData',
			success : function(data) {
				appInfoDatas = data;
			}
		})
		
		for(var i=0;i<appInfoDatas.length;i++){
			statusHash[appInfoDatas[i].appstatuscode]++;
		}
		for(var i = 0;i<appNodesData.length;i++){
			var j = i+1;
			$('#node'+j+'FrequencyId').fadeOut('slow').text(statusHash[appNodesData[0].nodes[i].appstatuscode]).fadeIn('slow');
		}
		refreshStatusCount();
	}, 2000);
}