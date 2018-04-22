import React from 'react';
import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux/lib/index';

class UserSettings extends React.Component {
  render() {
    // const {translate, user} = this.props;
    return (
      <h1>coming soon...</h1>
    );
  }
}

function mapStateToProps(state) {
  const {user} = state.authentication;
  return {
    user,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(UserSettings);
