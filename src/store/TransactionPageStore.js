import axios from 'axios';

export default function createTransactionPageStore() {
  return {
    state: {
      transaction: null,
      transactionId: null,
      refunds: null,
    },

    mutations: {
      transactionId(state, data) {
        state.transactionId = data;
      },
      setTransaction(state, data) {
        state.transaction = data;
      },
      refund(state, data) {
        state.refunds = data;
      },
    },

    actions: {
      async initState({ dispatch, commit }, { transactionId }) {
        commit('transactionId', transactionId);
        await dispatch('fetchTransactionData', transactionId);
        await dispatch('isRefund');
      },

      async fetchTransactionData({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/order/${id}`);
        commit('setTransaction', response.data);
      },

      async isRefund({ rootState, state, commit }) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/order/${state.transaction.uuid}/refunds`);
        commit('refund', response.data);
      },

      async refund({ rootState, commit }, { transaction, reason }) {
        const data = {
          reason,
          creator_id: rootState.User.Merchant.merchant.id,
          amount: transaction.total_payment_amount,
        };
        const response = await axios.post(`${rootState.config.apiUrl}/admin/api/v1/order/${transaction.uuid}/refunds`, data);
        if (response.data) {
          commit('refund', { items: response.data });
        }
      },
    },

    namespaced: true,
  };
}
