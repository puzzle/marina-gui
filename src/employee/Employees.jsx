import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';
import { Button, ButtonToolbar } from 'react-bootstrap';
import * as _ from 'lodash';
import { employeeActions } from './employee.actions';
import { formatCurrency } from '../common/number.helper';

class Employees extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    dispatch(employeeActions.getEmployees());
  }

  render() {
    const { translate, employees } = this.props;

    const data = employees || [];
    const columns = getColumnDefinitions(translate);

    return (
      <div>
        <h1>{translate('navigation.employees')}</h1>
        <ReactTable data={data} columns={columns} minRows={0} />
        <ButtonToolbar style={{ marginTop: '20px' }}>
          <Link to="/employee/new">
            <Button>
              {translate('employee.addManually')}
            </Button>
          </Link>
        </ButtonToolbar>
      </div>
    );
  }
}

function getColumnDefinitions(translate) {
  return [{
    Header: translate('employee.firstName'),
    accessor: 'firstName',
    Cell: row => <Link to={`/employee/${row.original.id}`}>{row.value}</Link>,
  }, {
    Header: translate('employee.lastName'),
    accessor: 'lastName',
  }, {
    Header: translate('employee.username'),
    accessor: 'username',
  }, {
    Header: translate('employee.email'),
    accessor: 'email',
  }, {
    id: 'agreement',
    Header: translate('employee.agreement.text'),
    Cell: row => <FontAwesomeIcon icon={row.value !== null ? faCheckCircle : faBan} />,
    Footer: (row) => {
      const total = _.sumBy(row.data, d => (d.agreement !== null ? 1 : 0));
      return (<span><strong>{translate('employee.agreement.total')}</strong> {total}</span>);
    },
  }, {
    id: 'amountChf',
    Header: translate('employee.currentConfiguration.amountChf'),
    accessor: e => (e.currentConfiguration ? e.currentConfiguration.amountChf : null),
    Cell: row => (row.value !== null ? ` CHF ${formatCurrency(row.value)}` : '-'),
    Footer: (row) => {
      const total = _.sumBy(row.data, 'amountChf') || 0;
      return (<span><strong>{translate('employee.agreement.total')}</strong> CHF {formatCurrency(total)}</span>);
    },
  }, {
    id: 'address',
    Header: translate('employee.currentConfiguration.address'),
    accessor: e => (e.currentConfiguration ? e.currentConfiguration.currentAddress : '-'),
  }];
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { employees } = state.employees;
  return {
    user,
    employees,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Employees);
