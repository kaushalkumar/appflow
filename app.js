
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

app.get('/fetchNodeFrequencyData',function(req, res){
  appdataprovider.fetchNodeFrequencyData(function(error, appdataFeq){
    if (req.method == 'GET') {
		res.send(appdataFeq);
    }
  });
});

app.get('/', function(req, res){
  appdataprovider.findAppIndexPageData(function(error, appdatas, appstatuses, appflownodes){
      res.render('index', {
            appdatas:appdatas, 
            appstatuses:appstatuses,
            appflownodes:appflownodes
        });
  });
});

app.get('/index', function(req, res){
  appdataprovider.findAppIndexPageData(function(error, appdatas, appstatuses, appflownodes){
      res.render('index', {
            appdatas:appdatas, 
            appstatuses:appstatuses,
            appflownodes:appflownodes
        });
  });
});

app.get('/manage', function(req, res){
  appdataprovider.findAllAppStatuses(function(error, appstatuses){
      res.render('manage', {
            appstatuses:appstatuses
        });
  });
});

app.post('/manage', function(req, res) {
  console.log(req.body);
  appmonitorprovider.saveManageFlow(req.body, function(error, data){
      res.contentType('json');
      //res.send({ data: JSON.stringify({response:'json'}) });
      res.send({ data: 'mushfik'});
      //res.render('manage', {
       //     appstatuses:appstatuses
        //});
  });
});


app.get('/appCreate', function(req, res){
  appdataprovider.findAllAppStatuses(function(error, appstatuses){
      res.render('appCreate', {
            appstatuses:appstatuses
        });
  });
});

//Save application
app.post('/appCreate', function(req, res){
  appdataprovider.saveApplication(req.param('applicantName'), req.param('loanAmount'), req.param('statuscode'), function(error, appdatas, appstatuses){
      res.render('appSearch', {
            statuscode:req.param('statuscode'),
            appdatas:appdatas, 
            appstatuses:appstatuses
        });
  });
});

//Persist application
app.post('/appPersist', function(req, res){
  appdataprovider.persistApplication(req.param('applicantName'), req.param('loanAmount'), req.param('statuscode'), function(error, msg){
      if(error) {}
	  else res.send(msg);
  });
});

//Update application
app.post('/appUpdate', function(req, res){
  appdataprovider.updateApplication(req.param('_id'), req.param('appNumber'), req.param('applicantName'), req.param('loanAmount'), req.param('statuscode'), function(error, msg){
      if(error) {}
	  else res.send(msg);
  });
});

//Delete application
app.post('/appDelete', function(req, res){
  appdataprovider.deleteApplication(req.param('_id'), function(error, msg){
      if(error) {}
	  else res.send(msg);
  });
});


app.get('/appSearch', function(req, res){
 if (req.param('statuscode')==null){
  appdataprovider.findAppSearchPageData(function(error, appdatas, appstatuses){
      res.render('appSearch', {
            appdatas:appdatas, 
            appstatuses:appstatuses
        });
      });
  } else {
      appdataprovider.findAppSearchPageDataByStatus(req.param('statuscode'),function(error, appdatas, appstatuses){
      res.render('appSearch', {
            statuscode:req.param('statuscode'),
            appdatas:appdatas, 
            appstatuses:appstatuses
        });
      });
  }
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

app.get('/getStatuses', function(req, res){
  appdataprovider.findAllAppStatuses(function(error, appstatuses){
      if(error) {}
	  else res.send(appstatuses);
  });
});

app.get('/getAppDatas', function(req, res){
  appdataprovider.findAllAppData(function(error, appdatas){
      if(error) {}
	  else res.send(appdatas);
  });
});

app.get('/admin', function(req, res){
  appdataprovider.findAllAppStatuses(function(error, appstatuses){
      res.render('admin', {
            appstatuses:appstatuses
        });
  });
});

app.post('/saveStatus', function(req, res){
  appdataprovider.saveStatus(req.param('statuscode'), req.param('status'), function(error, appstatuses){
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
