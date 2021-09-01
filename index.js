let timerString = "Server startup took";
console.time(timerString);

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
let cors = require('cors');
let authController = require('./authController');
let errorHandler = require('./errorHandler');
let mongoDbLink = '';

function setupDatabaseConnection(databaseString) {
	// Removed since Task C doesn't require a database connection
  app.emit('ready');
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

	// This must come after the parser is selected
	// See https://javascript.tutorialink.com/getting-typeerror-cannot-read-property-name-of-undefined-while-posting-the-form-node-js/
  app.use('/c', authController);
  app.use(errorHandler);
	
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
