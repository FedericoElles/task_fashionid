'use strict';


// promises
var Q = require('q');

// read file
var fs = require('fs');
var promiseReadFile = Q.denodeify(fs.readFile);
 
// web server
var express = require('express');
var app = express(); 

// CSV converter
var Converter = require("csvtojson").core.Converter;
var csvConverter = new Converter({});
var promiseCsvConverter = Q.nbind(csvConverter.fromString, csvConverter);

// SQL engine
var alasql = require('alasql');
var db = new alasql.Database();

// internal helper
var helper = require('./helper.js'); 


/* 
  CONFIG
*/ 

var FILE = 'addressbook.csv';
var HEADER = 'name, gender, birthday'; // CSV header
var QUESTIONS = [
  {
    id: 1,
    desc: 'How many women are in the address book?',
    sql: 'SELECT COUNT(*) as result FROM ? WHERE gender == "Female"'
  },
  {
    id: 2,    
    desc: 'Who is the oldest person in the address book?',
    sql: 'SELECT name as result from ? where birthday = (SELECT MIN(birthday) from ?)'
  },
  {
    id: 3,    
    desc: 'How many days older is Bill than Paul??',
    sql: 'SELECT ABS((MAX(birthday)-MIN(birthday))/1000/60/60/24) as result from ? where name LIKE "Bill%" OR name LIKE "Paul%"'
  }    
];

// Look ma, no global variables!


/*
 * START 
 */

// Read static data 
promiseReadFile(FILE)
  // Add Header to make it real CSV file
  .then(function(data){
    return HEADER + '\n' + data.toString();
  })
  // Convert CSV into JS object
  .then(promiseCsvConverter)
  // Convert birthday string into number (so SQL will work with subselects)
  .then(function(jsonObj){
    for (var rec in jsonObj){
      jsonObj[rec].birthday = helper.dmyStringToDate(jsonObj[rec].birthday).getTime();
    };
    return jsonObj;
  })
  // Answer questions
  .then(function(jsonObj){
    var answers = {};
    
    QUESTIONS.forEach(function(question, index){
      console.log('Question: ' + question.desc);
      //HINT: Queries might only use result table twice in SQL
      //      due to static implementation
      //TODO: Add table name as flexible parameter if required
      var result = alasql(question.sql, [jsonObj, jsonObj]);
      if (result.length){
        if (result[0].result){
          answers[question.id] = result[0].result;          
        } else {
          answers[question.id] = 'FAIL: SQL has no required "result" column'
        }
      } else {
        answers[question.id] = 'FAIL: SQL has no result'
      }
      console.log('Answer: ' + answers[question.id]);
    })

    return answers;
  })
  // Start Server  
  .then(function(answers){

    /**
     * The output format of any question should be like this:
     * <question number>. <answer><new line>
     * @param id - key to the ANSWERS object
     * @returns {String} - formatted answer 
     */  
    function getFormattedAnswer(id){
      return id + '. ' + answers[id]+ '\n'; 
    } 

    // All answers
    app.get('/questions', function (req, res) {
      res.type('text/plain'); // set content-type
      var allAnswers = '';
      for (var answerId in answers){
        allAnswers += getFormattedAnswer(answerId);
      }   
      res.send(allAnswers); // send text response
    }); 
    
    // Single answers
    app.get('/questions/:id', function (req, res) {
      res.type('text/plain'); // set content-type 
      res.send(getFormattedAnswer(req.params.id)); // send text response
    });  
    
    // Start Server
    var server = app.listen(3000, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log('Example app listening at http://%s:%s', host, port);
    });
  
  })
  .fail(function(err){
    console.log('error', err);
  });
 
 // Make app available to test framework
if (module.parent){
  module.exports = app;
}