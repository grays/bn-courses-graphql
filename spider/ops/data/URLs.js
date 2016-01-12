/*
	1.11.2016
	@jroseman
*/

//  Contains all global URLs and constructors for URLs

var codes = require('./codes').codes;

const p = {
	catalogId: 10001,
	langId: -1
};

const stores = "http://www.bncollege.com/page-campus-stores";
const courses = "http://a.bncollege.com/webapp/wcs/stores/servlet/TextBookProcessDropdownsCmd?";
const site = "http://a.bncollege.com/webapp/wcs/stores/servlet/TBWizardView?";

exports.siteConstructor = function (storeId) {
	return site+'catalogId='+p.catalogId+'&langId='+p.langId+'&storeId='+storeId;
};

// storeId and campusId are mandatory, others are optional. 
// B&N API will return different results depending on how many parameters are 
// fulfilled.
exports.queryConstructor = function (storeId, campusId, termId, deptId, courseId) {
	var storeChunk = '&storeId='+storeId;
	var campusChunk = '&campusId='+campusId;
	var termChunk = '&termId='+termId;
	var deptChunk = '&deptId='+deptId;
	var courseChunk = '&courseId='+courseId;
	var dropdown = 'course';

	if (typeof courseId === 'undefined') {
		courseChunk = '';
		dropdown = 'dept';
	}
	if (typeof deptId === 'undefined') {
		deptChunk = '';
		dropdown = 'term';
	}
	if (typeof termId === 'undefined') {
		termChunk = '';
		dropdown = 'campus';
	}

	if (campusId == codes['no-campus']) { campusChunk = ''; }
	
	return courses+'catalogId='+p.catalogId+'&langId='+p.langId+'&dropdown='+dropdown+storeChunk+campusChunk+termChunk+deptChunk+courseChunk;
};

