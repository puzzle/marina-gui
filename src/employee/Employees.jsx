import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from 'react-localize-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';
import { Button, ButtonToolbar } from 'react-bootstrap';
import * as _ from 'lodash';
import { employeeActions } from './employee.actions';
import { formatCurrency, uniqueOnly } from '../common/number.helper';
import { employeeService } from './index';
import { getExplorerAddrUrl } from '../common/bitcoin.helper';

class Employees extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    dispatch(employeeActions.getEmployees());
  }

  render() {
    const { translate, employees, currentLanguage } = this.props;

    const data = employees || [];
    const columns = getColumnDefinitions(translate);
    const defaultSorted = [{ id: 'lastName', desc: false }];
    const years = _.flatMap(employees, 'monthlyPayouts')
      .map(payout => payout.year)
      .filter(uniqueOnly);

    return (
      <div>
        <h1>{translate('navigation.employees')}</h1>
        <ReactTable
          data={data}
          columns={columns}
          minRows={0}
          defaultSorted={defaultSorted}
          showPagination={false}
          defaultPageSize={999}
        />
        <ButtonToolbar style={{ marginTop: '20px' }}>
          <Link to="/employee/new">
            <Button>
              {translate('employee.addManually')}
            </Button>
          </Link>
        </ButtonToolbar>
        <br /><br />
        {translate('employee.payoutSummaryForAllEmployeesForYears')}
        <span>&nbsp;</span>
        {years.map(year => (<a href={employeeService.getAllPayoutSummariesUrl(currentLanguage, year)}>{year} </a>))}
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
    Header: translate('employee.socialSecurityNumber'),
    accessor: 'socialSecurityNumber',
  }, {
    Header: translate('employee.agreement.text'),
    accessor: 'agreement',
    Cell: row => (
      <div>
        <FontAwesomeIcon icon={row.value !== null ? faCheckCircle : faBan} />
        {row.value !== null &&
        <a href={employeeService.getAgreementUrl(row.original.id)}>
          &nbsp; &nbsp;{translate('app.download')}
        </a>
        }
      </div>
    ),
    Footer: (row) => {
      const total = _.sumBy(row.data, d => (d.agreement !== null ? 1 : 0));
      return (
        <span><strong>{translate('app.total')}</strong> {total}</span>);
    },
  }, {
    id: 'amountChf',
    Header: translate('employee.currentConfiguration.amountChf'),
    accessor: e => (e.currentConfiguration ? e.currentConfiguration.amountChf : null),
    Cell: row => (row.value !== null ? ` CHF ${formatCurrency(row.value)}` : '-'),
    Footer: (row) => {
      const total = _.sumBy(row.data, 'amountChf') || 0;
      return (
        <span><strong>{translate('app.total')}</strong> CHF {formatCurrency(total)}</span>);
    },
  }, {
    id: 'address',
    Header: translate('employee.currentConfiguration.address'),
    accessor: e => (e.currentConfiguration ? e.currentConfiguration.currentAddress : null),
    Cell: row => (row.value === null ? '-' : (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={getExplorerAddrUrl(row.value)}
      >
        {row.value}
      </a>
    )),
  }];
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { employees } = state.employees;
  return {
    user,
    employees,
    translate: getTranslate(state.locale),
    currentLanguage: getActiveLanguage(state.locale).code,
  };
}

export default connect(mapStateToProps)(Employees);
