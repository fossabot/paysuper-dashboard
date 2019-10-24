import axios from 'axios';
import { trim } from 'lodash-es';

export default function createContactsStore() {
  return {
    namespaced: true,
    state: {
      contacts: {
        authorized: {
          name: '',
          email: '',
          phone: '',
          position: '',
        },
        technical: {
          name: '',
          email: '',
          phone: '',
        },
      },
    },
    mutations: {
      contacts(state, data) {
        state.contacts = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { contacts } = rootState.User.Merchant.merchant;

        if (contacts) {
          commit('contacts', contacts);
        }
      },
      async submitContacts({ dispatch, state, rootState }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/contacts`,
          { ...state.contacts },
        );

        if (response.data) {
          dispatch('User/Merchant/changeMerchant', response.data, { root: true });
          dispatch('User/Merchant/completeStep', 'contacts', { root: true });
          dispatch('User/Notifications/watchForNotifications', null, { root: true });
          return true;
        }

        return false;
      },
      updateContacts({ commit }, contacts) {
        const authName = trim(contacts.authorized.name) || '';
        const techName = trim(contacts.technical.name) || '';

        commit('contacts', {
          authorized: {
            ...contacts.authorized,
            name: authName || '',
          },
          technical: {
            ...contacts.technical,
            name: techName || '',
          },
        });
      },
    },
  };
}
