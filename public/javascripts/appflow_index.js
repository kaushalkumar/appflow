window.onload = function() {
	highlightMenu('menu_index');
	addStatusNodeDivs('flowDiagramDivId');
	refreshStatusCount();
}
var appNodesText = $("#appNodesData").text();
var appNodesData = JSON.parse(appNodesText);
var appStatusData = JSON.parse($("#appStatuses").text());
/*
$(document).ready(function() {
      var divs = $("div");
      for( i=0; i<divs.length; i++ ){
         alert("Found div: " + divs[i].innerHTML);
	  }
});
*/

function addStatusNodeDivs(parentDivId) {
	
	var parentDiv = $("div"+"#"+parentDivId);
	$(parentDiv).css("position","relative");
	var parentDivHeight = $(parentDiv).height();
	var parentDivWidth = $(parentDiv).width();
	
	var containerId = "flowDiagramDivId";

	var instance = jsPlumb.getInstance({
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
	//connect divs STARTS
	instance.bind("ready", function() {

		// this is the paint style for the connecting lines..		
		var _connectorPaintStyle = {
		lineWidth:3,
		strokeStyle:"#61B7CF",
		joinstyle:"round",
		outlineColor:"white",
		outlineWidth:1
		};
		// .. and this is the hover style. 
		var _connectorHoverStyle = {
			lineWidth:3,
			radius:2,
			strokeStyle:"#216477",
			outlineWidth:1,
			outlineColor:"white"
		};
		var _endpointHoverStyle = {
			fillStyle:"#216477",
			radius:2,
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

		var _connector = [ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ];

		var endpoint = {
			endpoint:"Dot",
			paintStyle:_paintStyle,				
			connector:_connector,								                
			connectorStyle:_connectorPaintStyle,
			hoverPaintStyle:_endpointHoverStyle,
			connectorHoverStyle:_connectorHoverStyle,
			dragOptions:{}
		};
		
		var _addEndpoints = function(toId, ancArr){
			for (var i = 0; i < ancArr.length; i++) {
					var sourceUUID = toId + ancArr[i];
					instance.addEndpoint(toId, endpoint, { anchor:ancArr[i], uuid:sourceUUID});						
				}
		};

		var _connect = function(_source, _target, _sourceAnchor, _targetAnchor){
			instance.connect({
					source:_source,
					target:_target,
					anchor:[_sourceAnchor, _targetAnchor],
					endpoint:"Dot",
					endpointStyle:_endpointStyle,
					paintStyle:_paintStyle,				
					connector:_connector,								                
					connectorStyle:_connectorPaintStyle,
					hoverPaintStyle:_endpointHoverStyle,
					connectorHoverStyle:_connectorHoverStyle,
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
	    	var nodeStatusCD = appNodesData[0].nodes[i].appstatuscode;
			var nodeId = '_nodeId'+j;
	    	var nodeGroupId = 'nodeGroupId'+j;
	    	var nodeNameId = 'nodeNameId'+j;
	    	var nodeFrequencyId = 'nodeFrequencyId_' + nodeStatusCD + '_' + j;
	    	var nodeLinkId = 'nodeLinkId'+j;
	    	$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>"+appNodesData[0].nodes[i].appstatus+"</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>0</div><div id='"+nodeLinkId+"' class='nodeLink'><a href='/appSearch?statuscode='" + nodeStatusCD + "'> Lookup</a></div></div></div>" );
			
			var yAxis = appNodesData[0].nodes[i].top.replace("px","");
			var xAxis = appNodesData[0].nodes[i].left.replace("px","");
			$('div#'+nodeId).css(	{"position":"absolute",
									"top":(yAxis)-$('div#'+nodeId).outerHeight()/2,
									"left":(xAxis)-$('div#'+nodeId).outerWidth()/2
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

}

function refreshStatusCount(){
	setTimeout( function () {
		var statusHash = {};
		var appInfoDatas = {};
		var _url = '/fetchNodeFrequencyData';
		_url = _url + "?random=" + Math.random();
		$.ajax({
			type:'get',
			dataType: "json",
			url:_url,
			success : function(data) {
				appInfoDatas = data;
				for(var i=0;i<appInfoDatas.length;i++){
					statusHash[appInfoDatas[i].appstatuscode] = appInfoDatas[i].count;
				}

				$('div[id^="nodeFrequencyId_"]').each(function(){
					var id = this.id;
					var appstatusCD = id.substring(id.indexOf("_")+1, id.lastIndexOf("_"));
					$("#"+id).fadeOut('slow').text(statusHash[appstatusCD]).fadeIn('slow');
				});
			}
		});
		refreshStatusCount();
	}, 2000);
}