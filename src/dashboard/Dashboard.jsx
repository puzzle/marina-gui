import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { formatCurrency } from '../common/number.helper';
import { employeeService } from '../employee';
import MonthlyPayouts from '../employee/MonthlyPayouts';

class Dashboard extends React.Component {
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
        {userEmployee && userEmployee.monthlyPayouts && userEmployee.monthlyPayouts.length > 0 &&
        <div>
          <h3>{translate('employee.payouts')}</h3>
          <MonthlyPayouts monthlyPayouts={userEmployee.monthlyPayouts} />
        </div>
        }
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
