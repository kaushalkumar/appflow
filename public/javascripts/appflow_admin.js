window.onload = function() {
	highlightMenu('menu_admin');
	refreshStatusCount();
}

function autoAppCrUpDl(){
	console.log('autoAppCrUpDl');
     $("#startPauseButtonId").text(function(i, text){
          return text === "Start" ? "Pause" : "Start";
      });

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