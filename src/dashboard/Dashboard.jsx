import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

const Dashboard = ({ translate, user }) => (
  <div>
    <h1>{translate('dashboard.title')}</h1>
    <h3>{translate('dashboard.welcome', user)}</h3>
    <ul>
      <li>username: {user && user.username}</li>
      <li>email: {user && user.email}</li>
    </ul>
  </div>
);

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Dashboard);
