import { address as bitcoinAddress, networks } from 'bitcoinjs-lib';

export const VALID_BITCOIN_ADDRESS_VERSIONS = [
  networks.bitcoin.pubKeyHash,
  networks.bitcoin.scriptHash,
  networks.testnet.pubKeyHash,
  networks.testnet.scriptHash,
];

export const VALID_BITCOIN_BECH32_PREFIXES = [
  networks.bitcoin.bech32,
  networks.testnet.bech32,
];

export function round5Cents(num) {
  if (num === null || num === undefined) {
    return num;
  }
  return Math.round(num * 20) / 20;
}

export function formatCurrency(x) {
  if (x === null || x === undefined) {
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
