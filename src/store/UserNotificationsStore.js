
import axios from 'axios';
import Centrifuge from 'centrifuge';
import getUnixTime from 'date-fns/getUnixTime';

export default function createUserNotificationsStore() {
  return {
    state: {
      isWatchingInited: false,
      notifications: [],
    },
    mutations: {
      isWatchingInited(state, value) {
        state.isWatchingInited = value;
      },
      notifications(state, value) {
        state.notifications = value;
      },
    },
    actions: {
      async initState({ dispatch, rootState }) {
        if (rootState.User.Merchant.merchant && rootState.User.Merchant.merchant.id) {
          await dispatch('fetchNotifications');
          dispatch('watchForNotifications');
        }
      },

      async fetchNotifications({ commit, rootState }) {
        const { id } = rootState.User.Merchant.merchant;
        try {
          const { data } = await axios.get(
            `{apiUrl}/admin/api/v1/merchants/${id}/notifications?sort[]=-created_at`,
          );
          commit('notifications', data.items || []);
        } catch (error) {
          console.error(error);
        }
      },

      async markNotificationAsReaded({ state, commit, rootState }, notificationId) {
        const { id } = rootState.User.Merchant.merchant;
        try {
          const { data } = await axios.put(
            `{apiUrl}/admin/api/v1/merchants/${id}/notifications/${notificationId}/mark-as-read`,
          );
          const newNotifications = state.notifications.map((item) => {
            if (item.id === data.id) {
              return data;
            }
            return item;
          });
          commit('notifications', newNotifications);
        } catch (error) {
          console.error(error);
        }
      },

      watchForNotifications({ state, commit, rootState }) {
        if (state.isWatchingInited) {
          return;
        }
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        const { merchant } = rootState.User.Merchant;

        centrifuge.setToken(merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:merchant#${merchant.id}`, async ({ data }) => {
          commit('notifications', [
            {
              ...data,
              created_at: data.created_at || {
                seconds: getUnixTime(new Date()),
              },
            },
            ...state.notifications,
          ]);
        });
        centrifuge.connect();
        commit('isWatchingInited', true);
      },
    },

    namespaced: true,
  };
}
