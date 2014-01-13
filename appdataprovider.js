var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AppDataProvider = function(host, port) {
  this.db= new Db('omappdb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}), {w:1});
  this.db.open(function(){});
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

//find all appstatuses
AppDataProvider.prototype.findAllAppStatuses = function(callback) {
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