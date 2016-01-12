/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class Store extends Object {}
class Campus extends Object {}
class Term extends Object {}
class Course extends Object {}
class Department extends Object{}
class Professor extends Object{}
class User extends Object {}

// Declare objects
var tufts = new Store();
var tuftsUG = new Campus();
var spring2016 = new Term();
var introToCs = new Course();
var compTheory = new Course();
var ben = new Professor();
var noah = new Professor();
var csDep = new Department();

// Courses
introToCs.id = '1';
introToCs.name = 'Introduction to Computer Science';
introToCs.callnumber = 'CS-0011-01';
introToCs.department = csDep;
introToCs.professor = ben;
introToCs.term = spring2016;
introToCs.campus = tuftsUG;
introToCs.store = tufts;

compTheory.id = '2';
compTheory.name = "Computational Theory";
compTheory.callnumber = 'CS-0170-01';
compTheory.department = csDep;
compTheory.professor = noah;
compTheory.term = spring2016;
compTheory.campus = tuftsUG;
compTheory.store = tufts;

var courses = [introToCs, compTheory];

// Professors
ben.id = '1';
ben.name = 'Ben Hescott';
ben.courses = [introToCs];

noah.id = '2';
noah.name = 'Noah Daniels';
noah.courses = [compTheory];

var professors = [ben, noah];

// Departments
csDep.id = '1';
csDep.name = 'Computer Science';
csDep.courses = courses;
csDep.professors = professors;

var depts = [csDep];

// Terms
spring2016.id = '1';
spring2016.name = 'Spring 2016';
spring2016.courses = courses;
spring2016.departments = depts;
spring2016.professors = professors;

var terms = [spring2016];

// Campuses
tuftsUG.id = '1';
tuftsUG.name = 'Tufts University Undergraduate';
tuftsUG.terms = terms;

var campuses = [tuftsUG];

// Stores (colleges)
tufts.id = '1';
tufts.name = 'Tufts University';
tufts.campuses = campuses;

var stores = [tufts];

// Viewer
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getCourse: (id) => courses.find(c => c.id === id),
  getCourses: () => courses,
  getProfessor: (id) => professors.find(p => p.id === id),
  getProfessors: () => professors,
  getDepartment: (id) => depts.find(d => d.id === id),
  getDepartments: () => depts,
  getTerm: (id) => terms.find(t => t.id === id),
  getTerms: () => terms,
  getCampus: (id) => campuses.find(c => c.id === id),
  getCampuses: () => campuses,
  getStore: (id) => stores.find(s => s.id === id),
  getStores: () => stores,

  User,
  Course,
  Professor,
  Department,
  Term,
  Campus,
  Store,
};
