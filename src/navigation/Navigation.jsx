import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import NavItem from './NavItem';

const Navigation = ({ translate, user, employee }) => (
  <nav>
    <div className="navbar navbar-inverse" id="menu">
      <div className="container-fluid">
        <ul className="nav navbar-nav">
          <NavItem to="/">
            {translate('navigation.dashboard')}
          </NavItem>
          {employee && !!employee.agreement &&
          <NavItem to="/user-settings">
            {translate('navigation.userSettings')}
          </NavItem>
          }
          {user && user.authorities && user.authorities.includes('ROLE_ADMIN') &&
          <NavItem to="/employees">
            {translate('navigation.employees')}
          </NavItem>
          }
        </ul>
      </div>
    </div>
  </nav>
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

export default connect(mapStateToProps)(Navigation);
