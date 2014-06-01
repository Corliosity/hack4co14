//Define all modules needed for our application
var express = require("express"),
	routes = require("./routes"),
	path =  require("path"),
	db = require("mongojs").connect('backbone_users', ['users']);
	neighdb = require("mongojs").connect('backbone_neighbor', ['neighbors']);
var app = express();
var api_user = 'find_me';
var api_key = 'findmehere';
var sendgrid  = require('sendgrid')(api_user, api_key);

//Define app specific content, and locations
app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname, '/site'));
app.use(express.errorHandler({dumpExceptions: true, showStack: true})); 


app.get('/', function(req, res){
  db.users.find().sort({ $natural: -1 }, function(err, users) {
  	res.render('index.jade', {
  		pageTitle: 'Express',
  		users: JSON.stringify(users),
  		layout: false
  	});
  });
});

app.get('/esri', routes.esriMap);

app.get('/signIn', routes.signIn);
app.get('/social', routes.social);
app.get('/alittlemore', routes.more);

app.post('/api/users', function(req, res) {
	db.users.save(req.body, function(err, user) {
		res.json(user, 201);
	});
});

app.get('/api/users', function(req, res) {
	db.users.find().sort({ $natural: -1 }, function(err, users) {
		res.json(users);
	});
});

app.get('/api/users/:id', function(req, res) {
	db.users.findOne({_id: db.ObjectId(req.params.id)}, function(err, users) {
		res.json(user);
	});
});

app.put('/api/users/:id', function(req, res) {
	db.users.update({_id: db.ObjectId(req.params.id)}, {$set: {title: req.body}}, function(err, user) {
		res.json(200);
	})
});

app.delete('/api/users/:id', function(req, res) {
	db.users.remove({_id: db.ObjectId(req.params.id)}, function(err, user) {
		res.send();
	})
});

app.post('/api/neighbors', function(req, res) {
	neighdb.neighbors.save(req.body, function(err, neighbor) {
		res.json(neighbor, 201);
	});
});

app.get('/api/neighbors', function(req, res) {
	neighdb.neighbors.find().sort({ $natural: -1 }, function(err, neighbors) {
		res.json(neighbors);
	});
});

app.get('/api/neighbors/:id', function(req, res) {
	neighdb.neighbors.findOne({_id: db.ObjectId(req.params.id)}, function(err, neighbors) {
		res.json(neighbors);
	});
});

app.put('/api/neighbors/:id', function(req, res) {
	neighdb.neighbors.update({_id: db.ObjectId(req.params.id)}, {$set: {title: req.body}}, function(err, neighbors) {
		res.json(200);
	})
});

app.delete('/api/neighbors/:id', function(req, res) {
	neighdb.neighbors.remove({_id: db.ObjectId(req.params.id)}, function(err, neighbors) {
		res.send();
	})
});

var port = 3000;
app.listen(port, function() {
	console.log('Application is starting');
});