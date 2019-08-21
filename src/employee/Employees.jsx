import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from 'react-localize-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';
import { faSignOutAlt } from '@fortawesome/fontawesome-free-solid';
import { Button, ButtonToolbar, Col, ControlLabel, FormControl, FormGroup, Row } from 'react-bootstrap';
import * as _ from 'lodash';
import { employeeActions } from './employee.actions';
import { formatCurrency, uniqueOnly } from '../common/number.helper';
import { employeeService } from './index';
import { getExplorerAddrUrl } from '../common/bitcoin.helper';
import { getValueFromInputChangeEvent } from '../common/service.helper';

import './Employees.css';

class Employees extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'ACTIVE',
    };

    const { dispatch } = this.props;
    dispatch(employeeActions.getEmployees());

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  handleInputChange(event) {
    const { name } = event.target;
    const value = getValueFromInputChangeEvent(event);
    this.setState({ [name]: value });
  }

  handleStatusChange(id, newStatus) {
    const { dispatch } = this.props;
    dispatch(employeeActions.updateStatus(id, newStatus));
  }

  render() {
    const { translate, employees, currentLanguage } = this.props;
    const { status } = this.state;

    const data = (employees || [])
      .filter(e => e.status === status);
    const columns = getColumnDefinitions(this, translate);
    const defaultSorted = [{ id: 'lastName', desc: false }];
    const years = _.flatMap(employees, 'monthlyPayouts')
      .map(payout => payout.year)
      .filter(uniqueOnly);

    return (
      <div>
        <h1>{translate('navigation.employees')}</h1>
        <Row>
          <Col md={3}>
            <FormGroup controlId="status">
              <ControlLabel>{translate('employee.status.filter')}</ControlLabel>
              <FormControl
                componentClass="select"
                name="status"
                value={this.state.status}
                placeholder={translate('employee.status.label')}
                onChange={this.handleInputChange}
              >
                <option value="ACTIVE">{translate('employee.status.ACTIVE')}</option>
                <option value="DISABLED">{translate('employee.status.DISABLED')}</option>
                <option value="LEFT_COMPANY">{translate('employee.status.LEFT_COMPANY')}</option>
              </FormControl>
            </FormGroup>
          </Col>
        </Row>
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

function getColumnDefinitions(comp, translate) {
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
  }, {
    id: 'actions',
    Header: translate('employee.actions'),
    accessor: e => e.status,
    Cell: (row) => {
      if (row.value === 'ACTIVE') {
        return (
          <div className="small-buttons">
            <Button onClick={() => comp.handleStatusChange(row.original.id, 'DISABLED')}>
              <FontAwesomeIcon icon={faBan} className="inline-icon" />
              {translate('employee.disable')}
            </Button>
            <Button onClick={() => comp.handleStatusChange(row.original.id, 'LEFT_COMPANY')}>
              <FontAwesomeIcon icon={faSignOutAlt} className="inline-icon" />
              {translate('employee.leftCompany')}
            </Button>
          </div>
        );
      }
      return (
        <div className="small-buttons">
          <Button onClick={() => comp.handleStatusChange(row.original.id, 'ACTIVE')}>
            <FontAwesomeIcon icon={faCheckCircle} className="inline-icon" />
            {translate('employee.enable')}
          </Button>
        </div>
      );
    },
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
