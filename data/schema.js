/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Course,
  Professor,
  Department,
  Term,
  Campus,
  Store,

  getViewer,
  getUser,
  getCourse,
  getDepartment,
  getProfessor,
  getTerm,
  getCampus,
  getStore,

  getUsers,
  getCourses,
  getDepartments,
  getProfessors,
  getTerms,
  getCampuses,
  getStores,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Course') {
      return getCourse(id);
    } else if (type === 'Department') {
      return getDepartment(id);
    } else if (type === 'Professor') {
      return getProfessor(id);
    } else if (type === 'Term') {
      return getTerm(id);
    } else if (type === 'Campus') {
      return getCampus(id);
    } else if (type === 'Store') {
      return getStore(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Course) {
      return courseType;
    } else if (obj instanceof Department) {
      return departmentType;
    } else if (obj instanceof Professor) {
      return professorType;
    } else if (obj instanceof Term) {
      return termType;
    } else if (obj instanceof Campus) {
      return campusType;
    } else if (obj instanceof Store) {
      return storeType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var courseType = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: globalIdField('Course'),
    name: {
      type: GraphQLString,
      description: 'The name of the course',
    },
    callnumber: {
      type: GraphQLString,
      description: 'The callnumber of the course',
    },
    department: {
      type: departmentType,
      description: 'The department to which this course belongs',
    },
    professor: {
      type: professorType,
      description: 'The professor who teaches this course',
    },
    term: {
      type: termType,
      description: 'The term during which the course takes place',
    },
    campus: {
      type: campusType,
      description: 'The campus on which the course takes place',
    },
    store: {
      type: storeType,
      description: 'The college at which the course takes place',
    }
  }),
  interfaces: [nodeInterface],
});

var professorType = new GraphQLObjectType({
  name: 'Professor',
  fields: () => ({
    id: globalIdField('Professor'),
    name: {
      type: GraphQLString,
      description: 'The name of the professor',
    },
    courses: {
      type: new GraphQLList(courseType),
      description: 'The courses taught by this professor',
    }
  }),
  interfaces: [nodeInterface],
})

var departmentType = new GraphQLObjectType({
  name: 'Department',
  fields: () => ({
    id: globalIdField('Department'),
    name: {
      type: GraphQLString,
      description: 'The name of the department',
    },
    courses: {
      type: new GraphQLList(courseType),
      description: 'The courses within the department',
    },
    professors: {
      type: new GraphQLList(professorType),
      description: 'The professors within the department',
    },
  }),
  interfaces: [nodeInterface],
});

var termType = new GraphQLObjectType({
  name: 'Term',
  description: 'A term at school, like a semester or quarter',
  fields: () => ({
    id: globalIdField('Term'),
    name: {
      type: GraphQLString,
      description: 'The name of the term',
    },
    courses: {
      type: new GraphQLList(courseType),
      description: 'The courses taking place this term',
    },
    departments: {
      type: new GraphQLList(departmentType),
      description: 'The active departments this term',
    },
    professors: {
      type: new GraphQLList(professorType),
      description: 'The active professors this term',
    }
  }),
  interfaces: [nodeInterface],
});

var campusType = new GraphQLObjectType({
  name: 'Campus',
  description: 'A particular campus, like the medical school',
  fields: () => ({
    id: globalIdField('Campus'),
    name: {
      type: GraphQLString,
      description: 'The name of the campus',
    },
    terms: {
      type: new GraphQLList(termType),
      description: 'The terms recorded on this campus'
    }
  }),
  interfaces: [nodeInterface],
});

var storeType = new GraphQLObjectType({
  name: 'Store',
  description: 'A particular store, like Harvard',
  fields: () => ({
    id: globalIdField('Store'),
    name: {
      type: GraphQLString,
      description: 'The name of the store',
    },
    campuses: {
      type: new GraphQLList(campusType),
      description: 'The campuses of this store'
    }
  }),
  interfaces: [nodeInterface],
});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    courses: {
      type: courseConnection,
      description: 'A person\'s collection of courses',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getCourses(), args),
    },
    departments: {
      type: departmentConnection,
      description: 'All departments',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getDepartments(), args),
    },
    professors: {
      type: professorConnection,
      description: 'All professors',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getProfessors(), args),
    },
    terms: {
      type: termConnection,
      description: 'All terms',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getTerms(), args),
    },
    campuses: {
      type: campusConnection,
      description: 'All campuses',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getCampuses(), args),
    },
    stores: {
      type: storeConnection,
      description: 'All stores',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getStores(), args),
    }
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: courseConnection} =
  connectionDefinitions({name: 'Course', nodeType: courseType});
var {connectionType: departmentConnection} =
  connectionDefinitions({name: 'Department', nodeType: departmentType});
var {connectionType: professorConnection} =
  connectionDefinitions({name: 'Professor', nodeType: professorType});
var {connectionType: termConnection} =
  connectionDefinitions({name: 'Term', nodeType: termType});
var {connectionType: campusConnection} =
  connectionDefinitions({name: 'Campus', nodeType: campusType});
var {connectionType: storeConnection} =
  connectionDefinitions({name: 'Store', nodeType: storeType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
