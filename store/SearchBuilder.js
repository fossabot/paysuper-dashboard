import { includes, omitBy, isEmpty, mapValues, forEach } from 'lodash-es';
import assert from 'simple-assert';

function getCleanQuery(query) {
  return omitBy(query, (value) => {
    if (value === 0 || value === undefined || value === null || value === '') {
      return true;
    }
    if (typeof value === 'object' && isEmpty(value)) {
      return true;
    }

    return false;
  });
}

export default class SearchBulder {
  constructor(scheme) {
    this.scheme = scheme;
  }

  getFilterValues({ filterNames = null, query = {}, dictionaries = {} } = {}) {
    const emptyFilterValues = this.getEmptyFilterValues();
    const groups = {};
    let schemeFilters = this.scheme.filters;
    if (filterNames) {
      schemeFilters = omitBy(this.scheme.filters, (value, name) => !includes(filterNames, name));
    }
    const filters = mapValues(schemeFilters, (schemeItem, filterName) => {
      const queryName = schemeItem.queryName || filterName;

      if (query[queryName]) {
        if (schemeItem.getFilterValueFromQuery) {
          return schemeItem.getFilterValueFromQuery({
            query,
            dictionaries,
            queryValue: query[queryName],
            emptyValue: schemeItem.emptyValue,
            emptyFilterValues,
          });
        }
        return query[queryName];
      }

      if (typeof schemeItem.emptyValue === 'function') {
        return schemeItem.emptyValue();
      }
      return schemeItem.emptyValue;
    });

    let result = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (
        schemeItem.group &&
        this.scheme.groupHandlers[schemeItem.group].getFilterValueFromQuery
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        result[filterName] = filterValue;
      }
    });

    forEach(groups, (filterValues, name) => {
      const handler = this.scheme.groupHandlers[name].getFilterValueFromQuery;
      const queryValue = query[name];
      if (queryValue) {
        result = {
          ...result,
          ...handler({ query, queryValue, filterValues }),
        };
      } else {
        result = {
          ...result,
          ...filterValues,
        };
      }
    });

    return result;
  }

  getEmptyFilterValues({ filterNames = null } = {}) {
    let schemeFilters = this.scheme.filters;
    if (filterNames) {
      schemeFilters = omitBy(this.scheme.filters, (value, name) => !includes(filterNames, name));
    }
    return mapValues(schemeFilters, (filter) => {
      if (typeof filter.emptyValue === 'function') {
        return filter.emptyValue();
      }
      return filter.emptyValue;
    });
  }

  getQueryFromFilterValues(filters) {
    let query = {};
    const groups = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (
        schemeItem.group &&
        this.scheme.groupHandlers[schemeItem.group].getQueryValueFromFilterValue
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        query[schemeItem.queryName || filterName] =
          schemeItem.getQueryValueFromFilterValue ?
            schemeItem.getQueryValueFromFilterValue({ filterValue }) :
            filterValue;
      }
    });

    forEach(groups, (filterValues, name) => {
      const handler = this.scheme.groupHandlers[name].getQueryValueFromFilterValue;
      query = {
        ...query,
        ...handler({ filterValues }),
      };
    });

    return getCleanQuery(query);
  }

  getApiQueryFromFilterValues(filters) {
    let apiQuery = {};
    const groups = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (
        schemeItem.group &&
        this.scheme.groupHandlers[schemeItem.group].getApiQueryValueFromFilterValue
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        apiQuery[schemeItem.apiQueryName || filterName] =
          schemeItem.getApiQueryValueFromFilterValue ?
            schemeItem.getApiQueryValueFromFilterValue({ filterValue }) :
            filterValue;
      }
    });

    forEach(groups, (filterValues, name) => {
      const handler = this.scheme.groupHandlers[name].getApiQueryValueFromFilterValue;
      apiQuery = {
        ...apiQuery,
        ...handler({ filterValues }),
      };
    });

    return getCleanQuery(apiQuery);
  }

  getApiQueryFromQuery(query) {
    const emptyFilterValues = this.getEmptyFilterValues();

    const groups = {};
    const filters = mapValues(this.scheme.filters, (schemeItem, filterName) => {
      const queryName = schemeItem.queryName || filterName;

      if (query[queryName]) {
        if (schemeItem.getApiQueryValueFromQuery) {
          return schemeItem.getApiQueryValueFromQuery({
            query,
            queryValue: query[queryName],
            emptyValue: schemeItem.emptyValue,
            emptyFilterValues,
          });
        }
        return query[queryName];
      }

      if (typeof schemeItem.emptyValue === 'function') {
        return schemeItem.emptyValue();
      }

      return schemeItem.emptyValue;
    });

    let apiQuery = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (
        schemeItem.group &&
        this.scheme.groupHandlers[schemeItem.group].getApiQueryValueFromQuery
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        apiQuery[schemeItem.apiQueryName || filterName] = filterValue;
      }
    });

    forEach(groups, (filterValues, name) => {
      const handler = this.scheme.groupHandlers[name].getApiQueryValueFromQuery;
      const queryValue = query[name];
      if (queryValue) {
        apiQuery = {
          ...apiQuery,
          ...handler({ query, queryValue, filterValues }),
        };
      } else {
        apiQuery = {
          ...apiQuery,
          ...filterValues,
        };
      }
    });

    return getCleanQuery(apiQuery);
  }
}
