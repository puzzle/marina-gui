import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class NavItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
    };
  }
  componentWillMount() {
    this.unlisten = this.props.history.listen((location) => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { to, children } = this.props;
    const isActive = this.state.location.pathname === to;

    return (
      <li className={isActive ? 'active' : ''}>
        <Link to={to}>{children}</Link>
      </li>
    );
  }
}

export default withRouter(NavItem);
