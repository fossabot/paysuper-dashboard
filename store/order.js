import axios from 'axios';
import qs from 'qs';
import { map, isEmpty } from 'lodash-es';

import SearchBuilder from '@/store/SearchBuilder';
import transactionsFiltersScheme from '@/store/transactionsFiltersScheme';

const searchBuilder = new SearchBuilder(transactionsFiltersScheme);


export default {
  state: () => ({
    transactions: {
      items: [],
      count: 0,
    },
    filterValues: {},
    query: {},
    apiQuery: {},
    paymentMethods: [
      { label: 'test', id: '111' }, { label: 'test2', id: '222' },
    ],
    projects: [],
    statuses: [
      { label: 'New', id: '0' },
      { label: 'In payment', id: '1' },
      { label: 'Error', id: '2,3' },
      { label: 'Paid', id: '4' },
      { label: 'In progress', id: '5' },
      { label: 'Completed', id: '6' },
      { label: 'Pending', id: '7' },
      { label: 'Refund', id: '8,9' },
      { label: 'Chargeback', id: '10' },
      { label: 'Declined', id: '11' },
      { label: 'Canceled', id: '12' },
    ],
  }),

  getters: {
    items(state) {
      return state.transactions.items;
    },

    count(state) {
      return state.transactions.count;
    },

    getFilterValues(state) {
      return filterNames => searchBuilder.getFilterValues({
        filterNames,
        query: state.query,
        dictionaries: {
          paymentMethods: state.paymentMethods,
          projects: state.projects,
          statuses: state.statuses,
        },
      });
    },

    getEmptyFilterValues() {
      return filterNames => searchBuilder.getEmptyFilterValues({
        filterNames,
      });
    },
  },

  mutations: {
    transactions(store, value) {
      store.transactions = value;
    },
    filterValues(store, value) {
      store.filterValues = value;
    },
    query(store, value) {
      store.query = value;
    },
    apiQuery(store, value) {
      store.apiQuery = value;
    },
    paymentMethods(store, value) {
      store.paymentMethods = value;
    },
    projects(store, value) {
      store.projects = value;
    },
  },

  actions: {
    async initState({ dispatch }, { query }) {
      await Promise.all([
        dispatch('initQuery', query),
        dispatch('fetchPaymentMethods'),
        dispatch('fetchProjects'),
      ]);
    },

    async initQuery({ commit, dispatch }, query) {
      commit('query', query);

      const apiQuery = searchBuilder.getApiQueryFromQuery(query);
      commit('apiQuery', apiQuery);

      const filterValues = searchBuilder.getEmptyFilterValues();
      commit('filterValues', filterValues);

      await dispatch('searchTransactions');
    },

    async searchTransactions({
      state, commit, rootState,
    }) {
      let url = `${process.env.apiServerUrl}/api/v1/s/order`;

      const params = {
        ...state.apiQuery,
      };

      url += `?${qs.stringify(params)}`;

      await axios.get(url, { headers: { Authorization: `Bearer ${rootState.user.accessToken}` } })
        .then((response) => {
          if (!response.data || !response.data.count || !response.data.items) {
            commit('transactions', {
              items: [],
              count: 0,
            });
            return;
          }

          commit('transactions', response.data);
        }).catch(() => {
          commit('transactions', {
            items: [],
            count: 0,
          });
        });
    },

    async fetchPaymentMethods({ commit, rootState }) {
      const url = `${process.env.apiServerUrl}/api/v1/s/payment_method/merchant`;

      await axios.get(
        url,
        { headers: { Authorization: `Bearer ${rootState.user.accessToken}` } },
      )
        .then((response) => {
          if (isEmpty(response.data)) {
            return;
          }

          const paymentMethods = map(response.data, (label, id) => ({ id, label }));
          commit('paymentMethods', paymentMethods);
        }).catch(() => {

        });
    },

    async fetchProjects({ commit, rootState }) {
      const url = `${process.env.apiServerUrl}/api/v1/s/project/filters`;

      await axios.get(
        url,
        { headers: { Authorization: `Bearer ${rootState.user.accessToken}` } },
      )
        .then((response) => {
          if (isEmpty(response.data)) {
            return;
          }
          if (!response.data) {
            return;
          }

          const projects = map(response.data, (label, id) => ({ id, label }));
          commit('projects', projects);
        })
        .catch(() => {

        });
    },

    submitFilters({ state, commit }, filters) {
      const newFilters = {
        ...state.filterValues,
        ...filters,
      };
      commit('filterValues', newFilters);

      const apiQuery = searchBuilder.getApiQueryFromFilterValues(newFilters);
      commit('apiQuery', apiQuery);

      const query = searchBuilder.getQueryFromFilterValues(newFilters);
      commit('query', query);
    },
  },
};

