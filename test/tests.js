// To be tested
let resthub = require('../index');

// Dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

// Setup
chai.use(chaiHttp);
let should = chai.should();

let model = {
	name: "John Doe",
	email: "johndoe@email.com",
	gender: "Male",
	phone: "91234567"
};

let updatedModel = {
	name: "Jane Doe",
	email: "janedoe@email.com",
	gender: "Female",
	phone: "92345678"
};

var requester = chai.request(resthub).keepOpen();

// Tests
describe('API endpoint testing', function() {
	// We'll use these to store created and updated contacts to check against later.
	let createdContact = null;
	let updatedContact = null;
	
	// Wait for the server to be ready before starting testing
	// See: https://mrvautin.com/ensure-express-app-started-before-tests/
	before(function(done) {
		resthub.on('ready', function() {
			done();
		});
	});
	
	describe('Test basic connectivity', function() { 
		it('Should connect to API endpoint', function(done) {
			requester.get('/api')
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(200);
					done();
				});
		});
	});
	
	describe('Clear database', function() {
		it('Should clear database', function(done) {
			requester.delete('/api/contacts')
			.end((err, res) => {
				if (err) {
					done(err);
				}
				res.should.have.status(200);
				done();
			});
		});
	});
	
	describe('Check that contact list is empty', function() {
		it('Contact list should be empty', function(done) {
			requester.get('/api/contacts')
					.end((err, res) => {
						if (err) {
							done(err);
						}
						res.should.have.status(200);
						res.should.be.an('object');
						res.body.message.should.be.eql('Contacts retrieved successfully');
						res.body.should.have.property('data');
						res.body.data.length.should.be.eql(0);
						done();
					});
		});
	});
	
	describe('Create a new contact', function() {
		it('A new contact should be created', function(done) {
			requester.post('/api/contacts')
				.send(model)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('New contact created!');
					res.body.should.have.property('data');
					res.body.data.name.should.be.eql(model.name);
					res.body.data.email.should.be.eql(model.email);
					res.body.data.gender.should.be.eql(model.gender);
					res.body.data.phone.should.be.eql(model.phone);
					createdContact = res.body.data;
					done();
				});
		});
	});
	
	describe('Check that the new contact is reflected in the database', function() {
		it('The same new contact should be reflected in the database', function(done) {
			requester.get('/api/contacts')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('Contacts retrieved successfully');
					res.body.should.have.property('data');
					res.body.data.length.should.be.eql(1);
					res.body.data[0]._id.should.be.eql(createdContact._id);
					res.body.data[0].name.should.be.eql(model.name);
					res.body.data[0].email.should.be.eql(model.email);
					res.body.data[0].gender.should.be.eql(model.gender);
					res.body.data[0].phone.should.be.eql(model.phone);
					done();
				});
		});
	});
	
	describe('Update the contact', function() {
		it('The contact should be updated', function(done) {
			requester.put('/api/contacts' + '/' + createdContact._id)
				.send(updatedModel)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('Contact Info updated');
					res.body.should.have.property('data');
					res.body.data.name.should.be.eql(updatedModel.name);
					res.body.data.email.should.be.eql(updatedModel.email);
					res.body.data.gender.should.be.eql(updatedModel.gender);
					res.body.data.phone.should.be.eql(updatedModel.phone);
					updatedContact = res.body.data;
					done();
				});
		});
	});
	
	describe('Check that the updated contact is reflected in the database', function() {
		it('The updated contact should be reflected in the database', function(done) {
			requester.get('/api/contacts')
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.an('object');
						res.body.message.should.be.eql('Contacts retrieved successfully');
						res.body.should.have.property('data');
						res.body.data.length.should.be.eql(1);
						res.body.data[0]._id.should.be.eql(updatedContact._id);
						res.body.data[0].name.should.be.eql(updatedModel.name);
						res.body.data[0].email.should.be.eql(updatedModel.email);
						res.body.data[0].gender.should.be.eql(updatedModel.gender);
						res.body.data[0].phone.should.be.eql(updatedModel.phone);
						done();
					});
		});
	});
	
	describe('Delete contact', function() {
		it('The contact should be deleted', function(done) {
			requester.delete('/api/contacts' + '/' + updatedContact._id)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('Contact deleted');
					done();
				});
		});
	});
	
	describe('Check that the contact is deleted', function() {
		it('Contact deletion should be reflected in the database', function(done) {
			requester.get('/api/contacts')
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.an('object');
						res.body.message.should.be.eql('Contacts retrieved successfully');
						res.body.should.have.property('data');
						res.body.data.length.should.be.eql(0);
						done();
					});
		});
	});
});