'use strict';

var helper = {};

/** 
 * Convert date dd/mm/yy string to javascript date
 * via http://stackoverflow.com/questions/19709793/convert-date-from-dd-mm-yyyy-to-yyyy-mm-dd-in-javascript
 * 
 * @param {String} String of format dd/mm/yy, e.g. 18/11/82
 * @returns {Date} Valid JS date
 */
helper.dmyStringToDate = function(date){
  var newdate = date.split('/').reverse().join('-');
  if (newdate.length === 8){ //default to 19 century
    newdate = '19' + newdate;
  }
  return new Date(newdate);
}

module.exports = helper;