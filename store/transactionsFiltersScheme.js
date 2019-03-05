import { find, flatten, difference } from 'lodash-es';
import moment from 'moment';

const filters = {
  id: {
    emptyValue: '',
  },
  orderID: {
    emptyValue: '',
    apiQueryName: 'order_id',
  },
  account: {
    emptyValue: '',
  },
  project: {
    emptyValue: () => [],
    getFilterValueFromQuery({ queryValue, dictionaries }) {
      return queryValue.split(',').map(id => find(dictionaries.projects, { id }));
    },
    getQueryValueFromFilterValue({ filterValue }) {
      return filterValue.map(item => item.id).join(',');
    },
    getApiQueryValueFromFilterValue({ filterValue }) {
      return filterValue.map(item => item.id);
    },
  },
  status: {
    emptyValue: () => [],
    getFilterValueFromQuery({ queryValue, dictionaries }) {
      const queryValueArray = queryValue.split(',');
      return dictionaries.statuses.filter((item) => {
        const ids = item.id.split(',');
        const diff = difference(queryValueArray, ids);

        if (diff.length + ids.length === queryValueArray.length) {
          return true;
        }
        return false;
      });
    },
    getQueryValueFromFilterValue({ filterValue }) {
      return flatten(filterValue.map(item => item.id.split(','))).join(',');
    },
    getApiQueryValueFromFilterValue({ filterValue }) {
      return flatten(filterValue.map(item => item.id.split(',').map(num => Number(num))));
    },
  },
  paymentMethod: {
    emptyValue: () => [],
    getFilterValueFromQuery({ queryValue, dictionaries }) {
      return queryValue.split(',').map(id => find(dictionaries.paymentMethods, { id }));
    },
    getQueryValueFromFilterValue({ filterValue }) {
      return filterValue.map(item => item.id).join(',');
    },
    getApiQueryValueFromFilterValue({ filterValue }) {
      return filterValue.map(item => item.id);
    },
    apiQueryName: 'payment_method',
  },
  quickFilter: {
    emptyValue: '',
    apiQueryName: 'quick_filter',
  },
  date: {
    emptyValue: '',
    group: 'date',
  },
  dateFrom: {
    emptyValue: '',
    group: 'date',
  },
  dateTo: {
    emptyValue: '',
    group: 'date',
  },

  limit: {
    emptyValue: 5,
    group: 'page',
  },

  offset: {
    emptyValue: 0,
    group: 'page',
  },

  sort: {
    emptyValue: () => ['_id'],
  },
};

function getDateQuery({ filterValues: { date, dateFrom, dateTo } }) {
  const result = {};

  if (date) {
    const nextDay = moment.unix(date).add(1, 'days').unix();
    result.project_date_from = (date / 1000).toFixed();
    result.project_date_to = (nextDay / 1000).toFixed();
  }
  if (dateFrom) {
    result.project_date_from = (dateFrom / 1000).toFixed();
  }
  if (dateTo) {
    result.project_date_to = (dateTo / 1000).toFixed();
  }
  return result;
}
function getPageQuery({ queryValue, filterValues }) {
  return {
    limit: filterValues.limit,
    offset: (queryValue - 1) * filterValues.limit,
  };
}

const groupHandlers = {
  page: {
    getQueryValueFromFilterValue({ filterValues: { offset, limit } }) {
      return {
        page: (offset / limit) + 1,
      };
    },
    getFilterValueFromQuery: getPageQuery,
    getApiQueryValueFromQuery: getPageQuery,
  },
  date: {
    getApiQueryValueFromQuery: getDateQuery,
    getApiQueryValueFromFilterValue: getDateQuery,
  },
};

export default {
  filters,
  groupHandlers,
};
