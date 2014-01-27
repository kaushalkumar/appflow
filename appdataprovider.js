var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var appNumber = 0;

AppDataProvider = function(host, port) {
  this.db= new Db('omappdb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}), {w:1});
  this.db.open(function(err, db){
	if(!err) {
        console.log("Connected to 'omappdb' database");
    } 
  });
};

AppDataProvider.prototype.getCollection= function(callback) {
  this.db.collection('appflownodes', function(error, appflownodes_collection) {
    if( error ) callback(error);
    else callback(null, appflownodes_collection);
  });
};

AppDataProvider.prototype.getFlowsCollection= function(callback) {
  this.db.collection('flows', function(error, appflownodes_collection) {
    if( error ) callback(error);
    else callback(null, appflownodes_collection);
  });
};

AppDataProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, appflownodes_collection) {
      if( error ) callback(error)
      else {
        appflownodes_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

AppDataProvider.prototype.getAppDataCollection= function(callback) {
  this.db.collection('appdatas', function(error, appdatas_collection) {
    if( error ) callback(error);
    else callback(null, appdatas_collection);
  });
};

AppDataProvider.prototype.getStatusCollection= function(callback) {
  this.db.collection('appstatuses', function(error, appstatuses_collection) {
    if( error ) callback(error);
    else callback(null, appstatuses_collection);
  });
};

//find all appdatas
AppDataProvider.prototype.findAllAppData = function(callback) {
    this.getAppDataCollection(function(error, appdatas_collection) {
      if( error ) callback(error)
      else {
        appdatas_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find all appstatuses and populates appnumber (if not populated earlier)
AppDataProvider.prototype.findAllAppStatuses = function(callback) {
	if(appNumber == 0) {
		this.populateAppNumberFromDB(callback);
	}
    this.getStatusCollection(function(error, appstatuses_collection) {
      if( error ) callback(error)
      else {
        appstatuses_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save app status
AppDataProvider.prototype.saveStatus = function(statuscode, status, callback) {
	var self = this;
    var data = {"appstatus":status,"appstatuscode":statuscode};
	this.db.collection('appstatuses', function(error, appstatuses_collection) {
		if( error ) callback(error)
		else {
	        appstatuses_collection.insert(data,function(error, appstatuses_collection) {
			if( error ) callback(error)
			else {
					self.getStatusCollection(function(error, appstatuses) {
						if( error ) callback(error)
						else {
							appstatuses.find().toArray(function(error, appstatuses) {
							if( error ) callback(error)
							else {
								callback(null, appstatuses);
								}
							});
						}
					});
				}
			});
		}
    });
};

//Stuff for finding data from all the tables
AppDataProvider.prototype.findAppIndexPageData = function(callback) {
	var self = this;
	this.getStatusCollection(function(error, appstatuses_collection) {
		if( error ) callback(error)
		else {
			appstatuses_collection.find().toArray(function(error, appstatuses_collection) {
			if( error ) callback(error)
			else {
					self.getAppDataCollection(function(error, appdatas_collection) {
						if( error ) callback(error)
						else {
							appdatas_collection.find().toArray(function(error, appdatas_collection) {
							if( error ) callback(error)
							else {
									self.getFlowsCollection(function(error, appflownodes_collection) {
										if( error ) callback(error)
											else {
										appflownodes_collection.find().toArray(function(error, appflownodes_collection) {
												if( error ) callback(error)
												else {
													callback(null, appdatas_collection, appstatuses_collection, appflownodes_collection);
												}
									});
								}
							});
						}
					});
				}
			});
		}
	});
		}
	});
};

//Get application status and its count
AppDataProvider.prototype.fetchNodeFrequencyData = function(callback) {
  this.db.collection('appdatas').group(['appstatuscode'], {}, {"count":0}, "function (obj, prev) { prev.count++; }", function(error, appdata_frequency) {
      if( error ) callback(error)
      else {
		callback(null, appdata_frequency)
        }});
};
	
	
//findAppSearchPageData
AppDataProvider.prototype.findAppSearchPageData = function(callback) {
	var self = this;
	this.getStatusCollection(function(error, appstatuses_collection) {
		if( error ) callback(error)
		else {
			appstatuses_collection.find().toArray(function(error, appstatuses_collection) {
			if( error ) callback(error)
			else {
					self.getAppDataCollection(function(error, appdatas_collection) {
						if( error ) callback(error)
						else {
							appdatas_collection.find().toArray(function(error, appdatas_collection) {
							if( error ) callback(error)
							else {
								console.log(appdatas_collection);
								console.log(appstatuses_collection);
								callback(null, appdatas_collection, appstatuses_collection);
								}
							});
						}
					});
				}
			});
		}
	});
};

//save application
AppDataProvider.prototype.saveApplication = function(applicantName, loanAmount, statuscode, callback) {
	var self = this;
	var data = {"appnumber":appNumber,"applicantname":applicantName,"loanamount":loanAmount,"appstatuscode":statuscode};
	appNumber = appNumber+1;
	this.db.collection('appdatas', function(error, appdatas_collection) {
		if( error ) callback(error)
		else {
			appdatas_collection.insert(data,function(error, appdatas_collection) {
			if( error ) callback(error)
			else {
					self.findAppSearchPageDataByStatus(statuscode,function(error, appdatas, appstatuses) {
						if( error ) callback(error)
						else callback(null, appdatas, appstatuses);
					});
				}
			});
		}
    });
};

//clearDB
AppDataProvider.prototype.clearDB = function(callback) {
	var self = this;
	this.db.collections(function(error, db_collections) {
		if( error ) callback(error)
		else {
			db_collections.forEach(function(db_collection) {
				if(db_collection.collectionName == 'system.indexes') {
					return;
				} else {
					db_collection.drop(function(error, reply){
						if(!error){
							msg = db_collection.collectionName+" dropped Successfully.";
							console.log(msg);
							callback(null, msg);
						} else {
							console.log(error);
						}
					});
				}
			});
			msg = "Database cleared successfully";
			callback(null, msg);
		}
    });
};

//populateDB
AppDataProvider.prototype.populateDB = function(callback) {
	//populate DB
	var appstatuses = [
		{"appstatus":"Submitted","appstatuscode":"APP_STATUS_SUBMITTED"},
		{"appstatus":"Offer Created","appstatuscode":"APP_STATUS_OFFERCREATED"},
		{"appstatus":"Counter Offer Created","appstatuscode":"APP_STATUS_CTROFFERCREATED"},
		{"appstatus":"Approved","appstatuscode":"APP_STATUS_APPROVED"},
		{"appstatus":"Pending Customer Acceptance","appstatuscode":"APP_STATUS_PENCUSTACCEPTANCE"},
		{"appstatus":"Delivered","appstatuscode":"APP_STATUS_DELIVERED"}
	];
	this.db.collection('appstatuses', function(err, collection) {
		collection.insert(appstatuses, {safe:true}, function(err, result) {
			if(!err){
				msg = "appstatuses collection created successfully";
				callback(null, msg);
			}
		});
	});

	var appdatas = [
		{"appnumber":1,"applicantname":"George", "loanamount":"2000", "appstatuscode":"APP_STATUS_SUBMITTED"},
		{"appnumber":2,"applicantname":"Abraham", "loanamount":"2000", "appstatuscode":"APP_STATUS_APPROVED"},
		{"appnumber":3,"applicantname":"Jhon", "loanamount":"2000", "appstatuscode":"APP_STATUS_APPROVED"},
		{"appnumber":4,"applicantname":"Richard", "loanamount":"2000", "appstatuscode":"APP_STATUS_SUBMITTED"},
		{"appnumber":5,"applicantname":"Tom", "loanamount":"2000", "appstatuscode":"APP_STATUS_SUBMITTED"},
		{"appnumber":6,"applicantname":"Simon", "loanamount":"2000", "appstatuscode":"APP_STATUS_OFFERCREATED"},
		{"appnumber":7,"applicantname":"Mary", "loanamount":"2000", "appstatuscode":"APP_STATUS_DELIVERED"},
		{"appnumber":8,"applicantname":"Jim", "loanamount":"2000", "appstatuscode":"APP_STATUS_SUBMITTED"},
		{"appnumber":9,"applicantname":"Sharon", "loanamount":"2000", "appstatuscode":"APP_STATUS_SUBMITTED"},
		{"appnumber":10,"applicantname":"Alicia", "loanamount":"2000", "appstatuscode":"APP_STATUS_OFFERCREATED"},
		{"appnumber":11,"applicantname":"Lara", "loanamount":"2000", "appstatuscode":"APP_STATUS_DELIVERED"}
	];
	this.db.collection('appdatas', function(err, collection) {
		collection.insert(appdatas, {safe:true}, function(err, result) {
			if(!err){
				msg = "appdatas collection created successfully";
				callback(null, msg);
			}
		});
	});

	var flows = [
		{ "nodes" : [ { "id" : "_nodeId1", "appstatus" : "Submitted", "appstatuscode" : "APP_STATUS_SUBMITTED", "top" : "217px", "left" : "81px" }, { "id" : "_nodeId2", "appstatus" : "Offer Created", "appstatuscode" : "APP_STATUS_OFFERCREATED", "top" : "56px", "left" : "258px" }, { "id" : "_nodeId3", "appstatus" : "Counter Offer Created", "appstatuscode" : "APP_STATUS_CTROFFERCREATED", "top" : "388px", "left" : "250px" }, { "id" : "_nodeId4", "appstatus" : "Approved", "appstatuscode" : "APP_STATUS_APPROVED", "top" : "217px", "left" : "363px" }, { "id" : "_nodeId5", "appstatus" : "Pending Customer Acceptance", "appstatuscode" : "APP_STATUS_PENCUSTACCEPTANCE", "top" : "207px", "left" : "564px" }, { "id" : "_nodeId6", "appstatus" : "Delivered","appstatuscode" : "APP_STATUS_DELIVERED", "top" : "217px", "left" : "768px" } ], "connections" : [ { "sourcenode" : "_nodeStartId", "sourceanchor" : "RightMiddle", "targetnode" : "_nodeId1", "targetanchor" : "LeftMiddle" }, { "sourcenode" : "_nodeId1", "sourceanchor" : "BottomCenter", "targetnode" : "_nodeId3", "targetanchor" : "LeftMiddle" }, { "sourcenode" : "_nodeId1", "sourceanchor" : "TopCenter", "targetnode" : "_nodeId2", "targetanchor" : "LeftMiddle" }, { "sourcenode" : "_nodeId2", "sourceanchor" : "RightMiddle", "targetnode" : "_nodeId4", "targetanchor" : "TopCenter" }, { "sourcenode" : "_nodeId3", "sourceanchor" : "RightMiddle", "targetnode" : "_nodeId4", "targetanchor" : "BottomCenter" }, { "sourcenode" : "_nodeId4", "sourceanchor" : "RightMiddle", "targetnode" : "_nodeId5", "targetanchor" : "LeftMiddle" }, { "sourcenode" : "_nodeId5", "sourceanchor" : "RightMiddle", "targetnode" : "_nodeId6", "targetanchor" : "LeftMiddle" }, { "sourcenode" : "_nodeId6", "sourceanchor" : "RightMiddle", "targetnode" : "_nodeEndId", "targetanchor" : "LeftMiddle" } ], "lastNodeNumber" : 6}
	];
	this.db.collection('flows', function(err, collection) {
		collection.insert(flows, {safe:true}, function(err, result) {
			if(!err){
				msg = "flows collection created successfully";
				callback(null, msg);
			}
		});
	});
	msg = "Database populated successfully";
	callback(null, msg);

};

//persist application
AppDataProvider.prototype.persistApplication = function(applicantName, loanAmount, statuscode, callback) {
	var data = {"appnumber":appNumber,"applicantname":applicantName,"loanamount":loanAmount,"appstatuscode":statuscode};
	appNumber = appNumber+1;
	this.db.collection('appdatas', function(error, appdatas_collection) {
		if( error ) callback(error)
		else {
			appdatas_collection.insert(data,function(error, appNumber) {
			if( error ) callback(error)
			else {
				msg = "Application {" + applicantName + ", " + loanAmount + ", " + statuscode + "} created successfully";
				callback(null, msg);
				}
			});
		}
    });
};

// update application
AppDataProvider.prototype.updateApplication = function(appGUID, appNumber, applicantName, loanAmount, statuscode, callback) {
	appNumber = appNumber*1//to preserve the integrity of number
	var data = {"appnumber":appNumber,"applicantname":applicantName,"loanamount":loanAmount,"appstatuscode":statuscode};
    this.db.collection('appdatas', function(error, appdatas_collection) {
      if( error ) callback(error);
      else {
        appdatas_collection.update(
			{_id: appdatas_collection.db.bson_serializer.ObjectID.createFromHexString(appGUID)},
			data,
			function(error, data) {
					if(error) callback(error);
					else {
						msg = "Application {" + applicantName + ", " + loanAmount + ", " + statuscode + "} updated successfully";
						callback(null, msg);
					}
			}
		);
      }
    });
};

//delete application
AppDataProvider.prototype.deleteApplication = function(appGUID, callback) {
        this.db.collection('appdatas', function(error, appdatas_collection) {
                if(error) callback(error);
                else {
                        appdatas_collection.remove(
                                {_id: appdatas_collection.db.bson_serializer.ObjectID.createFromHexString(appGUID)},
                                function(error, employee){
                                        if(error) callback(error);
                                        else {
											msg = "Application {" + appGUID + "} deleted successfully";
											callback(null, msg);
										}
                                });
                        }
        });
};
//populateAppNumberFromDB
AppDataProvider.prototype.populateAppNumberFromDB= function(callback){
	  this.db.collection('appdatas', function(error, appdatas_collection) {
		if( error ) {
			callback(error);
		} else {
			appdatas_collection.find().sort([['appnumber', -1]]).limit(1).nextObject(function(err, appWithMaxAppNumber) {
				if(appWithMaxAppNumber!=null && appNumber == 0) {
					appNumber = appWithMaxAppNumber.appnumber+1;
				}
			});
		}
	  });
	}


//findAppSearchPageDataByStatus
AppDataProvider.prototype.findAppSearchPageDataByStatus = function(statuscode, callback) {
	var self = this;
	this.getStatusCollection(function(error, appstatuses_collection) {
		if( error ) callback(error)
		else {
			appstatuses_collection.find().toArray(function(error, appstatuses_collection) {
			if( error ) callback(error)
			else {
					self.getAppDataCollection(function(error, appdatas_collection) {
						if( error ) callback(error)
						else {
							if(statuscode == '*') {
							appdatas_collection.find().toArray(function(error, appdatas_collection) {
							if( error ) callback(error)
							else {
								console.log(appdatas_collection);
								console.log(appstatuses_collection);
								callback(null, appdatas_collection, appstatuses_collection);
								}
							});
							} else {
								appdatas_collection.find({appstatuscode:statuscode}).toArray(function(error, appdatas_collection) {
								if( error ) callback(error)
								else {
									console.log(appdatas_collection);
									console.log(appstatuses_collection);
									callback(null, appdatas_collection, appstatuses_collection);
									}
								});
							}
						}
					});
				}
			});
		}
	});
};

AppDataProvider.prototype.findManageFlowPageData = function(callback) {
	var self = this;
	this.getStatusCollection(function(error, appstatuses_collection) {
		if( error ) callback(error)
		else {
			appstatuses_collection.find().toArray(function(error, appstatuses_collection) {
			if( error ) callback(error)
			else {
					self.getFlowsCollection(function(error, appflownodes_collection) {
						if( error ) callback(error)
						else {
							appflownodes_collection.find().toArray(function(error, appflownodes_collection) {
							if( error ) callback(error)
							else {
								callback(null, appstatuses_collection, appflownodes_collection);
							}
					});
				}
			});
		}
	});
		}
	});
};

exports.AppDataProvider = AppDataProvider;