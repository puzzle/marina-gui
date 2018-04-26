import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux/lib/index';

const UserSettings = ({ user }) => (
  <h1>coming soon... {user && user.username}</h1>
);

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(UserSettings);
