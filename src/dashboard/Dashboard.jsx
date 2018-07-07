import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

const Dashboard = ({ translate, user, employee }) => (
  <div>
    <h1>{translate('dashboard.title')}</h1>
    <h3>{translate('dashboard.welcome', user)}</h3>
    <ul>
      <li>{translate('dashboard.username')}: {user && user.username}</li>
      <li>{translate('dashboard.email')}: {user && user.email}</li>
      <li>{translate('dashboard.agreement.text')}: {translate(`dashboard.agreement.${employee && !!employee.agreement}`)}</li>
    </ul>
  </div>
);

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
