import { address as bitcoinAddress, crypto, ECPair, networks, script as bitcoinScript } from 'bitcoinjs-lib';
import { handleResponse, handleResponseText } from './service.helper';

export const MAINNET_EXPLORER_URL = 'https://blockstream.info';
export const TESTNET_EXPLORER_URL = 'https://blockstream.info/testnet';
export const MAINNET_API_URL = 'https://blockstream.info/api';
export const TESTNET_API_URL = 'https://blockstream.info/testnet/api';
export const MAINNET_PUSH_URL = 'https://blockchain.info';
export const TESTNET_PUSH_URL = 'https://testnet.blockchain.info';

export const VALID_BITCOIN_SCRIPT_VERSIONS = [
  networks.bitcoin.scriptHash,
  networks.testnet.scriptHash,
];

export const VALID_BITCOIN_ADDRESS_VERSIONS = [
  networks.bitcoin.pubKeyHash,
  networks.testnet.pubKeyHash,
  ...VALID_BITCOIN_SCRIPT_VERSIONS,
];

export const VALID_BITCOIN_BECH32_PREFIXES = [
  networks.bitcoin.bech32,
  networks.testnet.bech32,
];

export const SATOSHIS_IN_BTC = 100000000;

export const FEE_RATES = [
  0.5, 1, 2, 3, 5,
  10, 20, 30, 50,
  100, 200, 300, 500,
];

export const MAX_FEE_RATE = 1000;

// source: https://github.com/bitcoinjs/coinselect/blob/master/utils.js
export const TX_EMPTY_SIZE = 4 + 1 + 1 + 4;
export const TX_INPUT_BASE = 32 + 4 + 1 + 4;
export const TX_INPUT_PUBKEYHASH = 107;
export const TX_OUTPUT_BASE = 8 + 1;
export const TX_OUTPUT_PUBKEYHASH = 25;

export function bitcoinAddressValid(address) {
  // try base58check first
  try {
    const parsed = bitcoinAddress.fromBase58Check(address);
    if (VALID_BITCOIN_ADDRESS_VERSIONS.indexOf(parsed.version) >= 0) {
      return true;
    }
  } catch (e) {
    // ignore
  }

  return isBech32Address(address);
}

export function isBech32Address(address) {
  // try bech32
  try {
    const parsed = bitcoinAddress.fromBech32(address);
    if (VALID_BITCOIN_BECH32_PREFIXES.indexOf(parsed.prefix) >= 0) {
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}

export function isSegwitAddress(address) {
  if (!bitcoinAddressValid(address)) {
    return false;
  }

  try {
    const parsed = bitcoinAddress.fromBase58Check(address);
    if (VALID_BITCOIN_SCRIPT_VERSIONS.indexOf(parsed.version) >= 0) {
      return true;
    }
  } catch (e) {
    // ignore
  }

  return isBech32Address(address);
}

export function bitcoinPrivateKeyValid(privKey) {
  const network = isProd() ? networks.bitcoin : networks.testnet;
  try {
    ECPair.fromWIF(privKey, network);
    return true;
  } catch (e) {
    // ignore
  }
  return false;
}

export function getNetwork() {
  return isProd() ? networks.bitcoin : networks.testnet;
}

export function getAddressesFromPrivKey(privKey) {
  const network = getNetwork();
  const keyPair = getKeyPairFromPrivKey(privKey);
  return [keyPair.getAddress(), getNestedP2WPKHAddress(keyPair, network)];
}

export function getKeyPairFromPrivKey(privKey) {
  const network = getNetwork();
  return ECPair.fromWIF(privKey, network);
}

export function getNestedP2WPKHAddress(keyPair, network) {
  const pubKey = keyPair.getPublicKeyBuffer();
  const witnessScript = bitcoinScript.witnessPubKeyHash.output.encode(crypto.hash160(pubKey));
  const scriptPubKey = bitcoinScript.scriptHash.output.encode(crypto.hash160(witnessScript));
  return bitcoinAddress.fromOutputScript(scriptPubKey, network);
}

export function feeRateOk(fee, bytes, targetFeeRate) {
  const rate = getFeeRate(fee, bytes);
  const targetRateIndex = FEE_RATES.indexOf(parseInt(targetFeeRate, 10));
  if (targetRateIndex === -1) {
    return rate >= targetFeeRate;
  }
  if (targetRateIndex === FEE_RATES.length - 1) {
    return rate >= targetFeeRate && rate < MAX_FEE_RATE;
  }
  return rate >= targetFeeRate && rate < FEE_RATES[targetRateIndex + 1];
}

export function getFeeRate(fee, bytes) {
  return fee / bytes;
}

export function naiveTxSizeEstimation(numInputs, numOutputs) {
  return TX_EMPTY_SIZE + (numInputs * (TX_INPUT_BASE + TX_INPUT_PUBKEYHASH)) + (numOutputs * (TX_OUTPUT_BASE + TX_OUTPUT_PUBKEYHASH));
}

export function isProd() {
  return window.location.hostname === 'marina.puzzle.ch';
}

export function getApiUrl() {
  return isProd() ? MAINNET_API_URL : TESTNET_API_URL;
}

export function getPushUrl() {
  return isProd() ? MAINNET_PUSH_URL : TESTNET_PUSH_URL;
}

export function getExplorerUrl() {
  return isProd() ? MAINNET_EXPLORER_URL : TESTNET_EXPLORER_URL;
}

function makeRequestOptionsApi(method, obj = {}) {
  return {
    method,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'omit',
    mode: 'cors',
    redirect: 'error',
    ...obj,
  };
}

export function getUtxosForAddress(addresses) {
  const promises = [];
  addresses.forEach((address) => {
    const promise = fetch(`${getApiUrl()}/address/${address}/utxo`, makeRequestOptionsApi('GET'))
      .then(handleResponse)
      .then((utxos) => {
        utxos.forEach(u => (u.address = address));
        return utxos;
      });
    promises.push(promise);
  });
  return Promise.all(promises);
}

export function getExplorerTxUrl(tx) {
  return `${getExplorerUrl()}/tx/${tx}`;
}

export function getExplorerAddrUrl(addr) {
  return `${getExplorerUrl()}/address/${addr}`;
}

export function publishTx(tx) {
  return fetch(`${getPushUrl()}/pushtx`, makeRequestOptionsApi('POST', {
    body: `tx=${tx.toHex()}&cors=true`,
  }))
    .then(handleResponseText);
}
