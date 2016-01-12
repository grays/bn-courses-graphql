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
  Course,
  Department,
  Professor,
  getCourse,
  getCourses,
  getDepartment,
  getDepartments,
  getProfessor,
  getProfessors,
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
    if (type === 'Course') {
      return getCourse(id);
    } else if (type === 'Department') {
      return getDepartment(id);
    } else if (type === 'Professor') {
      return getProfessor(id);
    }

    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Course) {
      return courseType;
    } else if (obj instanceof Department)  {
      return departmentType;
    } else if (obj instanceof Professor) {
      return professorType;
    }
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
  description: 'A class',
  fields: () =>  ({
    id: globalIdField('Course'),
    name: {
      GraphQLString,
      description: 'The name of the class'
    },
    professor: {
      professorType,
      description: 'The professor of the class'
    }
  })
});

var departmentType = new GraphQLObjectType({
  name: 'Department',
  description: 'A department',
  fields: () => ({
    id: globalIdField('Department'),
    name: {
      GraphQLString,
      description: 'The name of the department'
    },
    courses: {
      type: courseConnection,
      description: 'A departments courses',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getCourses(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var professorType = new GraphQLObjectType({
  name: 'Professor',
  description: 'A professor',
  fields: () => ({
    id: globalIdField('Professor'),
    name: {
      GraphQLString,
      description: 'The name of the professor'
    },
    courses: {
      type: courseConnection,
      description: 'A professors courses',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getCourses(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var {connectionType: courseConnection} =
  connectionDefinitions({name: 'Course', nodeType: courseType});


var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    course: {
      type: courseType,
      resolve: () => getCourse(),
    },
    department: {
      type: departmentType,
      resolve: () => getDepartment(),
    },
    professor: {
      type: professorType,
      resolve: () => getProfessor(),
    }
  }),
});

export var Schema = new GraphQLSchema({
  query: queryType,
});
