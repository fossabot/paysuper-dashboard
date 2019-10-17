import axios from 'axios';
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import taxesByPeriod from '@/schemes/taxesByPeriod';

const searchBuilder = new SearchBuilder(taxesByPeriod);

export default function createProjectsListStore() {
  return {
    state: {
      periodId: '',
      periodTaxes: {},
      filterValues: {},
      query: {},
      apiQuery: {},
    },

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
      periodId(store, value) {
        store.periodId = value;
      },
      periodTaxes(store, value) {
        store.periodTaxes = value;
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
      initState({ commit, dispatch }, { query, id }) {
        commit('periodId', id);
        return dispatch('initQuery', query);
      },

      async initQuery({ commit, dispatch }, query) {
        commit('query', query);

        const apiQuery = searchBuilder.getApiQueryFromQuery(query);
        commit('apiQuery', apiQuery);

        const filterValues = searchBuilder.getEmptyFilterValues();
        commit('filterValues', filterValues);

        await dispatch('fetchPeriodTaxes');
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

      async fetchPeriodTaxes({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
        }, { arrayFormat: 'brackets' });

        const { data } = await axios.get(
          `${rootState.config.apiUrl}/system/api/v1/vat_reports/details/${state.periodId}?${query}`,
        );
        commit('periodTaxes', data);
      },
    },

    namespaced: true,
  };
}
