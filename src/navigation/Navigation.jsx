import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import NavItem from './NavItem';

const Navigation = ({ translate, user, userEmployee }) => (
  <nav>
    <div className="navbar navbar-inverse" id="menu">
      <div className="container-fluid">
        <ul className="nav navbar-nav">
          <NavItem to="/">
            {translate('navigation.dashboard')}
          </NavItem>
          {userEmployee && !!userEmployee.agreement && userEmployee.bruttoSalary > 0 &&
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
  const { userEmployee } = state.userEmployee;
  return {
    user,
    userEmployee,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Navigation);
