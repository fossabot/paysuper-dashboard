import axios from 'axios';
import { camelCase, reduce, snakeCase } from 'lodash-es';
// TODO: it will be service, and must be located in DictionariesStore
import citiesByCountry from '@/citiesByCountry.json';

export default function createAccountInfoStore() {
  return {
    namespaced: true,
    state: {
      accountInfo: {
        address: '',
        address_additional: '',
        alternative_name: '',
        city: '',
        country: '',
        name: '',
        registration_number: '',
        state: '',
        tax_id: '',
        website: '',
        zip: '',
      },
    },
    getters: {
      accountInfo(state) {
        const { accountInfo } = state;

        return reduce(accountInfo, (res, item, key) => ({
          ...res,
          [camelCase(key)]: item,
        }), {});
      },
      cities(state) {
        const currentCountry = state.accountInfo.country || 'US';

        return citiesByCountry[currentCountry] || [];
      },
    },
    mutations: {
      accountInfo(state, data) {
        state.accountInfo = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { company } = rootState.User.Merchant.merchant;

        if (company) {
          commit('accountInfo', company);
        }
      },
      async submitAccountInfo({ dispatch, state, rootState }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/company`,
          { ...state.accountInfo },
        );

        if (response.data) {
          dispatch('User/Merchant/changeMerchant', response.data, { root: true });
          dispatch('User/Merchant/completeStep', 'company', { root: true });
          dispatch('User/Notifications/watchForNotifications', null, { root: true });
          return true;
        }

        return false;
      },
      updateAccountInfo({ commit }, accountInfo) {
        commit('accountInfo', reduce(accountInfo, (res, item, key) => ({
          ...res,
          [snakeCase(key)]: item,
        }), {}));
      },
    },
  };
}
