var ee = require('./src/bn/allListeners').ee;
var start = require('./src/bn/allListeners').startFullSpider;

ee.on('full-course-data', function (courseData) {
	console.log(courseData);
});

start();