var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AppMonitorProvider = function(host, port) {
  this.db= new Db('omappdb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}), {w:1});
  this.db.open(function(){});
};


AppMonitorProvider.prototype.getCollection= function(callback) {
  this.db.collection('appflownodes', function(error, appflownodes_collection) {
    if( error ) callback(error);
    else callback(null, appflownodes_collection);
  });
};

//find all appstasuses
AppMonitorProvider.prototype.findAll = function(callback) {
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

//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('omappdb', server);
 
//db.open(function(err, db) {
//    if(!err) {
//        console.log("Connected to 'omappdb' database");
//    }
//});

AppMonitorProvider.prototype.findAllAppFlowNodes = function(req, res) {
	console.log("findAllAppFlowNodes req res");
    this.getCollection(function(error, appflownodes_collection) {
			console.log("function(error, appflownodes_collection)"+appflownodes_collection);
      if( error ) callback(error)
      else {
        appflownodes_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else res.send(results);
        });
      }
    });
};

AppMonitorProvider.prototype.saveManageFlow = function(flows, callback) {
	console.log("start saveManageFlow");
	var self = this;
	this.deleteflows(function(error){
		self.db.collection('flows', function(error, flows_collection) {
			if( error ) callback(error)
			else {
				flows_collection.insert(flows,function(error, flows_collection) {
					if( error ) callback(error)
					else {
							callback(null, flows_collection);
						}
					});
			}
		});
	});
};

AppMonitorProvider.prototype.deleteflows = function(callback) {
	this.db.collection('flows', function(error, flows_collection) {
		if( error ) callback(error)
		else {
			flows_collection.remove(function(error) {
				if( error ) callback(error)
				else {
					callback(null);
				}
			});
		}
	});
};

exports.AppMonitorProvider = AppMonitorProvider;