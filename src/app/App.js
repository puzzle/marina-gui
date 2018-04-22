import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {setActiveLanguage} from 'react-localize-redux';
import {connect} from 'react-redux';

import {store} from './store';
import {alertActions} from './alert.actions';
import {authenticationActions} from '../auth';
import {availableLanguages, currentLanguage} from '../i18n';
import {history} from './history';
import Header from '../header/Header';
import UserSettings from '../user-settings/UserSettings';
import Dashboard from '../dashboard/Dashboard';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    const {dispatch} = this.props;
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
    dispatch(authenticationActions.checkLogin());
  }

  render() {
    const {alert} = this.props;
    return (
      <Router>
        <div>
          <Header
            onChange={(l) => store.dispatch(setActiveLanguage(l))}
            current={currentLanguage}
            available={Object.keys(availableLanguages)}/>

          <div id="main">
            {alert.message &&
            <div className={`alert ${alert.type}`}>{alert.message.toString()}</div>
            }
            <Route exact path="/" component={Dashboard}/>
            <Route path="/user-settings" component={UserSettings}/>
          </div>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const {alert} = state;
  return {
    alert,
  };
}

export default connect(mapStateToProps)(App);
