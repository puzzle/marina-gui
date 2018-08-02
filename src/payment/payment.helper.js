import { crypto, script, TransactionBuilder } from 'bitcoinjs-lib';
import * as _ from 'lodash';
import {
  feeRateOk,
  getFeeRate,
  getKeyPairFromPrivKey,
  getNetwork,
  isSegwitAddress,
  MAX_FEE_RATE,
  naiveTxSizeEstimation,
  SATOSHIS_IN_BTC,
} from '../common/bitcoin.helper';

export function readyToBuildTx(state) {
  return state.privateKeyValid &&
    state.exchangeRateValid &&
    state.changeAddressValid &&
    state.utxoSet && state.utxoSet.length;
}

export function calculatePaymentAmount(exchangeRate, employee) {
  const btc = (employee.currentConfiguration.amountChf / exchangeRate);
  return Math.ceil(btc * SATOSHIS_IN_BTC);
}

export function buildTx(state, utxoSet, employees) {
  if (!readyToBuildTx(state)) {
    return null;
  }
  const keyPair = getKeyPairFromPrivKey(state.privateKey);
  const filteredUtxo = utxoSet.filter(utxo => utxo.selected);
  const filteredEmployees = employees.filter(employee => employee.selected);

  if (filteredUtxo.length === 0 || filteredEmployees.length === 0) {
    return null;
  }

  // create inputs
  const inputs = filteredUtxo.map(utxo => ({
    address: utxo.address,
    sats: utxo.satoshis,
    txid: utxo.txid,
    vout: utxo.vout,
  }));

  // create outputs for employee payments
  const outputs = filteredEmployees.map((employee) => {
    const satoshis = calculatePaymentAmount(state.exchangeRate, employee);
    return {
      address: employee.currentConfiguration.currentAddress,
      sats: satoshis,
    };
  });

  // we need to leave something for the fees
  const inputSum = _.sumBy(inputs, 'sats');
  let outputSum = _.sumBy(outputs, 'sats');
  if (outputSum >= inputSum) {
    return null;
  }
  const spareAmount = inputSum - outputSum;
  const decorateTx = (tx, fee, feeRate) => {
    tx.numInputs = inputs.length;
    tx.inputSum = inputSum;
    tx.numOutputs = outputs.length;
    tx.outputSum = outputSum;
    tx.fee = fee;
    tx.feeRate = feeRate;
    return tx;
  };

  // first try, no change address
  let tx = _buildTx(inputs, outputs, keyPair);
  if (tx !== null && feeRateOk(spareAmount, tx.byteLength(), state.feeRate)) {
    return decorateTx(tx, spareAmount, getFeeRate(spareAmount, tx.byteLength()));
  }

  // now add a change address and adjust fee until we're in the target zone
  let currentFee = naiveTxSizeEstimation(inputs.length, outputs.length + 1) * state.feeRate;
  const changeOutput = {
    address: state.changeAddress,
    sats: spareAmount - currentFee,
  };
  outputs.push(changeOutput);

  tx = _buildTx(inputs, outputs, keyPair);
  while (tx !== null) {
    outputSum = _.sumBy(outputs, 'sats');

    // if we land on the fee we want, great
    if (feeRateOk(currentFee, tx.byteLength(), state.feeRate)) {
      return decorateTx(tx, currentFee, getFeeRate(currentFee, tx.byteLength()));
    }

    // if not, adjust the fee and try again
    currentFee = tx.byteLength() * state.feeRate;
    changeOutput.sats = spareAmount - currentFee;
    tx = _buildTx(inputs, outputs, keyPair);
  }

  return null;
}

function _buildTx(inputs, outputs, keyPair) {
  const network = getNetwork();
  const pubKey = keyPair.getPublicKeyBuffer();
  const txb = new TransactionBuilder(network, MAX_FEE_RATE);

  try {
    inputs.forEach(input => txb.addInput(input.txid, input.vout));
    outputs.forEach(output => txb.addOutput(output.address, output.sats));

    inputs.forEach((input, index) => {
      if (isSegwitAddress(input.address)) {
        const pubKeyHash = crypto.hash160(pubKey);
        const redeemScript = script.witnessPubKeyHash.output.encode(pubKeyHash);
        txb.sign(index, keyPair, redeemScript, null, input.sats);
      } else {
        txb.sign(index, keyPair);
      }
    });

    return txb.build();
  } catch (e) {
    return null;
  }
}
