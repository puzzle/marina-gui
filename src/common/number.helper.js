import {
  address as bitcoinAddress,
  script as bitcoinScript,
  crypto,
  networks,
  ECPair,
} from 'bitcoinjs-lib';
import { isProd } from './service.helper';

export const VALID_BITCOIN_ADDRESS_VERSIONS = [
  networks.bitcoin.pubKeyHash,
  networks.bitcoin.scriptHash,
  networks.testnet.pubKeyHash,
  networks.testnet.scriptHash,
];

export const VALID_BITCOIN_PRIVKEY_VERSIONS = [
  networks.bitcoin.wif,
  networks.testnet.wif,
];

export const VALID_BITCOIN_BECH32_PREFIXES = [
  networks.bitcoin.bech32,
  networks.testnet.bech32,
];

export const SATOSHIS_IN_BTC = 100000000;

export function round5Cents(num) {
  if (num === null || num === undefined) {
    return num;
  }
  return Math.round(num * 20) / 20;
}

export function formatCurrency(x) {
  if (x === null || x === undefined || Number.isNaN(x)) {
    return x;
  }
  return formatNumber(Number(x).toFixed(2));
}

export function formatNumber(x) {
  if (x === null || x === undefined || Number.isNaN(x)) {
    return x;
  }
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
  return parts.join('.');
}

export function calculatePercentage(fullSalary, selectedAmount) {
  return Math.round(selectedAmount / (fullSalary / 100));
}

export function calculateAmount(fullSalary, selectedPercentage) {
  if (selectedPercentage === 0) {
    return 0;
  }
  return round5Cents((fullSalary / 100) * selectedPercentage);
}

export function bitcoinAddressValid(address) {
  let parsed = null;
  // try base58check first
  try {
    parsed = bitcoinAddress.fromBase58Check(address);
    if (VALID_BITCOIN_ADDRESS_VERSIONS.indexOf(parsed.version) >= 0) {
      return true;
    }
  } catch (e) {
    // ignore
  }

  // try bech32
  try {
    parsed = bitcoinAddress.fromBech32(address);
    if (VALID_BITCOIN_BECH32_PREFIXES.indexOf(parsed.prefix) >= 0) {
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
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

export function getAddressesFromPrivKey(privKey) {
  const network = isProd() ? networks.bitcoin : networks.testnet;
  const keyPair = ECPair.fromWIF(privKey, network);
  return [keyPair.getAddress(), getNestedP2WPKHAddress(keyPair, network)];
}

export function getNestedP2WPKHAddress(keyPair, network) {
  const pubKey = keyPair.getPublicKeyBuffer();
  const witnessScript = bitcoinScript.witnessPubKeyHash.output.encode(crypto.hash160(pubKey));
  const scriptPubKey = bitcoinScript.scriptHash.output.encode(crypto.hash160(witnessScript));
  return bitcoinAddress.fromOutputScript(scriptPubKey, network);
}
