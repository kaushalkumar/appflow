var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var appNumber = 0;

AppDataProvider = function(host, port) {
  this.db= new Db('omappdb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}), {w:1});
  this.db.open(function(){});
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

//persist application
AppDataProvider.prototype.persistApplication = function(applicantName, loanAmount, statuscode, callback) {
	var self = this;
	var data = {"appnumber":appNumber,"applicantname":applicantName,"loanamount":loanAmount,"appstatuscode":statuscode};
	console.log(data);
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
				if(appNumber == 0) {
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


exports.AppDataProvider = AppDataProvider;