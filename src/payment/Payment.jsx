import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
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
import { getValueFromInputChangeEvent } from '../common/service.helper';
import { formatCurrency, formatNumber } from '../common/number.helper';
import {
  bitcoinAddressValid,
  bitcoinPrivateKeyValid,
  FEE_RATES,
  getAddressesFromPrivKey, getExplorerAddrUrl,
  getExplorerTxUrl,
  getUtxosForAddress,
  publishTx,
  SATOSHIS_IN_BTC,
} from '../common/bitcoin.helper';
import {
  buildTx,
  calculatePaymentAmount,
  readyToBuildTx,
} from './payment.helper';
import { alertActions } from '../app';
import { employeeService } from '../employee';

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateKey: '',
      exchangeRate: 0,
      changeAddress: '',
      feeRate: 1,
      employees: null,
      utxoSet: null,
      tx: null,
      privateKeyValid: false,
      exchangeRateValid: false,
      changeAddressValid: false,
    };

    const { dispatch } = this.props;
    dispatch(employeeActions.getEmployees());

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { employees } = nextProps;
    if (!employees) {
      return;
    }
    employees = employees.map(e => ({
      selected: true,
      ...e,
    }));
    this.setState({ employees });
  }

  handleSubmit() {
    const { employees } = this.state;
    const { dispatch } = this.props;
    console.log(this.state);
    publishTx(this.state.tx).then((response) => {
      console.log(response);
      const payouts = employees
        .filter(e => e.selected)
        .map(e => ({
          employeeId: e.id,
          amountChf: e.currentConfiguration.amountChf,
          amountBtc: calculatePaymentAmount(this.state.exchangeRate, e),
          rateChf: this.state.exchangeRate,
          publicAddress: e.currentConfiguration.currentAddress,
        }));
      return employeeService.savePayouts(payouts).then((response2) => {
        console.log(response2);
        dispatch(alertActions.success('payment.success'));
      });
    }, error => dispatch(alertActions.error(error)));
  }

  handleInputChange(event) {
    const { name } = event.target;
    const value = getValueFromInputChangeEvent(event);
    const { employees, utxoSet } = this.state;
    let { privateKeyValid, exchangeRateValid, changeAddressValid } = this.state;
    if (name === 'privateKey') {
      privateKeyValid = bitcoinPrivateKeyValid(value);
      if (privateKeyValid) {
        const addrs = getAddressesFromPrivKey(value);
        getUtxosForAddress(addrs).then((utxoSetNew) => {
          utxoSetNew.forEach((utxo) => {
            if (utxo.confirmations > 0) {
              utxo.selected = true;
            }
          });
          const newState = Object.assign({}, this.state, {
            utxoSet: utxoSetNew,
          });
          this.setState({
            ...newState,
            tx: buildTx(newState, utxoSetNew, employees),
          });
        });
      }
    }
    if (name === 'exchangeRate') {
      exchangeRateValid = (value > 0);
    }
    if (name === 'changeAddress') {
      changeAddressValid = bitcoinAddressValid(value);
    }
    const newState = Object.assign({}, this.state, {
      [name]: value,
      privateKeyValid,
      exchangeRateValid,
      changeAddressValid,
    });
    this.setState({
      ...newState,
      tx: buildTx(newState, utxoSet, employees),
    });
  }

  toggleUtxo(idx) {
    const { utxoSet, employees } = this.state;
    utxoSet.forEach((u, i) => {
      if (i === idx) {
        u.selected = !u.selected;
      }
      return u;
    });
    this.setState({
      tx: buildTx(this.state, utxoSet, employees),
      utxoSet,
    });
  }

  toggleEmployee(idx) {
    const { employees, utxoSet } = this.state;
    employees.forEach((u, i) => {
      if (i === idx) {
        u.selected = !u.selected;
      }
      return u;
    });
    this.setState({
      tx: buildTx(this.state, utxoSet, employees),
      employees,
    });
  }

  render() {
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
              <FormGroup
                controlId="changeAddress"
                validationState={this.state.changeAddressValid ? 'success' : 'error'}
              >
                <ControlLabel>{translate('payment.changeAddress')}</ControlLabel>
                <FormControl
                  type="text"
                  name="changeAddress"
                  value={this.state.changeAddress}
                  placeholder={translate('payment.changeAddress')}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup controlId="feeRate">
                <ControlLabel>
                  {translate('payment.feeRate')}
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
                  name="feeRate"
                  value={this.state.feeRate}
                  placeholder={translate('payment.feeRate')}
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
                  {translate('payment.txId')}:&nbsp;
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
                  {translate('payment.balance')}:&nbsp;
                  {formatNumber(utxo.satoshis)} sat
                  / {utxo.satoshis / SATOSHIS_IN_BTC} BTC
                  <br />
                  {translate('payment.confirmations')}:&nbsp;
                  {utxo.confirmations}
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
                      <td>
                        <a
                          rel="noopener noreferrer"
                          target="_blank"
                          href={getExplorerAddrUrl(emp.currentConfiguration.currentAddress)}
                        >
                          {emp.currentConfiguration.currentAddress}
                        </a>
                      </td>
                      <td>{this.state.exchangeRate ? formatNumber(calculatePaymentAmount(this.state.exchangeRate, emp)) : '0'}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {readyToBuildTx(this.state) && this.state.tx &&
        <Row>
          <Col md={4}>
            <h2>{translate('payment.summary')}</h2>
            <Table condensed>
              <tbody>
                <tr>
                  <th>{translate('payment.inputs')} ({this.state.tx.numInputs})</th>
                  <td align="right">
                    {formatNumber(this.state.tx.inputSum)} sat
                  </td>
                </tr>
                <tr>
                  <th>{translate('payment.outputs')} ({this.state.tx.numOutputs})</th>
                  <td align="right">
                    {formatNumber(this.state.tx.outputSum)} sat
                  </td>
                </tr>
                <tr>
                  <th>{translate('payment.fee')}</th>
                  <td align="right">
                    {formatNumber(this.state.tx.fee)} sat
                    ({formatCurrency(this.state.tx.feeRate)} sat/Byte)
                  </td>
                </tr>
                <tr>
                  <th>{translate('payment.fee')} CHF</th>
                  <td align="right">
                    {formatCurrency((this.state.exchangeRate / SATOSHIS_IN_BTC) * this.state.tx.fee)}
                  </td>
                </tr>
                <tr>
                  <th>{translate('payment.txSize')}</th>
                  <td align="right">{this.state.tx.toHex().length / 2} Bytes
                  </td>
                </tr>
                <tr>
                  <th>{translate('payment.txId')}</th>
                  <td align="right">
                    <small>{this.state.tx.getHash().reverse().toString('hex')}</small>
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
