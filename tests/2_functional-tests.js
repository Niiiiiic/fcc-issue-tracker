/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      //test 1
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
         // console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(!(new Date(res.body.created_on) == 'Invalid Date'), true);
          assert.equal(!isNaN(new Date(res.body.created_on)), true);
          assert.equal(!(new Date(res.body.updated_on) == 'Invalid Date'), true);
          assert.equal(!isNaN(new Date(res.body.updated_on)), true);
          assert.equal(res.body.open, true);
          assert.equal(res.body.hasOwnProperty('_id'), true);         
          done();
        });
      });
      //test 2
      test('Required fields filled in', function(done) {
               chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
         // console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(!(new Date(res.body.created_on) == 'Invalid Date'), true);
          assert.equal(!isNaN(new Date(res.body.created_on)), true);
          assert.equal(!(new Date(res.body.updated_on) == 'Invalid Date'), true);
          assert.equal(!isNaN(new Date(res.body.updated_on)), true);
          assert.equal(res.body.open, true);
          assert.equal(res.body.hasOwnProperty('_id'), true);         
          done();
        });
      });
      //test 3
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
         // console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing required fields');      
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      //test 4
      test('No body', function(done) {
              chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5d977b92a5c611069d67c1eb',
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: '',
          open: ''
        })
        .end(function(err, res){
          console.log(res.text)
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no updated field sent');      
          done();
        });
      });

      // test 5
      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5d977b92a5c611069d67c1eb',
          issue_title: 'new title2',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: '',
          open: ''
        })
        .end(function(err, res){
          // console.log(res.text)
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');      
          done();
        });
      });
      // test 6
      test('Multiple fields to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5d977b92a5c611069d67c1eb',
          issue_title: 'new title2',
          issue_text: 'new text',
          created_by: 'me',
          assigned_to: '',
          status_text: '',
          open: 'false'
        })
        .end(function(err, res){
          // console.log(res.text)
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');      
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      //test 7
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.equal(res.body[0].issue_title, 'Title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title',
                issue_text: 'text'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.equal(res.body[0].issue_title, 'Title');
          assert.property(res.body[0], 'issue_text');
          assert.equal(res.body[0].issue_text, 'text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          // assert.property(res.body[0].open, true);
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({issue_title: 'Title',
                issue_text: 'text'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error'); 
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: '5d977bc68e505f081416797a'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted 5d977bc68e505f081416797a'); 
          done();
        });
      });
      
    });

});
