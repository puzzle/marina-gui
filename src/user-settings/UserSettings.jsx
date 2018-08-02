import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux/lib/index';
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row,
} from 'react-bootstrap';
import * as moment from 'moment';
import { getValueFromInputChangeEvent } from '../common/service.helper';
import { configurationActions } from '../employee/configuration.actions';
import {
  calculateAmount,
  calculatePercentage,
  formatCurrency,
} from '../common/number.helper';
import { bitcoinAddressValid } from '../common/bitcoin.helper';
import { alertActions } from '../app';

export const DATE_LOCK_START = 11;
export const DATE_LOCK_END = 25;

class UserSettings extends React.Component {
  constructor(props) {
    super(props);

    const dayOfMonth = moment().date();
    const isLocked = dayOfMonth >= DATE_LOCK_START && dayOfMonth <= DATE_LOCK_END;

    this.state = {
      percentage: 0,
      address: '',
      addressValid: false,
      isLocked,
    };

    const { dispatch } = this.props;
    dispatch(configurationActions.getConfiguration());
    if (isLocked) {
      dispatch(alertActions.error('employee.currentConfiguration.isLocked'));
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { userEmployee, configuration } = nextProps;
    if (userEmployee && configuration && userEmployee.bruttoSalary > 0) {
      this.setState({
        percentage: calculatePercentage(userEmployee.bruttoSalary, configuration.amountChf),
        address: configuration.currentAddress || '',
        addressValid: bitcoinAddressValid(configuration.currentAddress),
      });
    }
  }

  handleSubmit() {
    if (this.state.addressValid) {
      const { dispatch, userEmployee, configuration } = this.props;
      const config = configuration || {};
      config.amountChf = calculateAmount(userEmployee.bruttoSalary, this.state.percentage);
      config.currentAddress = this.state.address;
      dispatch(configurationActions.saveConfiguration(config));
    }
  }

  handleInputChange(event) {
    const { name } = event.target;
    const value = getValueFromInputChangeEvent(event);
    let { addressValid } = this.state;
    if (name === 'address') {
      addressValid = bitcoinAddressValid(value);
    }
    this.setState({ [name]: value, addressValid });
  }

  render() {
    const { userEmployee, translate } = this.props;
    return (
      <div>
        <h1>{translate('navigation.userSettings')}</h1>
        <ul>
          <li>
            {translate('employee.bruttoSalary')}:
            CHF {userEmployee && formatCurrency(userEmployee.bruttoSalary)}
          </li>
          <li>
            {translate('employee.currentConfiguration.amountChf')}:
            CHF {userEmployee && formatCurrency(calculateAmount(userEmployee.bruttoSalary, this.state.percentage))}
          </li>
        </ul>
        {userEmployee && userEmployee.bruttoSalary > 0 &&
        <Row>
          <Col md={4}>
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="percentage">
                <ControlLabel>{translate('employee.currentConfiguration.percentage')}</ControlLabel>
                <FormControl
                  componentClass="select"
                  name="percentage"
                  value={this.state.percentage}
                  placeholder={translate('employee.currentConfiguration.percentage')}
                  onChange={this.handleInputChange}
                  disabled={this.state.isLocked}
                >
                  <option value="0">
                    {translate('employee.currentConfiguration.zeroPercent')}
                  </option>
                  {[...Array(25).keys()].map(val => (
                    <option key={val + 1} value={val + 1}>{val + 1} %</option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup
                controlId="address"
                validationState={this.state.addressValid ? 'success' : 'error'}
              >
                <ControlLabel>{translate('employee.currentConfiguration.address')}</ControlLabel>
                <FormControl
                  type="text"
                  name="address"
                  value={this.state.address}
                  placeholder={translate('employee.currentConfiguration.address')}
                  onChange={this.handleInputChange}
                  disabled={this.state.isLocked}
                />
              </FormGroup>
            </form>
            <ButtonToolbar style={{ marginTop: '20px' }}>
              <Button onClick={this.handleSubmit} disabled={this.state.isLocked}>
                {translate('employee.save')}
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userEmployee } = state.userEmployee;
  const { configuration } = state.configuration;
  return {
    userEmployee,
    configuration,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(UserSettings);
