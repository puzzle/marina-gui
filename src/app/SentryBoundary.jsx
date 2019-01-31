import React from 'react';
import {
  captureException,
  init,
  lastEventId,
  showReportDialog,
} from '@sentry/browser';

import { makeRequestOptions, url } from '../common/service.helper';

export default class SentryBoundary extends React.Component {
  static configureSentry() {
    fetch(url('/environmentconfiguration'), makeRequestOptions('GET'))
      .then(res => res.json())
      .then(json => init({
        dsn: json.sentryUrlFrontend,
        environment: json.sentryEnvironment,
      }));
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    SentryBoundary.configureSentry();
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.error) {
      // Render fallback UI
      return (
        <div>
          <h1>An error occurred</h1>
          <p>
            We are sorry, something has been going wrong. Our team has been notified.
          </p>
          <button onClick={() => lastEventId() && showReportDialog()}>Fill out a report</button>
        </div>
      );
    }
    // When there's not an error, render children untouched
    return this.props.children;
  }
}
