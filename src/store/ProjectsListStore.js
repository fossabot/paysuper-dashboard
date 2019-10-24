import axios from 'axios';
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import projectsListScheme from '@/schemes/projectsListScheme';

const searchBuilder = new SearchBuilder(projectsListScheme);

export default function createProjectsListStore() {
  return {
    state: {
      projects: {},
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
      projects(store, data) {
        store.projects = data;
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
      initState({ dispatch }, { query }) {
        return dispatch('initQuery', query);
      },

      async initQuery({ commit, dispatch }, query) {
        commit('query', query);

        const apiQuery = searchBuilder.getApiQueryFromQuery(query);
        commit('apiQuery', apiQuery);

        const filterValues = searchBuilder.getEmptyFilterValues();
        commit('filterValues', filterValues);

        await dispatch('fetchProjects');
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

      async fetchProjects({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
          merchant_id: rootState.User.Merchant.merchant.id,
        }, { arrayFormat: 'brackets' });

        const { data } = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/projects?${query}`);
        commit('projects', data);
      },

      async createProject({ rootState }, project) {
        const { data } = await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/projects`,
          {
            merchant_id: rootState.User.Merchant.merchant.id,
            ...project,
          },
        );
        return data.item.id;
      },

      deactivateProject({ rootState }, id) {
        return axios.delete(`${rootState.config.apiUrl}/admin/api/v1/projects/${id}`);
      },

      activateProject({ rootState }, id) {
        return axios.patch(
          `${rootState.config.apiUrl}/admin/api/v1/projects/${id}`,
          {
            status: 0,
          },
        );
      },
    },

    namespaced: true,
  };
}
