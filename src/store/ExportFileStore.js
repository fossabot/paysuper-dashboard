import axios from 'axios/index';
import Centrifuge from 'centrifuge';
import { saveAs } from 'file-saver';

export default function exportFile() {
  return {
    state: {
      extension: null,
    },

    mutations: {
      extension(state, data) {
        state.extension = data;
      },
    },

    actions: {
      /**
      * Create report file
      * @param state
      * @param params {Object} - {
      *   file_type, // (csv, pdf, xlsx)
      *   report_type, //(vat, vat_transactions, royalty, royalty_transactions, payout)
      *   params: {
      *     id // (document id)
      *   }
      * }
      * @returns {Promise<void>}
      */
      async createReportFile({ rootState, commit }, params) {
        commit('extension', params.file_type);
        await axios.post('{apiUrl}/admin/api/v1/report_file', {
          ...params,
          merchant_id: rootState.User.Merchant.merchant.id,
        });
      },

      initWaitingFile({ rootState, state }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        centrifuge.setToken(rootState.User.Merchant.merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:user#${rootState.User.Merchant.merchant.id}`, ({ data }) => {
          axios.get(`{apiUrl}/admin/api/v1/report_file/download/${data.file_name}`, {
            headers: { Accept: `application/${state.extension}` },
            responseType: 'blob',
          })
            .then((response) => {
              saveAs(
                new Blob([response.data], { type: `application/${state.extension}` }),
                data.file_name,
              );
            });
        });
        centrifuge.connect();
      },
    },

    namespaced: true,
  };
}
