window.onload = function() {
	highlightMenu('menu_index');
	addStatusNodeDivs('flowDiagramDivId');
	refreshStatusCount();
}
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
	
	var startId = 'startId';
	$(parentDiv).append("<div id='"+startId+"' class='startNode'></div>" );
	$('div#'+startId).css(	{"position":"absolute",
							"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
							"left":"5px"
							}
	);
	
	///this will be in loop STARTS
	var nodeId = 'node1Id';
	var nodeGroupId = 'node1GroupId';
	var nodeNameId = 'node1NameId';
	var nodeFrequencyId = 'node1FrequencyId';
	var nodeLinkId = 'node1LinkId';

	$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>Submitted</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''> Lookup</a></div></div></div>" );
	$('div#'+nodeId).css(	{"position":"absolute",
							"top":(parentDivHeight/2)-$('div#'+nodeId).outerHeight()/2,
							"left":(parentDivWidth/4)-$('div#'+nodeId).outerWidth()/2
							}
	);
console.log((parentDivHeight/2)-$('div#'+nodeId).outerHeight()/2);
console.log((parentDivWidth/4)-$('div#'+nodeId).outerWidth()/2);

	nodeId = 'node2Id';
	nodeGroupId = 'node2GroupId';
	nodeNameId = 'node2NameId';
	nodeFrequencyId = 'node2FrequencyId';
	nodeLinkId = 'node2LinkId';

	$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>Offer</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''> Lookup</a></div></div></div>" );
	$('div#'+nodeId).css(	{"position":"absolute",
							"top":(parentDivHeight/3)-$('div#'+nodeId).outerHeight()/2,
							"left":(parentDivWidth/2)-$('div#'+nodeId).outerWidth()/2
							}
	);

console.log((parentDivHeight/3)-$('div#'+nodeId).outerHeight()/2);
console.log((parentDivWidth/2)-$('div#'+nodeId).outerWidth()/2);

	nodeId = 'node3Id';
	nodeGroupId = 'node3GroupId';
	nodeNameId = 'node3NameId';
	nodeFrequencyId = 'node3FrequencyId';
	nodeLinkId = 'node3LinkId';

	$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>Counter Offer</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''> Lookup</a></div></div></div>" );
	$('div#'+nodeId).css(	{"position":"absolute",
							"top":(2*parentDivHeight/3)-$('div#'+nodeId).outerHeight()/2,
							"left":(parentDivWidth/2)-$('div#'+nodeId).outerWidth()/2
							}
	);

console.log((2*parentDivHeight/3)-$('div#'+nodeId).outerHeight()/2);
console.log((parentDivWidth/2)-$('div#'+nodeId).outerWidth()/2);


	nodeId = 'node4Id';
	nodeGroupId = 'node4GroupId';
	nodeNameId = 'node4NameId';
	nodeFrequencyId = 'node4FrequencyId';
	nodeLinkId = 'node4LinkId';

	$(parentDiv).append("<div id='"+nodeId+"' class='node'><div id='"+nodeGroupId+"' class='nodeGroup'><div id='"+nodeNameId+"' class='nodeName'>Approved</div><div id='"+nodeFrequencyId+"' class='nodeFrequency'>4</div><div id='"+nodeLinkId+"' class='nodeLink'><a href=''> Lookup</a></div></div></div>" );
	$('div#'+nodeId).css(	{"position":"absolute",
							"top":(parentDivHeight/2)-$('div#'+nodeId).outerHeight()/2,
							"left":(3*parentDivWidth/4)-$('div#'+nodeId).outerWidth()/2
							}
	);

console.log((parentDivHeight/2)-$('div#'+nodeId).outerHeight()/2);
console.log((3*parentDivWidth/4)-$('div#'+nodeId).outerWidth()/2);

	///this will be in loop ENDS

	var endId = 'endId';
	$(parentDiv).append("<div id='"+endId+"' class='endNode'></div>" );
	$('div#'+endId).css(	{"position":"absolute",
							"top":(parentDivHeight/2)-$('div#'+startId).height()/2,
							"right":"5px"
							}
	);

	//connect divs STARTS
	jsPlumb.bind("ready", function() {

		// this is the paint style for the connecting lines..		
		var connectorPaintStyle = {
			lineWidth:4,
			strokeStyle:"#61B7CF",
			joinstyle:"round",
			outlineColor:"white",
			outlineWidth:2
		},
		// .. and this is the hover style. 
		connectorHoverStyle = {
			lineWidth:4,
			strokeStyle:"#216477",
			outlineWidth:2,
			outlineColor:"white"
		}
		endpointHoverStyle = {
			fillStyle:"#216477",
			strokeStyle:"#216477"
		},
		jsPlumb.connect({ source:"startId", target:"node1Id", anchors:["Right", "Left"], connector:[ "Straight"],  endpoints:["Blank","Blank"] });
		jsPlumb.connect({ source:"node1Id", target:"node2Id", anchors:["Right", "Left"], connector:[ "Straight"],  endpoints:["Blank","Blank"] });
		jsPlumb.connect({ source:"node1Id", target:"node3Id", anchors:["Right", "Left"], connector:[ "Straight"],  endpoints:["Blank","Blank"] });
		jsPlumb.connect({ source:"node2Id", target:"node4Id", anchors:["Right", "Left"], connector:[ "Straight"],  endpoints:["Blank","Blank"] });
		jsPlumb.connect({ source:"node3Id", target:"node4Id", anchors:["Right", "Left"], connector:[ "Straight"],  endpoints:["Blank","Blank"] });
		jsPlumb.connect({ source:"node4Id", target:"endId", anchors:["Right", "Left"], connector:[ "Straight"],  endpoints:["Blank","Blank"] });
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
var counter = 888888888;
function refreshStatusCount(){
	setTimeout( function () {
		counter = counter+1;
		$('#node1FrequencyId').fadeOut('slow').text(counter).fadeIn('slow');
		refreshStatusCount();
	}, 2000);
}