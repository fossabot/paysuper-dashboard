import axios from 'axios';

export default function createPayoutPageStore() {
  return {
    state: {
      payout: null,
      payoutId: null,
      refunds: null,
    },

    mutations: {
      payoutId(state, data) {
        state.payoutId = data;
      },
      setPayout(state, data) {
        state.payout = data;
      },
      refund(state, data) {
        state.refunds = data;
      },
    },

    actions: {
      async initState({ dispatch, commit }, { payoutId }) {
        commit('payoutId', payoutId);
        await dispatch('fetchPayoutData', payoutId);
      },

      async fetchPayoutData({ commit, rootState }, id) {
        const response = await axios
          .get(`${rootState.config.apiUrl}/admin/api/v1/payout_documents/${id}`);
        commit('setPayout', response.data);
      },
    },

    namespaced: true,
  };
}
