import React from 'react';
import { getActiveLanguage, getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe';

import Navigation from '../navigation/Navigation';
import { availableLanguages } from '../i18n';

import './Header.css';
import { authenticationActions } from '../auth/authentication.actions';

const createOnChangeHandler = onChange => ({ currentTarget }) =>
  onChange(availableLanguages[currentTarget.selectedIndex]);

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(authenticationActions.logout());
  }

  render() {
    const { currentLanguage, onChange, translate, user } = this.props;
    return (
      <header>
        <div className="navbar navbar-default" id="headerbar" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-brand">
                <img
                  src="/icons/safari-pinned-tab.svg"
                  alt="Logo"
                  width="41"
                  height="40"
                />
                {translate('app.title')}
              </div>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li className="navbar-user">
                <a href="/employees/settings">
                  <FontAwesomeIcon icon={faUser} className="inline-icon" />
                  {user ? user.username : ''}
                </a>
              </li>
              <li className="navbar-form">
                <div className="form-group">
                  <FontAwesomeIcon icon={faGlobe} className="inline-icon" />
                  <select
                    onChange={createOnChangeHandler(onChange)}
                    value={currentLanguage}
                    className="form-control"
                  >
                    {availableLanguages.map((item, index) =>
                      (
                        <option key={index}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <Navigation />
      </header>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user,
    translate: getTranslate(state.locale),
    currentLanguage: getActiveLanguage(state.locale).code,
  };
}

export default connect(mapStateToProps)(Header);
