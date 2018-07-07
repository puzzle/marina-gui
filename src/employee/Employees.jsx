import React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { employeeActions } from './employee.actions';

class Employees extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    dispatch(employeeActions.getEmployees());
  }

  render() {
    const { translate, employees } = this.props;

    const data = employees.employees || [];

    const columns = [{
      Header: translate('employee.firstName'),
      accessor: 'firstName',
    }, {
      Header: translate('employee.lastName'),
      accessor: 'lastName',
    }, {
      Header: translate('employee.username'),
      accessor: 'username',
    }, {
      id: 'agreement',
      Header: translate('employee.agreement.text'),
      accessor: e => (e.agreement ? faCheckCircle : faBan),
      Cell: props => <FontAwesomeIcon icon={props.value} />,
    }];

    return (
      <div>
        <h1>{translate('navigation.employees')}</h1>
        <ReactTable data={data} columns={columns} minRows={0} />
        <ButtonToolbar style={{ marginTop: '20px' }}>
          <Button href="/employee/new">
            {translate('employee.addManually')}
          </Button>
        </ButtonToolbar>
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

export default connect(mapStateToProps)(Employees);
