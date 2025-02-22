import axios from 'axios';

function mapDataApiToForm(data) {
  return data;
}

export default function createPaymentMethodStore() {
  return {
    state: () => ({
      merchantId: null,
      paymentMethodId: null,
      paymentMethod: null,
    }),

    mutations: {
      merchantId(store, data) {
        store.merchantId = data;
      },
      paymentMethodId(store, data) {
        store.paymentMethodId = data;
      },
      paymentMethod(store, data) {
        store.paymentMethod = data;
      },
    },

    actions: {
      initState({ commit, dispatch }, { merchantId, paymentMethodId }) {
        commit('merchantId', merchantId);
        commit('paymentMethodId', paymentMethodId);
        return dispatch('fetchPaymentMethod');
      },

      fetchPaymentMethod({
        state, commit, dispatch, rootState,
      }) {
        return axios.get(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchantId}/methods/${state.paymentMethodId}`,
        ).then((response) => {
          commit('paymentMethod', mapDataApiToForm(response.data));
        }).catch((error) => {
          dispatch('setPageError', error, { root: true });
        });
      },

      async updatePaymentMethod({
        state, commit, rootState,
      }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchantId}/methods/${state.paymentMethodId}`,
          state.paymentMethod,
        );
        commit('paymentMethod', response.data);
      },
    },

    namespaced: true,
  };
}
