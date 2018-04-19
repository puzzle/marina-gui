import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {TranslatorProvider} from 'react-translate'
import available from './i18n/available';
import {loadTranslations, currentLanguage } from './index';
import Navigation from './navigation/Navigation';
import Header from './header/Header';
import UserSettings from './user-settings/UserSettings';
import Dashboard from './dashboard/Dashboard';

import './App.css';

class App extends Component {
  state = {
    translationsOverride: null,
    name: '',
  };

  async loadTranslations(lang) {
    const translationsOverride = loadTranslations(lang);
    this.setState({translationsOverride})
  }

  render() {
    const {translations} = this.props;
    const {translationsOverride} = this.state;
    return (
      <TranslatorProvider translations={translationsOverride || translations}>
        <Router>
          <div id="grid">
            <div id="navigation">
              <Navigation/>
            </div>
            <div id="header">
              <Header
                onChange={(l) => this.loadTranslations(l)}
                current={currentLanguage}
                available={Object.keys(available)}/>
            </div>
            <div id="main">
              <Route exact path="/" component={Dashboard}/>
              <Route path="/user-settings" component={UserSettings}/>
            </div>
          </div>
        </Router>
      </TranslatorProvider>
    );
  }
}

export default App;
