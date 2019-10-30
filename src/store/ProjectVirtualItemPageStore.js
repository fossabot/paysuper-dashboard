import axios from 'axios';
import assert from 'simple-assert';

export default function createProjectVirtualItemPageStore() {
  return {
    state: {
      virtualItem: null,
      itemId: null,
    },

    mutations: {
      projectId(store, data) {
        store.projectId = data;
      },
      itemId(state, data) {
        state.itemId = data;
      },
      setVirtualItem(state, data) {
        state.virtualItem = data;
      },
    },

    actions: {
      async initState({ dispatch, commit }, { projectId, itemId }) {
        assert(projectId, 'ProjectVirtualItemsStore requires projectId param');
        commit('projectId', projectId);
        commit('itemId', itemId);
        if (itemId !== 'new') {
          await dispatch('fetchItemData', itemId);
        }
      },

      async fetchItemData({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/products/${id}`);
        commit('setVirtualItem', response.data.item);
      },

      /**
       * Edit Virtual item
       * @param rootState
       * @param commit
       * @param data {Object}
       * @param projectId {String}
       * @returns {Promise<void>}
       */
      async editItem({ rootState, commit }, { data, projectId }) {
        const response = await axios.put(`${rootState.config.apiUrl}/admin/api/v1/products/${data.id}`, {
          ...data,
          project_id: projectId,
        });
        commit('setVirtualItem', response.data);
      },

      /**
       * Create new Virtual item
       * @param rootState
       * @param data {Object}
       * @param projectId {String}
       * @returns {Promise<void>}
       */
      async createItem({ rootState }, { data, projectId }) {
        await axios.post(`${rootState.config.apiUrl}/admin/api/v1/products`, {
          ...data,
          project_id: projectId,
        });
      },

      /**
       * Return the converted prices
       * @param rootState
       * @param amount
       * @returns {Promise<*>}
       */
      async getPrices({ rootState }, { amount, currency }) {
        const path = `/api/v1/pricing/recommended/conversion?amount=${amount}&currency=${currency}`;
        const response = await axios.get(`${rootState.config.apiUrl}${path}`);
        return response.data.recommended_price;
      },
    },

    namespaced: true,
  };
}
