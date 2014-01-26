window.onload = function() {
	highlightMenu('menu_admin');
	refreshStatusCount();
}

var appData = [];
var invertvalObj;

function autoAppCrUpDl(){
	var applicantnames = [	'Oliver','Jack','William','Leo','Ben',
							'Jude','Lewis','Ryan','Teddy','Daniel',
							'Eliza','Poppy','Hannah','Victoria','Grace',
							'Isla','Ruby','Erin','Amelie','Darcy'];
	var loanAmounts = [	2000,3000,4000,5000,6000,
						7000,8000,9000,10000,11000,
						12000,13000,14000,15000,16000,
						17000,18000,19000,20000,21000];
	var appStatuses = [];

	var operations = ['Create', 'Update', 'Delete'];
	$.ajax({
		type: 'get',
		url: '/getStatuses',
		dataType: "json",
		success : function(appstatuses){  
			appStatuses = appstatuses;
		},  
		async:   false
	});  
	
	var startFlag = false;
	//toggle label
	 $("#startPauseButtonId").text(function(i, text){
		 if(text === "Start") {
			 startFlag = true;
			return "Pause";
		 } else {
			 startFlag = false;
			 return "Start";
		 }
      });



	//if start
	if (startFlag)
	{
		$("#autoAppCrUpDlStatusDivId").text('Started...');
		invertvalObj = setInterval(function(){
			var operationName = operations[Math.floor(Math.random() * operations.length)];
	
			switch(operationName)
			{
			case 'Create':
				var applicantName = applicantnames[Math.floor(Math.random() * applicantnames.length)];
				var loanAmount = loanAmounts[Math.floor(Math.random() * loanAmounts.length)];
				var statuscode = appStatuses[Math.floor(Math.random() * appStatuses.length)];
				$.ajax({
					type: 'post',
					url: '/appPersist',
					dataType: "html",
					data : {applicantName: applicantName, 
							loanAmount: loanAmount,
							statuscode: statuscode.appstatuscode
					},
					success : function(msg){
						$("#autoAppCrUpDlStatusDivId").text(msg);
					},  
					async:   false
				}); 

				break;
			case 'Update':
				$.ajax({
					type: 'get',
					url: '/getAppDatas',
					dataType: "json",
					success : function(appDatas){  
						appData = appDatas;
					},  
					async:   false
				});  
				var appToUpdate = appData[Math.floor(Math.random() * appData.length)];
				var loanAmount = loanAmounts[Math.floor(Math.random() * loanAmounts.length)];
				var statuscode = appStatuses[Math.floor(Math.random() * appStatuses.length)];
				$.ajax({
					type: 'post',
					url: '/appUpdate',
					dataType: "html",
					data : {_id: appToUpdate._id,
							appNumber: appToUpdate.appnumber,
							applicantName: appToUpdate.applicantname, 
							loanAmount: loanAmount,
							statuscode: statuscode.appstatuscode
					},
					success : function(msg){
						$("#autoAppCrUpDlStatusDivId").text(msg);
					},  
					async:   false
				}); 
			  break;
			case 'Delete':
				$.ajax({
					type: 'get',
					url: '/getAppDatas',
					dataType: "json",
					success : function(appDatas){  
						appData = appDatas;
					},  
					async:   false
				}); 
				var appToDelete = appData[Math.floor(Math.random() * appData.length)];
				$.ajax({
					type: 'post',
					url: '/appDelete',
					dataType: "html",
					data : {_id: appToDelete._id
						},
					success : function(msg){
						$("#autoAppCrUpDlStatusDivId").text(msg);
					},  
					async:   false
				}); 

			  break;
			}
		
		},5000);
		console.log(invertvalObj);
	} else {
		//if pause
		$("#autoAppCrUpDlStatusDivId").text('Paused');
		console.log(invertvalObj);
		clearInterval(invertvalObj);
	}

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