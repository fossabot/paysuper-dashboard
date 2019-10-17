import { includes, toLower } from 'lodash-es';
import axios from 'axios';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import taxesListScheme from '@/schemes/taxesListScheme';
import i18n from '@/plugins/i18n';

const searchBuilder = new SearchBuilder(taxesListScheme);

export default function createProjectsListStore() {
  return {
    state: {
      taxes: {},
      filterValues: {},
      query: {},
    },

    getters: {
      taxesFiltered(state) {
        return state.taxes.filter((item) => {
          if (!state.filterValues.quickFilter) {
            return true;
          }

          return includes(
            toLower(item.countryName),
            toLower(state.filterValues.quickFilter),
          );
        });
      },
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
      taxes(store, data) {
        store.taxes = data.map(item => ({
          ...item,
          countryName: i18n.t(`countries.${item.country}`),
        }));
      },
      filterValues(store, value) {
        store.filterValues = value;
      },
      query(store, value) {
        store.query = value;
      },
    },

    actions: {
      initState({ dispatch }, { query }) {
        return dispatch('initQuery', query);
      },

      async initQuery({ commit, dispatch }, query) {
        commit('query', query);

        const filterValues = searchBuilder.getEmptyFilterValues();
        commit('filterValues', filterValues);

        await dispatch('fetchTaxes');
      },

      submitFilters({ state, commit }, filters) {
        const newFilters = {
          ...state.filterValues,
          ...filters,
        };
        commit('filterValues', newFilters);

        const query = searchBuilder.getQueryFromFilterValues(newFilters);
        commit('query', query);
      },

      async fetchTaxes({ commit, rootState }) {
        const { data } = await axios.get(`${rootState.config.apiUrl}/system/api/v1/vat_reports`);
        commit('taxes', data.items);
      },
    },

    namespaced: true,
  };
}
