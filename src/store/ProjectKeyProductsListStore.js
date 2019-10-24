import axios from 'axios';
import qs from 'qs';
import assert from 'simple-assert';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import projectKeyProductsScheme from '@/schemes/projectKeyProductsScheme';

const searchBuilder = new SearchBuilder(projectKeyProductsScheme);

export default function createProjectKeyProductsListStore() {
  return {
    state: {
      gameKeys: {
        products: [],
        count: 0,
      },
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
      projectId(store, data) {
        store.projectId = data;
      },
      gameKeys(store, data) {
        store.gameKeys = data;
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
      async initState({ getters, dispatch, commit }, { projectId, query }) {
        assert(projectId, 'ProjectKeyProductsListStore requires projectId param');
        const filters = getters.getFilterValues();
        commit('projectId', projectId);
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchKeyProducts');
      },

      async fetchKeyProducts({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
          project_id: state.projectId,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/key-products?${query}`;

        const response = await axios.get(url);
        const gameKeys = {
          ...response.data,
          products: response.data.products || [],
        };
        // append mode for infinite scroll
        if (state.apiQuery.offset > 0 && gameKeys.count === state.gameKeys.count) {
          gameKeys.products = [
            ...state.gameKeys.products,
            ...gameKeys.products,
          ];
        }
        commit('gameKeys', gameKeys);
      },

      async deleteKeyProduct({ rootState }, id) {
        await axios.delete(
          `${rootState.config.apiUrl}/admin/api/v1/key-products/${id}`,
        );
      },

      async toggleKeyProductEnabled({ rootState }, keyProduct) {
        const action = keyProduct.enabled ? 'unpublish' : 'publish';
        await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/key-products/${keyProduct.id}/${action}`,
        );
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
    },

    namespaced: true,
  };
}
