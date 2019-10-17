import axios from 'axios';
import qs from 'qs';
import { get } from 'lodash-es';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import merchantsListScheme from '@/schemes/merchantsListScheme';

const searchBuilder = new SearchBuilder(merchantsListScheme);

export default function createMerchantListStore() {
  return {
    state: () => ({
      merchants: {
        items: [],
        count: 0,
      },
      filterValues: {},
      query: {},
      apiQuery: {},
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
      merchants(store, data) {
        store.merchants = data;
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
    },

    actions: {
      async initState({ getters, dispatch }, { query }) {
        const filters = getters.getFilterValues();
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchMerchants');
      },

      async fetchMerchants({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/system/api/v1/merchants?${query}`;

        const response = await axios.get(url);
        const merchants = get(response, 'data.items') ? response.data : {
          items: [],
          count: 0,
        };

        // append mode for infinite scroll
        if (state.apiQuery.offset > 0 && merchants.count === state.merchants.count) {
          merchants.items = [
            ...state.merchants.items,
            ...merchants.items,
          ];
        }
        commit('merchants', merchants);
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

      async sendNotification({ rootState }, { merchantId, notification }) {
        await axios.post(
          `${rootState.config.apiUrl}/system/api/v1/merchants/${merchantId}/notifications`,
          notification,
        );
      },
    },

    namespaced: true,
  };
}
