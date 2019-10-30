import axios from 'axios';
import MerchantStore from '@/store/MerchantStore';
import UserNotificationsStore from './UserNotificationsStore';
import UserProfileStore from './UserProfileStore';
import { UNAUTHORIZED } from '@/errors';

export default function createUserStore(resources) {
  const accessToken = localStorage.getItem('token') || '';
  return {
    state: {
      accessToken,
      isAuthorised: false,
      isEmailConfirmed: false,
      role: localStorage.getItem('userRole') || 'merchant',
    },

    mutations: {
      accessToken(state, value) {
        state.accessToken = value;
      },
      isAuthorised(state, value) {
        state.isAuthorised = value;
      },
      isEmailConfirmed(state, value) {
        state.isEmailConfirmed = value;
      },
      role(state, value) {
        state.role = value;
        localStorage.setItem('userRole', value);
      },
    },

    getters: {
      authIframeSrc(state, getters, rootState) {
        return `${rootState.config.ownBackendUrl}/auth1/login`;
      },
    },

    actions: {
      async initState({ state, commit, dispatch }) {
        try {
          if (!state.accessToken) {
            await dispatch('refreshToken');
          }
          await Promise.all([
            dispatch('initUserMerchantData'),
            dispatch('Profile/initState'),
          ]);
          if (state.Profile.profile.email.confirmed) {
            commit('isEmailConfirmed', true);
          }

          dispatch('Notifications/initState');
        } catch (error) {
          if (error !== UNAUTHORIZED) {
            console.error(error);
          }
        }
      },

      async initUserMerchantData({ commit, dispatch }) {
        await dispatch('Merchant/fetchMerchant');
        commit('isAuthorised', true);
      },

      /**
       * Set new access token to store and localeStorage
       * @param commit
       * @param token
       */
      setAccessToken({ commit }, token) {
        localStorage.setItem('token', token);
        commit('isAuthorised', true);
        commit('accessToken', token);
      },

      setEmailConfirmed({ commit }, value) {
        commit('isEmailConfirmed', value);
      },

      /**
       * Refresh expired token
       * @param commit
       * @param state
       * @param dispatch
       * @returns {Promise.<T>|Promise<any>|Promise}
       */
      async refreshToken({ dispatch, rootState }) {
        try {
          const response = await axios.get(`${rootState.config.ownBackendUrl}/auth1/refresh`, {
            // this method requires only cookies for authrization
            withCredentials: true,
          });
          await dispatch('setAccessToken', response.data.access_token);
        } catch (error) {
          // logout is required in case when we can't get new token (refresh failed),
          // but auth form thinks we're still logged (because of cookies)
          // In that case auth form won't show itself until we clear the cookies
          await dispatch('logout');
          throw error;
        }
      },

      async logout({ commit, dispatch, rootState }) {
        try {
          await axios.get(`${rootState.config.ownBackendUrl}/auth1/logout`, {
            withCredentials: true,
          });
          // eslint-disable-next-line
        } catch { }
        localStorage.removeItem('token');
        commit('isAuthorised', false);
        commit('isEmailConfirmed', false);
        commit('accessToken', '');
        dispatch('Profile/setCurrentStepCode');
      },
    },

    namespaced: true,

    modules: {
      Merchant: MerchantStore(resources),
      Notifications: UserNotificationsStore(resources),
      Profile: UserProfileStore(resources),
    },
  };
}
