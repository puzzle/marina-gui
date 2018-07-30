import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { formatCurrency } from '../common/number.helper';
import { employeeService } from '../employee';

class Dashboard extends Component {
  render() {
    const { translate, user, userEmployee } = this.props;
    return (
      <div>
        <h1>{translate('dashboard.title')}</h1>
        <h3>{translate('dashboard.welcome', user)}</h3>
        <ul>
          <li>{translate('employee.username')}: {user && user.username}</li>
          <li>{translate('employee.email')}: {user && user.email}</li>
          <li>
            {translate('employee.bruttoSalary')}:
            CHF {userEmployee && (formatCurrency(userEmployee.bruttoSalary) || '-')}
          </li>
          <li>
            {translate('employee.agreement.text')}:&nbsp;
            {translate(`employee.agreement.${userEmployee && !!userEmployee.agreement}`)}
            {userEmployee && !!userEmployee.agreement &&
            <a href={employeeService.getAgreementUrl()}>
              &nbsp;{translate('app.download')}
            </a>
            }
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { userEmployee } = state.userEmployee;
  return {
    user,
    userEmployee,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Dashboard);
