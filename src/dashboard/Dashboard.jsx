import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

class Dashboard extends Component {
  render() {
    const { translate, user, employee } = this.props;
    return (
      <div>
        <h1>{translate('dashboard.title')}</h1>
        <h3>{translate('dashboard.welcome', user)}</h3>
        <ul>
          <li>{translate('employee.username')}: {user && user.username}</li>
          <li>{translate('employee.email')}: {user && user.email}</li>
          <li>{translate('employee.agreement.text')}: {translate(`employee.agreement.${employee && !!employee.agreement}`)}</li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { employee } = state;
  return {
    user,
    employee,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Dashboard);
