
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var AppMonitorProvider = require('./appmonitorprovider').AppMonitorProvider;
var AppDataProvider = require('./appdataprovider').AppDataProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var appmonitorprovider= new AppMonitorProvider('localhost', 27017);
var appdataprovider= new AppDataProvider('localhost', 27017);

//Routes

app.get('/', function(req, res){
  appmonitorprovider.findAll(function(error, appflownodes){
      res.render('index', {
            appflownodes:appflownodes
        });
  });
});

app.get('/index', function(req, res){
  appmonitorprovider.findAll(function(error, appflownodes){
      res.render('index', {
            appflownodes:appflownodes
        });
  });
});

app.get('/manage', function(req, res){
  appmonitorprovider.findAll(function(error, appflownodes){
      res.render('manage', {
            appflownodes:appflownodes
        });
  });
});

app.get('/appCreate', function(req, res){
  appmonitorprovider.findAll(function(error, appflownodes){
      res.render('appCreate', {
            appflownodes:appflownodes
        });
  });
});

app.get('/appSearch', function(req, res){
  appdataprovider.findAppSearchPageData(function(error, appdatas, appstatuses){
      res.render('appSearch', {
            appdatas:appdatas, 
            appstatuses:appstatuses
        });
  });
});

app.post('/appSearch', function(req, res){
  appdataprovider.findAppSearchPageDataByStatus(req.param('statuscode'),function(error, appdatas, appstatuses){
      res.render('appSearch', {
            statuscode:req.param('statuscode'),
            appdatas:appdatas, 
            appstatuses:appstatuses
        });
  });
});

app.get('/manageStatus', function(req, res){
  appdataprovider.findAllAppStatuses(function(error, appstatuses){
      res.render('manageStatus', {
            appstatuses:appstatuses
        });
  });
});

app.post('/manageStatus', function(req, res){
  appmonitorprovider.saveStatus(req.param('statuscode'), req.param('status'), function(error, appstatuses){
      res.render('manageStatus', {
            appstatuses:appstatuses
        });
  });
});

//search application 
/*
app.post('/appSearch', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});
*/
/**
 * HTTP GET /tasks
 * Returns: the list of tasks in JSON format
 */
app.get('/appflownodes', function(req, res){
  appmonitorprovider.findAllAppFlowNodes(req, res)
  }
);

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
