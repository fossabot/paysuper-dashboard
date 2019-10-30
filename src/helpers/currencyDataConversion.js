export function getCurrencyItemFromValue(value) {
  const [currency, region] = value.split('-');
  if (region) {
    return { currency, region };
  }
  return { currency, region: currency };
}

export function getCurrencyValueFromItem(item) {
  if (item.currency === item.region) {
    return item.currency;
  }
  return `${item.currency}-${item.region}`;
}
