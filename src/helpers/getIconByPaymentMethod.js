import {
  camelCase,
  includes,
  lowerCase,
  toLower,
  upperFirst,
} from 'lodash-es';

export default function getIconByPaymentMethod(method) {
  if (includes(lowerCase(method), 'direct banking')) {
    return 'IconDirectBanking';
  }

  if (includes(lowerCase(method), 'union pay')) {
    return 'IconUnionPay';
  }

  return `Icon${upperFirst(camelCase(toLower(method)))}`;
}
