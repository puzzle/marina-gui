import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { employeeActions } from './employee.actions';

class Employee extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch, match } = this.props;
    console.log(match.params.id);
    dispatch(employeeActions.getEmployees());
  }

  render() {
    const { translate, employees } = this.props;
    return (
      <div>
        <h1>{translate('navigation.employees')}</h1>
        {employees.length}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { employees } = state;
  return {
    user,
    employees,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Employee);
