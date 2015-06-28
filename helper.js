'use strict';

var helper = {};

// convert date string to javascript date
// via http://stackoverflow.com/questions/19709793/convert-date-from-dd-mm-yyyy-to-yyyy-mm-dd-in-javascript
helper.dmyStringToDate = function(date){
  var newdate = date.split('/').reverse().join('-');
  if (newdate.length === 8){ //default to 19 century
    newdate = '19' + newdate;
  }
  return new Date(newdate);
}

module.exports = helper;