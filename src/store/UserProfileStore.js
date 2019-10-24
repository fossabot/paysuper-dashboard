
import axios from 'axios';
import { get, includes } from 'lodash-es';
import Centrifuge from 'centrifuge';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

function getDefaultProfileData() {
  return {
    personal: {
      first_name: '',
      last_name: '',
      position: '',
    },
    email: {
      confirmed: false,
    },
    help: {
      product_promotion_and_development: false,
      released_game_promotion: false,
      international_sales: false,
      other: false,
    },
    company: {
      company_name: '',
      website: '',
      annual_income: null,
      number_of_employees: null,
      kind_of_activity: '',
      monetization: {
        paid_subscription: false,
        in_game_advertising: false,
        in_game_purchases: false,
        premium_access: false,
        other: false,
      },
      platforms: {
        pc_mac: false,
        game_console: false,
        mobile_device: false,
        web_browser: false,
        other: false,
      },
    },
    last_step: '',
    created_at: null,
    updated_at: null,
  };
}

export default function createUserStore() {
  return {
    state: {
      profile: null,
      currentStepCode: 'personal',
    },

    mutations: {
      profile(state, value) {
        const defaultProfile = getDefaultProfileData();
        const profile = mergeApiValuesWithDefaults(defaultProfile, value);
        state.profile = profile;
      },
      currentStepCode(state, value) {
        if (includes(['personal', 'help', 'company', 'confirmEmail'], value)) {
          state.currentStepCode = value;
        } else {
          state.currentStepCode = 'personal';
        }
      },
    },

    actions: {
      initState({ dispatch }) {
        return dispatch('fetchProfile');
      },

      async fetchProfile({ commit }) {
        try {
          const { data } = await axios.get('{apiUrl}/admin/api/v1/user/profile');
          commit('profile', data);
          if (data.last_step) {
            commit('currentStepCode', data.last_step);
          }
        } catch (error) {
          if (get(error, 'response.status') !== 404) {
            console.error(error);
          }
          commit('profile', {});
        }
      },

      async updateProfile({ rootState, commit }, props) {
        try {
          const { data } = await axios.patch(
            `${rootState.config.apiUrl}/admin/api/v1/user/profile`,
            props,
          );
          commit('profile', data);
        } catch (error) {
          console.error(error);
          throw new Error(
            get(error, 'response.data.message', 'Unknown error'),
          );
        }
      },

      setCurrentStepCode({ commit }, value) {
        commit('currentStepCode', value);
      },

      waitForEmailConfirm({ state, rootState }) {
        return new Promise((resolve) => {
          const centrifuge = new Centrifuge(rootState.config.websocketUrl);
          centrifuge.setToken(state.profile.centrifugo_token);
          centrifuge.subscribe(`paysuper:user#${state.profile.id}`, ({ data }) => {
            if (data.code === 'op000005') {
              resolve();
            }
          });
          centrifuge.connect();
        });
      },
    },

    namespaced: true,
  };
}
