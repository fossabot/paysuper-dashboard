
import axios from 'axios';
import Centrifuge from 'centrifuge';

export default function createUserNotificationsStore() {
  return {
    state: {
      notifications: [],
    },
    mutations: {
      notifications(state, value) {
        state.notifications = value;
      },
    },
    actions: {
      async initState({ dispatch, rootState }) {
        if (!rootState.User.Merchant.merchant) {
          throw new Error('User.Merchant must be inited before fetching user notifications');
        }

        await dispatch('fetchNotifications');
        dispatch('initWatchForNotifications');
      },

      async fetchNotifications({ commit, rootState }) {
        const { id } = rootState.User.Merchant.merchant;
        try {
          const { data } = await axios.get(
            `{apiUrl}/admin/api/v1/merchants/${id}/notifications?sort[]=-created_at`,
          );
          commit('notifications', data.items);
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

      initWatchForNotifications({ state, commit, rootState }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        const { merchant } = rootState.User.Merchant;

        centrifuge.setToken(merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:merchant#${merchant.id}`, async ({ data }) => {
          commit('notifications', [
            ...state.notifications,
            data,
          ]);
        });
        centrifuge.connect();
      },
    },

    namespaced: true,
  };
}