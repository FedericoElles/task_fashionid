
/*global beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */
'use strict';

var request = require('supertest'),
    should = require('should');

// express app with static endpoints
var app = require('./../index.js');
    
// expected responses by endpoints
var ANSWERS = {
  1: '2',
  2: 'Wes Jackson',
  3: '2862'
};
  
/** 
 * Returns a formatted answer
 * @param id - key to the ANSWERS object
 * @returns {String} - formatted answer 
 */  
function getFormattedAnswer(id){
  return id + '. ' + ANSWERS[id]+ '\n'; 
} 

// TESTS
describe('index.js', function(){
  describe('GET /questions', function(){  
    it('respond with all available answers', function(done){
      request(app)
        .get('/questions')
        .set('Accept', 'text/plain')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          var allAnswers = '';
          for (var answerId in ANSWERS){
            allAnswers += getFormattedAnswer(answerId);
          } 
  		    res.text.should.be.equal(allAnswers);
          done();
        });
    });
  });
  
  /**
   * Test a single question endpoint
   * @param id - Id of the question to validate
   */
  function testSingleQuestionAnswer(id){
    describe('GET /questions/' + answerId, function(){  
      it('respond with correct text answer', function(done){
        request(app)
          .get('/questions/' + answerId)
          .set('Accept', 'text/plain')
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
    		    res.text.should.be.equal(getFormattedAnswer(answerId));
            done();
          });
      });
    });
  }
  
  // Test all single question endpoints 
  for (var answerId in ANSWERS){
    testSingleQuestionAnswer(answerId);
  }
  
});