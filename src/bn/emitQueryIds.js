/* jshint node: true */

/*
	1.11.2016
	@jroseman
*/

//  Master method suite for queries against the Barnes and Noble course API

var request = require('request');
var qc = require(__dirname+'/../../ops/data/URLs').queryConstructor;

exports.emitTermIds = function (verbose, eventEmitter, storeId, storeName, campusId, campusName) {

	// Construct the query URL for this campus.
	var url = qc(storeId, campusId);

	request(url, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			var terms;
			try {
				terms = JSON.parse(body);
			} catch (e) {
				terms = '{}';
				if (verbose) {
					console.log('FAIL to parse termId for '+storeName+', '+campusName);
				}
			}

			for (var i in terms) {
				var termId = terms[i].categoryId;
				var termName = terms[i].title;
				
				if (verbose) {
					console.log('SEND term '+termName+' from '+storeName+', '+campusName);
				}
				eventEmitter.emit('termId-kv-pair', storeId, campusId, termId, termName, terms.length);
			}
		} else {
			if (verbose) {
				console.log('FAIL to parse termId for '+storeName+', '+campusName);
			}
		}
	});
};

exports.emitDeptIds = function (verbose, eventEmitter, storeId, storeName, campusId, campusName, termId, termName) {

	// Construct the query URL for this term.
	var url = qc(storeId, campusId, termId);

	request(url, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			var depts;
			try {
				depts = JSON.parse(body);
			} catch (e) {
				depts = '{}';
				if (verbose) {
					console.log('FAIL to parse deptId for '+storeName+', '+campusName);
				}
			}

			for (var i in depts) {
				var deptId = depts[i].categoryId;
				var deptName = depts[i].title;
				
				if (verbose) {
					console.log('SEND dept '+deptName+' for '+storeName+', '+campusName);
				}
				eventEmitter.emit('deptId-kv-pair', storeId, campusId, termId, deptId, deptName, depts.length);
			}
		} else {
			if (verbose) {
				console.log('FAIL to parse deptId for '+storeName+', '+campusName);
			}
		}
	});
};

exports.emitCourseIds = function (verbose, eventEmitter, storeId, storeName, campusId, campusName, termId, termName, deptId, deptName) {

	// Construct the query URL for this term.
	var url = qc(storeId, campusId, termId, deptId);

	request(url, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			var courses;
			try {
				courses = JSON.parse(body);
			} catch (e) {
				courses = '{}';
				if (verbose) {
					console.log('FAIL to parse courseId for '+storeName+', '+campusName);
				}
			}

			for (var i in courses) {
				var courseId = courses[i].categoryId;
				var courseName = courses[i].title;
				
				if (verbose) {
					console.log('SEND course '+courseName+' for '+storeName+', '+campusName);
				}
				eventEmitter.emit('courseId-kv-pair', storeId, campusId, termId, deptId, courseId, courseName, courses.length);
			}
		} else {
			if (verbose) {
				console.log('FAIL to parse courseId for '+storeName+', '+campusName);
			}
		}
	});
};

exports.emitSectionIds = function (verbose, eventEmitter, storeId, storeName, campusId, campusName, termId, termName, deptId, deptName, courseId, courseName) {

	// Construct the query URL for this term.
	var url = qc(storeId, campusId, termId, deptId, courseId);

	request(url, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			var sections;
			try {
				sections = JSON.parse(body);
			} catch (e) {
				sections = '{}';
				if (verbose) {
					console.log('FAIL to parse sectionId for '+storeName+', '+campusName);
				}
			}

			for (var i in sections) {
				var sectionId = sections[i].categoryId;
				var sectionName = sections[i].title;
				
				if (verbose) {
					console.log('SEND section '+sectionId+' for '+storeName+', '+campusName);
				}
				eventEmitter.emit('sectionId-kv-pair', storeId, campusId, termId, deptId, courseId, sectionId, sectionName, sections.length);
			}
		} else {
			if (verbose) {
				console.log('FAIL to parse sectionId for '+storeName+', '+campusName);
			}
		}
	});
};