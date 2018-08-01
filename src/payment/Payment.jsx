import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row,
  Table,
} from 'react-bootstrap';
import { employeeActions } from '../employee/employee.actions';
import {
  getExplorerTxUrl,
  getUtxosForAddress,
  getValueFromInputChangeEvent,
} from '../common/service.helper';
import {
  bitcoinPrivateKeyValid,
  formatCurrency,
  formatNumber,
  getAddressesFromPrivKey,
  SATOSHIS_IN_BTC,
} from '../common/number.helper';

export const FEE_RATES = [
  0.5, 1, 2, 3, 5,
  10, 20, 30, 50,
  100, 200, 300, 500,
];

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateKey: '',
      exchangeRate: 0,
      fee: 1,
      employees: null,
      utxoSet: null,
      privateKeyValid: false,
      exchangeRateValid: false,
    };

    const { dispatch } = this.props;
    dispatch(employeeActions.getEmployees());

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculatePaymentAmount = this.calculatePaymentAmount.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { employees } = nextProps;
    employees = employees.map(e => ({
      selected: true,
      ...e,
    }));
    this.setState({ employees });
  }

  handleSubmit() {
    console.log(this.state);
  }

  handleInputChange(event) {
    const { name } = event.target;
    const value = getValueFromInputChangeEvent(event);
    let { privateKeyValid, exchangeRateValid } = this.state;
    if (name === 'privateKey') {
      privateKeyValid = bitcoinPrivateKeyValid(value);
      if (privateKeyValid) {
        const addrs = getAddressesFromPrivKey(value).join(',');
        getUtxosForAddress(addrs).then((utxoSet) => {
          utxoSet.forEach(u => (u.selected = true));
          this.setState({ utxoSet });
        });
      }
    }
    if (name === 'exchangeRate') {
      exchangeRateValid = (value > 0);
    }
    this.setState({ [name]: value, privateKeyValid, exchangeRateValid });
  }

  calculatePaymentAmount(employee) {
    const btc = (employee.currentConfiguration.amountChf / this.state.exchangeRate);
    return formatNumber(Math.ceil(btc * SATOSHIS_IN_BTC));
  }

  toggleUtxo(idx) {
    const { utxoSet } = this.state;
    this.setState({
      utxoSet: utxoSet.map((u, i) => {
        if (i === idx) {
          u.selected = !u.selected;
        }
        return u;
      }),
    });
  }

  toggleEmployee(idx) {
    const { employees } = this.state;
    this.setState({
      employees: employees.map((u, i) => {
        if (i === idx) {
          u.selected = !u.selected;
        }
        return u;
      }),
    });
  }

  render() {
    // n3RxX9N7cdUuMTZ32rfMdGYKaR2czkpVoH
    // 2MsVeLrvm5oqJk2wVVfxGyWiZFGfPTaEQer
    // cTkM2RkhKxmWN9spK2thhvqBfUAm1kUnKYxAWqwXhKxtUkuhCfAw
    const { translate } = this.props;
    const { employees } = this.state;
    return (
      <div>
        <h1>{translate('payment.title')}</h1>
        <Row>
          <Col md={4}>
            <form onSubmit={this.handleSubmit}>
              <FormGroup
                controlId="privateKey"
                validationState={this.state.privateKeyValid ? 'success' : 'error'}
              >
                <ControlLabel>{translate('payment.privateKey')}</ControlLabel>
                <FormControl
                  type="text"
                  name="privateKey"
                  value={this.state.privateKey}
                  placeholder={translate('payment.privateKey')}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup
                controlId="exchangeRate"
                validationState={this.state.exchangeRateValid ? 'success' : 'error'}
              >
                <ControlLabel>{translate('payment.exchangeRate')}</ControlLabel>
                <FormControl
                  type="number"
                  name="exchangeRate"
                  value={this.state.exchangeRate}
                  placeholder={translate('payment.exchangeRate')}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup controlId="fee">
                <ControlLabel>
                  {translate('payment.fee')}
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://jochen-hoenicke.de/queue/#1,24h"
                  >
                    {translate('payment.mempoolStatistics')}
                  </a>
                </ControlLabel>
                <FormControl
                  componentClass="select"
                  name="fee"
                  value={this.state.fee}
                  placeholder={translate('payment.fee')}
                  onChange={this.handleInputChange}
                >
                  {FEE_RATES.map(val => (
                    <option key={val} value={val}>
                      {translate(`payment.feeRates.${val}`)}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
            </form>
          </Col>
          {this.state.utxoSet &&
          <Col md={4}>
            <h2>{translate('payment.inputs')}</h2>
            <ul>
              {this.state.utxoSet.map((utxo, idx) => (
                <li key={utxo.txid}>
                  <Checkbox
                    onChange={() => this.toggleUtxo(idx)}
                    checked={utxo.selected}
                  >
                    {utxo.address}
                  </Checkbox>
                  {translate('payment.txId')}:
                  <small>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={getExplorerTxUrl(utxo.txid)}
                    >
                      {utxo.txid}
                    </a> : {utxo.vout}
                  </small>
                  <br />
                  {translate('payment.balance')}:
                  {formatNumber(utxo.satoshis)} sat
                  / {utxo.satoshis / SATOSHIS_IN_BTC} BTC
                  <br />
                  {translate('payment.confirmations')}: {utxo.confirmations}
                </li>
              ))}
            </ul>
          </Col>
          }
        </Row>
        <Row>
          <Col md={8}>
            <h2>{translate('payment.recipients')}</h2>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>{translate('payment.pay')}</th>
                  <th>{translate('employee.username')}</th>
                  <th>{translate('employee.currentConfiguration.amountChf')}</th>
                  <th>{translate('employee.currentConfiguration.address')}</th>
                  <th>{translate('payment.paymentSatoshis')}</th>
                </tr>
              </thead>
              <tbody>
                {employees && employees
                  .filter(emp => emp && emp.agreement && emp.currentConfiguration && emp.currentConfiguration.amountChf > 0)
                  .map((emp, idx) => (
                    <tr key={emp.id}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => this.toggleEmployee(idx)}
                          checked={emp.selected}
                        />
                      </td>
                      <td>{emp.username}</td>
                      <td>CHF {formatCurrency(emp.currentConfiguration.amountChf)}</td>
                      <td>{emp.currentConfiguration.currentAddress}</td>
                      <td>{this.state.exchangeRate ? this.calculatePaymentAmount(emp) : '0'}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {this.state.privateKeyValid && this.state.utxoSet && this.state.utxoSet.length && this.state.exchangeRateValid &&
        <Row>
          <Col md={3}>
            <h2>{translate('payment.summary')}</h2>
            <Table condensed>
              <tbody>
                <tr>
                  <th>{translate('payment.inputs')}</th>
                  <td align="right">
                    {formatNumber(_.sumBy(this.state.utxoSet.filter(u => u.selected), 'satoshis'))} sat
                  </td>
                </tr>
                <tr>
                  <th>{translate('payment.outputs')}</th>
                  <td align="right">
                    {formatNumber(_.sumBy(employees.filter(e => e.selected), e => this.calculatePaymentAmount(e)))} sat
                  </td>
                </tr>
              </tbody>
            </Table>
            <ButtonToolbar style={{ marginTop: '20px' }}>
              <Button onClick={this.handleSubmit}>
                {translate('payment.send')}
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
  const { employees } = state.employees;
  return {
    employees,
    translate: getTranslate(state.locale),
  };
}

export default connect(mapStateToProps)(Payment);
