class Course extends Object {}
class Department extends Object {}
class Professor extends Object {}

var introToCS = new Course();
introToCS.id = '1';
introToCS.name = 'Introduction to Computer Science';
introToCs.professor = 'Ben Hescott';
introToCs.department = 'Computer Science';

var compTheory = new Course();
compTheory.id = '2';
compTheory.name = 'Computational Theory';
compTheory.professor = 'Noah Daniels';
introToCs.department = 'Computer Science';

var courses = [introToCs, compTheory];


var csDept = new Department();
csDept.id = '1';
csDept.courses = [introToCs, compTheory];
csDept.name = 'Computer Science';


var ben = new Professor();
ben.id = '1';
ben.courses = [introToCs];
ben.name = 'Ben Hescott';

var noah = new Professor();
noah.id = '2';
noah.courses = [compTheory];
noah.name = 'Noah Daniels';

var professors = [ben, noah];

module.exports = {
  getCourse: (id) => courses.find(c => c.id === id),
  getDepartment: (id) => id === csDept.id ? csDept : null,
  getProfessor: (id) => professors.find(p => p.id === id),
  getCourses: () => courses,
  getDepartments: () => [csDept],
  getProfessors: () => professors,
  Course,
  Department,
  Professor
};
