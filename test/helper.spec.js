
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
    
  it('dmyStringToDate converts string into date', function(){
    should.equal(
      new Date('1980-10-20').toString(),
      //helper.dmyStringToDate('20/10/80').toString(),
      helper.dmyStringToDate('20/10/80').toString()
    );
  });
});