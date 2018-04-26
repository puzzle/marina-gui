import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

const Navigation = ({ translate }) => (
  <nav>
    <div className="navbar navbar-inverse" id="menu">
      <div className="container-fluid">
        <ul className="nav navbar-nav">
          <li className="active"><Link to="/">{translate('navigation.dashboard')}</Link></li>
          <li><Link to="/user-settings">{translate('navigation.userSettings')}</Link></li>
        </ul>
      </div>
    </div>
  </nav>
);

function mapStateToProps(state) {
  return {
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Navigation);
