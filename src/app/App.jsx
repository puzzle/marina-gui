import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { getTranslate, setActiveLanguage } from 'react-localize-redux';
import { connect } from 'react-redux';
import 'react-table/react-table.css';

import { store } from './store';
import { alertActions } from './alert.actions';
import { authenticationActions } from '../auth';
import { availableLanguages, currentLanguage } from '../i18n';
import { history } from './history';
import Header from '../header/Header';
import UserSettings from '../user-settings/UserSettings';
import Dashboard from '../dashboard/Dashboard';
import Employees from '../employee/Employees';
import Employee from '../employee/Employee';
import Payment from '../payment/Payment';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen(() => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
    dispatch(authenticationActions.checkLogin());
  }

  render() {
    const { alert, user, translate } = this.props;
    if (!user) {
      return (translate('app.redirectLogin'));
    }
    return (
      <Router history={history}>
        <div>
          <Header
            onChange={l => store.dispatch(setActiveLanguage(l))}
            current={currentLanguage}
            available={availableLanguages}
          />

          <div id="main">
            {alert && alert.message &&
            <div className={`alert ${alert.type}`}>
              {translate(alert.message.toString())}
            </div>
            }
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/user-settings" component={UserSettings} />
              <Route path="/employees" component={Employees} />
              <Route path="/employee/:id" component={Employee} />
              <Route path="/payment" component={Payment} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  const { user } = state.authentication;
  return {
    user,
    alert,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(App);
