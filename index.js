let timerString = "Server startup took";
console.time(timerString);

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
let apiRoutes = require("./api-routes");
let cors = require('cors');
let mongoDbLink = 'mongodb+srv://cs3219-otot:cs3219-otot@cs3219-otot-task-b.lyitf.mongodb.net/cs3219-otot-task-b?retryWrites=true&w=majority';

function setupDatabaseConnection(databaseString) {
	mongoose.connect(mongoDbLink, { useNewUrlParser: true});
	var db = mongoose.connection;
	db.on('error', function() {
		console.log("Error connecting to " + mongoDbLink);
	});

	db.once('open', function() {
		console.log("Successfully connected to " + mongoDbLink);
		app.emit('ready');
	});
}

function setupServer() {
	// Use CORS middleware
	app.use(cors());
	
	// Configure bodyparser to handle post requests
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	
	// Setup server port
	var port = process.env.PORT || 8080;

	// Send message for default URL
	app.get('/', (req, res) => res.send('Hello World with Express'));

	// Use Api routes in the App
	// This must come after the parser is selected
	// See https://javascript.tutorialink.com/getting-typeerror-cannot-read-property-name-of-undefined-while-posting-the-form-node-js/
	app.use('/api', apiRoutes);
	
	app.on('ready', function() {
		app.listen(port, function () {
			console.log("RestHub (port " + port + ") is ready!");
			console.timeEnd(timerString);
		});
	});	
}

setupServer();
setupDatabaseConnection(mongoDbLink);

// For testing
module.exports = app;
