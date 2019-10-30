import axios from 'axios';

export default function createReportCardStore() {
  return {
    state: {
      report: null,
      reportId: null,
      transactionsList: {
        items: [],
        count: 0,
      },
    },

    mutations: {
      reportId(state, data) {
        state.transactionId = data;
      },
      setReport(state, data) {
        state.report = data;
      },
      transactionsList(store, data) {
        store.transactionsList = data;
      },
    },

    actions: {
      async initState({ dispatch, commit }, { reportId }) {
        commit('reportId', reportId);
        await dispatch('fetchReportData', reportId);
      },

      async fetchReportData({ commit, rootState, dispatch }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${id}`);
        commit('setReport', response.data);

        dispatch('fetchTransactions', id);
      },

      async acceptReport({ rootState, state, dispatch }) {
        const reportId = state.report.id;
        const response = await axios.post(`${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${reportId}/accept`);
        if (response) {
          dispatch('fetchReportData', reportId);
        }
      },

      async dispute({ rootState, state, dispatch }, { reason }) {
        const reportId = state.report.id;
        const response = await axios.post(`${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${reportId}/decline`, { dispute_reason: reason });
        if (response) {
          await dispatch('fetchReportData', reportId);
        }
      },

      async fetchTransactions({ commit, rootState }, id) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${id}/transactions`;
        const response = await axios.get(url);
        const transactionsList = {
          ...response.data,
          items: response.data.items || [],
        };
        commit('transactionsList', transactionsList);
      },
    },

    namespaced: true,
  };
}
