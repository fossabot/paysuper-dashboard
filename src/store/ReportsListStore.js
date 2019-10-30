import axios from 'axios';
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import reportsFilterScheme from '@/schemes/reportsFilterScheme';

const searchBuilder = new SearchBuilder(reportsFilterScheme);

export default function createReportsListStore() {
  return {
    state: () => ({
      reportsList: {
        items: [],
        count: 0,
      },
      balance: {},
      filterValues: {},
      query: {},
      apiQuery: {},
      currentItem: {},
    }),

    getters: {
      getFilterValues(state) {
        return filterNames => searchBuilder.getFilterValues({
          filterNames,
          query: state.query,
          dictionaries: {},
        });
      },

      getEmptyFilterValues() {
        return filterNames => searchBuilder.getEmptyFilterValues({
          filterNames,
        });
      },
    },

    mutations: {
      reportsList(store, data) {
        store.reportsList = data;
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
      balance(store, value) {
        store.balance = value;
      },
    },

    actions: {
      async initState({ getters, dispatch }, { query }) {
        const filters = getters.getFilterValues();
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchReports');
      },

      async fetchReports({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
          merchant_id: rootState.User.Merchant.merchant.id,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/royalty_reports?${query}`;

        const response = await axios.get(url);
        const reportsList = {
          ...response.data,
          items: response.data.items || [],
        };
        // append mode for infinite scroll
        if (state.apiQuery.offset > 0 && reportsList.count === state.reportssList.count) {
          reportsList.items = [
            ...state.reportsList.items,
            ...reportsList.items,
          ];
        }
        commit('reportsList', reportsList);
      },

      async getBalance({ commit, rootState }) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/balance`;
        const response = await axios.get(url);
        const balance = response.data || 0;

        commit('balance', balance);
      },

      initQuery({ commit }, query) {
        commit('query', query);

        const apiQuery = searchBuilder.getApiQueryFromQuery(query);
        commit('apiQuery', apiQuery);
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

      async acceptReport({ rootState, dispatch }, id) {
        const response = await axios.post(`${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${id}/accept`);
        if (response) {
          await dispatch('fetchReports');
        }
      },

      async dispute({ rootState, dispatch }, { reason, id }) {
        const response = await axios.post(`${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${id}/decline`, { dispute_reason: reason });
        if (response) {
          await dispatch('fetchReports');
        }
      },
    },

    namespaced: true,
  };
}
