import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row,
} from 'react-bootstrap';
import * as _ from 'lodash';
import { employeeActions } from './employee.actions';
import { getValueFromInputChangeEvent } from '../common/service.helper';
import { employeeService } from './index';
import MonthlyPayouts from './MonthlyPayouts';

class Employee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      version: null,
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      bruttoSalary: 0,
      agreementFile: '',
      validation: {
        bruttoSalary: 'error',
      },
    };

    const { dispatch, match } = this.props;
    const { id } = match.params;

    if (id !== 'new') {
      dispatch(employeeActions.getEmployee(id));
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { employee } = nextProps;
    if (employee) {
      const validation = {
        bruttoSalary: employee.bruttoSalary > 0 ? 'success' : 'error',
      };
      this.setState({
        id: employee.id,
        version: employee.version,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        username: employee.username,
        bruttoSalary: employee.bruttoSalary || 0,
        validation,
      });
    }
  }

  getValidationState(ctrl, state) {
    const s = state || this.state;
    const val = s[ctrl] === null || s[ctrl] === undefined ? '' : s[ctrl].toString();
    const errState = (val.length > 0 && val.replace(/\s/g, '').length > 0);
    return errState && val !== '0' ? 'success' : 'error';
  }

  handleSubmit() {
    const { dispatch } = this.props;
    if (_.every(this.state.validation, val => val === 'success')) {
      dispatch(employeeActions.saveEmployee(this.state));
    }
  }

  handleUpload() {
    const { dispatch, employee } = this.props;
    if (this.state.agreementFile !== '') {
      dispatch(employeeActions.uploadFile(employee.id, this.state.agreementFile));
    }
  }

  handleInputChange(event) {
    const { name } = event.target;
    const value = getValueFromInputChangeEvent(event);
    this.setState((prevState) => {
      const validation = Object.assign({}, prevState.validation);
      validation[name] = this.getValidationState(name, { [name]: value });
      return { [name]: value, validation };
    });
  }

  render() {
    const { translate, employee } = this.props;
    return (
      <div>
        <h1>{translate('employee.editCreateEmployee')}</h1>
        <Row>
          <Col md={4}>
            <form onSubmit={this.handleSubmit}>
              {['firstName', 'lastName', 'username', 'email'].map((ctrl => (
                <FormGroup
                  controlId={ctrl}
                  validationState={this.getValidationState(ctrl)}
                  key={ctrl}
                >
                  <ControlLabel>{translate(`employee.${ctrl}`)}</ControlLabel>
                  <FormControl
                    type="text"
                    name={ctrl}
                    value={this.state[ctrl]}
                    placeholder={translate(`employee.${ctrl}`)}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              )))}
              <FormGroup
                controlId="bruttoSalary"
                validationState={this.getValidationState('bruttoSalary')}
              >
                <ControlLabel>{translate('employee.bruttoSalary')}</ControlLabel>
                <FormControl
                  type="number"
                  name="bruttoSalary"
                  value={this.state.bruttoSalary}
                  placeholder={translate('employee.bruttoSalary')}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </form>
            <ButtonToolbar style={{ marginTop: '20px' }}>
              <Button onClick={this.handleSubmit}>
                {translate('employee.save')}
              </Button>
            </ButtonToolbar>
          </Col>
          <Col md={1}>&nbsp;</Col>
          {this.state.id !== null &&
          <Col md={4}>
            <form onSubmit={this.handleUpload}>
              <h2>
                {translate('employee.agreement.current')}:&nbsp;
                {translate(`employee.agreement.${employee && !!employee.agreement}`)}
                {employee && !!employee.agreement &&
                <a href={employeeService.getAgreementUrl(employee.id)}>
                  &nbsp;{translate('app.download')}
                </a>
                }
              </h2>
              <FormGroup
                controlId="agreementFile"
                validationState={this.getValidationState('agreementFile')}
              >
                <ControlLabel>{translate('employee.agreementFile')}</ControlLabel>
                <FormControl
                  type="file"
                  name="agreementFile"
                  placeholder={translate('employee.agreementFile')}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </form>
            <ButtonToolbar style={{ marginTop: '20px' }}>
              <Button onClick={this.handleUpload}>
                {translate('employee.upload')}
              </Button>
            </ButtonToolbar>
          </Col>
          }
        </Row>
        {employee && employee.monthlyPayouts && employee.monthlyPayouts.length > 0 &&
        <div>
          <h3>{translate('employee.payouts')}</h3>
          <MonthlyPayouts monthlyPayouts={employee.monthlyPayouts} />
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { employee } = state.employee;
  return {
    user,
    employee,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Employee);
