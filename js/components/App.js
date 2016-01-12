import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Full course data list</h1>
          <ul>
              {this.props.viewer.stores.edges.map(store =>
                  <li key={store.node.id}>
                      <p>{store.node.name}</p>
                      <CampusList campuses={store.node.campuses} />
                  </li>
              )}
          </ul>
      </div>
    );
  }
}

class CampusList extends React.Component {
  render() {
    return (
      <div>
        <ul>
        {this.props.campuses.map(campus =>
          <li key={campus.id}>
              <p>{campus.name}</p>
              <TermList terms={campus.terms} />
          </li>
        )}
        </ul>
      </div>
    );
  }
}

class TermList extends React.Component {
  render() {
    return (
      <div>
        <ul>
        {this.props.terms.map(term =>
          <li key={term.id}>
              <p>{term.name}</p>
              <DepartmentList departments={term.departments} />
          </li>
        )}
        </ul>
      </div>
    );
  }
}

class DepartmentList extends React.Component {
  render() {
    return (
      <div>
        <ul>
        {this.props.departments.map(dep =>
          <li key={dep.id}>
              <p>{dep.name}</p>
              <ProfessorList professors={dep.professors} />
          </li>
        )}
        </ul>
      </div>
    );
  }
}

class ProfessorList extends React.Component {
  render() {
    return (
        <div>
          <ul>
          {this.props.professors.map(prof =>
              <li key={prof.id}>
                  <p>{prof.name}</p>
                  <CourseList courses={prof.courses} />
              </li>
          )}
          </ul>
        </div>
    );
  }
}

class CourseList extends React.Component {
  render() {
    return (
        <div>
            <ul>
              {this.props.courses.map(course =>
                <li key={course.id}>{course.name} (Callnumber: {course.callnumber})</li>
              )}
            </ul>
        </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        stores(first:10) {
          edges {
            node {
              id,
              name,
              campuses {
                id,
                name,
                terms {
                  id,
                  name,
                  departments {
                    id,
                    name,
                    professors {
                      id,
                      name,
                      courses {
                        id,
                        name,
                        callnumber
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
});
