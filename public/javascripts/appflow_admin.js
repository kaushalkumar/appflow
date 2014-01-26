window.onload = function() {
	highlightMenu('menu_admin');
}

var appData = [];
var invertvalObj;
/*Function to ramdomly create/update/delete application.
Interval of 5 sec is used.
*/
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

	var operations = ['Create','Create','Create', 'Update', 'Delete'];//added 'Create' 3 times to increase its probability in getting selected
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
		$("#autoAppCrUpDlStatusDivId").fadeOut('slow').text('Started...').fadeIn('slow');
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
						$("#autoAppCrUpDlStatusDivId").fadeOut('slow').text(msg).fadeIn('slow');
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
						$("#autoAppCrUpDlStatusDivId").fadeOut('slow').text(msg).fadeIn('slow');
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
						$("#autoAppCrUpDlStatusDivId").fadeOut('slow').text(msg).fadeIn('slow');
					},  
					async:   false
				}); 

			  break;
			}
		
		},5000);
		console.log(invertvalObj);
	} else {
		//if pause
		$("#autoAppCrUpDlStatusDivId").fadeOut('slow').text('Paused.').fadeIn('slow');
		console.log(invertvalObj);
		clearInterval(invertvalObj);
	}

}

/*function to reset DB*/
function resetDB(){
	console.log('resetDB');
	$.ajax({
		type: 'post',
		url: '/clearDB',
		dataType: "html",
		success : function(msg){  
			console.log(msg);
			$("#resetDBStatusDivId").fadeOut('slow').text(msg).fadeIn('slow');
		},  
		async:   false
	});  

	$.ajax({
		type: 'post',
		url: '/populateDB',
		dataType: "html",
		success : function(msg){  
			console.log(msg);
			$("#resetDBStatusDivId").fadeOut('slow').text(msg).fadeIn('slow');
		},  
		async:   false
	}); 
}