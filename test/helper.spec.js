
/*global beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */
'use strict';

var request = require('supertest'),
    should = require('should');
	
	
var helper = require('./../helper.js');

// TESTS

describe('helper.js', function(){
  it('has function dmyStringToDate', function(){
    helper.dmyStringToDate.should.be.a.Function;
  });
  
  describe('function dmyStringToDate', function(){    
    it('converts string into date with 2 digit year', function(){
      should.equal(
        new Date('1980-10-20').toString(),
        helper.dmyStringToDate('20/10/80').toString()
      );
    });
    
    it('converts string into date with 4 digit year', function(){
      should.equal(
        new Date('1980-10-20').toString(),
        helper.dmyStringToDate('20/10/1980').toString()
      );
    });  
  });      
});