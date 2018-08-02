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
