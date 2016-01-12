const EventEmitter = require('events');
const util = require('util');

var qc = require('../../ops/data/URLs').queryConstructor;
var codes = require('../../ops/data/codes').codes;
var emitStoreIds = require('./emitStoreIds').emitStoreIds;
var emitCampusIds = require('./emitCampusIds').emitCampusIds;
var emitTermIds = require('./emitQueryIds').emitTermIds;
var emitDeptIds = require('./emitQueryIds').emitDeptIds;
var emitCourseIds = require('./emitQueryIds').emitCourseIds;
var emitSectionIds = require('./emitQueryIds').emitSectionIds;

function BnDataEmitter () {
	EventEmitter.call(this);
}
util.inherits(BnDataEmitter, EventEmitter);
const bnDataEmitter = new BnDataEmitter();

var verbose = true;
var masterData = {};

var sectionIdCt = {};
bnDataEmitter.on('sectionId-kv-pair', function (storeId, campusId, termId, deptId, courseId, k, v, count) {
	if (!sectionIdCt[courseId]) { sectionIdCt[courseId] = 0; }
	sectionIdCt[courseId]++;

	var sectionId = k;
	var sectionName = v;
	var storeName = masterData[storeId].name;
	var campusName = masterData[storeId].campuses[campusId].name;
	var termName = masterData[storeId].campuses[campusId].terms[termId].name;
	var deptName = masterData[storeId].campuses[campusId].terms[termId].depts[deptId].name;
	var courseName = masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId].name;

	if (verbose) {
		console.log('GET section '+sectionName+' for '+courseId+' for '+storeName+' ('+sectionIdCt[courseId]+'/'+count+')');
	}

	// Extend the masterData structure
	if (!masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId].sections[sectionId]) {
		masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId].sections[sectionId] = {};
	}
	masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId].sections[sectionId].name = sectionName;

	if (sectionIdCt[courseId] >= count) {
		console.log(storeName+', '+campusName+', '+termName+' : '+deptName+'-'+courseName+'-'+sectionName+' | '+sectionId+'  ('+sectionIdCt[courseId]+'/'+count+')');
		bnDataEmitter('full-course-data', masterData);
	}
});


var courseIdCt = {};
bnDataEmitter.on('courseId-kv-pair', function (storeId, campusId, termId, deptId, k, v, count) {
	if (!courseIdCt[deptId]) { courseIdCt[deptId] = 0; }
	courseIdCt[deptId]++;

	var courseId = k;
	var courseName = v;
	var storeName = masterData[storeId].name;
	var campusName = masterData[storeId].campuses[campusId].name;
	var termName = masterData[storeId].campuses[campusId].terms[termId].name;
	var deptName = masterData[storeId].campuses[campusId].terms[termId].depts[deptId].name;

	if (verbose) {
		console.log('GET course '+courseId+' for '+storeName+' ('+courseIdCt[deptId]+'/'+count+')');
	}

	// Extend the masterData structure
	if (!masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId]) {
		masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId] = {};
		masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId].sections = {};
	}
	masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses[courseId].name = courseName;

	if (courseIdCt[deptId] >= count) {
		emitSectionIds(verbose, bnDataEmitter, storeId, storeName, campusId, campusName, termId, termName, deptId, deptName, courseId, courseName);
	}
});


var deptIdCt = {};
bnDataEmitter.on('deptId-kv-pair', function (storeId, campusId, termId, k, v, count) {
	if (!deptIdCt[termId]) { deptIdCt[termId] = 0; }
	deptIdCt[termId]++;

	var deptId = k;
	var deptName = v;
	var storeName = masterData[storeId].name;
	var campusName = masterData[storeId].campuses[campusId].name;
	var termName = masterData[storeId].campuses[campusId].terms[termId].name;

	if (verbose) {
		console.log('GET dept '+deptName+' for '+storeName+' ('+deptIdCt[termId]+'/'+count+')');
	}

	// Extend the masterData structure
	if (!masterData[storeId].campuses[campusId].terms[termId].depts[deptId]) {
		masterData[storeId].campuses[campusId].terms[termId].depts[deptId] = {};
		masterData[storeId].campuses[campusId].terms[termId].depts[deptId].courses = {};
	}
	masterData[storeId].campuses[campusId].terms[termId].depts[deptId].name = deptName;

	if (deptIdCt[termId] >= count) {
		emitCourseIds(verbose, bnDataEmitter, storeId, storeName, campusId, campusName, termId, termName, deptId, deptName);
	}
}); 


var termIdCt = {};
bnDataEmitter.on('termId-kv-pair', function (storeId, campusId, k, v, count) {
	if (!termIdCt[campusId]) { termIdCt[campusId] = 0; }
	termIdCt[campusId]++;

	var termId = k;
	var termName = v;
	var storeName = masterData[storeId].name;
	var campusName = masterData[storeId].campuses[campusId].name;

	if (verbose) {
		console.log('GET term '+termName+' for '+storeName+' ('+termIdCt[campusId]+'/'+count+')');
	}

	// Extend the masterData structure
	if (!masterData[storeId].campuses[campusId].terms[termId]) {
		masterData[storeId].campuses[campusId].terms[termId] = {};
		masterData[storeId].campuses[campusId].terms[termId].depts = {};
	}
	masterData[storeId].campuses[campusId].terms[termId].name = termName;

	if (termIdCt[campusId] >= 0.9*count) {
		//  We've caught at least 90% of terms
		emitDeptIds(verbose, bnDataEmitter, storeId, storeName, campusId, campusName, termId, termName);
	}
});


var campusIdCt = {};
bnDataEmitter.on('campusId-kv-pair', function (storeId, k, v, count) {
	if (!campusIdCt[storeId]) { campusIdCt[storeId] = 0; }
	campusIdCt[storeId]++;

	var campusId = k;
	var campusName = v;
	var storeName = masterData[storeId].name;

	if (verbose) {
		console.log('GET campusId '+campusId+' for '+storeName+'  ('+campusIdCt[storeId]+'/'+count+')');
	}

	// Extend the masterData structure
	if (!masterData[storeId].campuses[campusId]) {
		masterData[storeId].campuses[campusId] = {};
		masterData[storeId].campuses[campusId].terms = {};
	}
	masterData[storeId].campuses[campusId].name = campusName;

	if (campusIdCt[storeId] >= 0.9*count) {
		//  We've caught at least 90% of campuses.
		emitTermIds(verbose, bnDataEmitter, storeId, storeName, campusId, campusName);
	}
});


var storeIdCt = 0;
bnDataEmitter.on('storeId-kv-pair', function (k, v, count) {
	storeIdCt++;

	// If no store, no need to continue.
	if (codes['no-store'] == k) { return; }

	var storeId = k;
	var storeName = v;
	
	if (verbose) {
		console.log('GET storeId '+storeId+' for '+storeName+'  ('+storeIdCt+'/'+count+')');
	}

	masterData[storeId] = {};
	masterData[storeId].name = storeName;
	masterData[storeId].campuses = {};

	if (storeIdCt >= 0.9*count) {
		//  We've caught at least 90% of schools.
		emitCampusIds(verbose, bnDataEmitter, storeId, storeName);
	}
});
emitStoreIds(verbose, bnDataEmitter);
