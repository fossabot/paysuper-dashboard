import { findLastKey } from 'lodash-es';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';

function getAgreementApiQueryValue(value) {
  if (value === 'all') {
    return [];
  }
  const statusCode = findLastKey(merchantStatusScheme, item => value === item.value);
  if (statusCode) {
    return [statusCode];
  }
  return [];
}


const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_search',
  },

  status: {
    defaultValue: 'all',
    filterToApiQuery({ filterValue }) {
      return getAgreementApiQueryValue(filterValue);
    },
    queryToApiQuery({ queryValue, defaultValue }) {
      return getAgreementApiQueryValue(queryValue || defaultValue);
    },
  },

  sort: {
    defaultValue: () => [],
  },

  limit: {
    isPassingToQueryDisabled: true,
    defaultValue: 30,
  },

  offset: {
    isPassingToQueryDisabled: true,
    defaultValue: 0,
  },

  registrationDateFrom: {
    defaultValue: null,
    apiQueryName: 'registration_date_from',
  },
  registrationDateTo: {
    defaultValue: null,
    apiQueryName: 'registration_date_to',
  },
  receivedDateFrom: {
    defaultValue: null,
    apiQueryName: 'received_date_from',
  },
  receivedDateTo: {
    defaultValue: null,
    apiQueryName: 'received_date_to',
  },
};

export default {
  filters,
};
