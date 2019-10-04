/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let options = req.query;
      // console.log(options);
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.db('issues').collection(project)
          .find(options)
          .toArray((err, doc) => {
            // console.log(doc);
            if (err) {
            console.log(err);
            } else {
            res.send(doc);
            }
        })
      })
  })
    
    .post(function (req, res){
      var project = req.params.project;
        // console.log(req.body, project);
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
      db.db('issues').collection(project)
        .insertOne({issue_title: req.body.issue_title || '',
                    issue_text: req.body.issue_text || '',
                    created_by: req.body.created_by || '',
                    assigned_to: req.body.assigned_to || '',
                    status_text: req.body.status_text || '',
                    created_on: new Date(),
                    updated_on: new Date(),
                    open: true}, (err,doc) => {
        if (err) {
          // res.redirect('/');
        } else if (doc.ops[0].issue_title == '' || doc.ops[0].issue_text == '' || doc.ops[0].created_by == '') {
          res.json({error: 'missing required fields'})
        } else{
           // console.log(doc.ops[0])
          res.json(doc.ops[0]);
        }
      })
      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      // console.log(req.body._id)
            MongoClient.connect(CONNECTION_STRING, function(err, db) {
      db.db('issues').collection(project)
        .findOne({_id: ObjectId(req.body._id)}, (err, data) =>{
            if (err) {
                res.json({error : 'error'})
            } else if(data) {
               let obj = {issue_title: req.body.issue_title || '',
                          issue_text: req.body.issue_text || '',
                          created_by: req.body.created_by || '',
                          assigned_to: req.body.assigned_to || '',
                          status_text: req.body.status_text || '',
                          open: req.body.open || ''
                         }
                if (obj.issue_title == '' && obj.issue_text == '' && obj.created_by == '' && obj.assigned_to == ''
                     && obj.status_text == '' && obj.open == '') {
                  // console.log('no body')
                  res.send('no updated field sent');
                } else {
                  // console.log(data, obj.issue_title);
                  if (obj.issue_title !== '') {data.issue_title = obj.issue_title;}
                  if (obj.issue_text !== '') {data.issue_text = obj.issue_text;}
                  if (obj.created_by !== '') {data.created_by = obj.created_by;}
                  if (obj.assigned_to !== '') {data.assigned_to = obj.assigned_to;}
                  if (obj.open !== '') {data.open = obj.open;}
                  if (obj.status_text !== '') {data.status_text = obj.status_text;}

                  data.updated_on = new Date;
                  // console.log(data.issue_title)
                  db.db('issues').collection(project).save(data).then(update => {
                    // console.log('im in here');
                    res.send('successfully updated')
                  }).catch(error => {
                    // console.log('could not save')
                    res.send('could not update ' + req.body._id)
                  })
                }

            } else {
              return res.json({error: 'user does not exist'})
            }
        }) // end findOne
      }); // end database connect
    }) // end put
    
    .delete(function (req, res){
      var project = req.params.project;
      if(!req.body._id) {
        res.send('_id error');
      } else {
       MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.db('issues').collection(project)
         .remove( { _id: ObjectId(req.body._id) }, true ).then( () => { 
           res.send('deleted ' + req.body._id);
        }).catch(err => {
          res.send('could not delete ' + req.body._id);
        })
      }); 
      }

    });
    
};
