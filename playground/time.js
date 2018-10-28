
var moment = require('moment');
//var date = new Date();

//console.log(date.getMonth());

var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);
var createdAt = 1234;

var date = moment(createdAt);

console.log(date.format('h:mm a'));

var current = moment().valueOf();
console.log(moment().valueOf());

