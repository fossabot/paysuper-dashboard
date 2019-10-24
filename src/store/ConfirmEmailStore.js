
import axios from 'axios';
import router from '@/router';

export default function createUserStore() {
  return {

    actions: {
      initState({ dispatch }, token) {
        return dispatch('confirmEmail', token);
      },

      async confirmEmail({ rootState }, token) {
        await axios.put(
          `${rootState.config.apiUrl}/user/confirm_email`,
          {
            token,
          },
        );
      },

      redirectToDashboard() {
        router.push({ path: '/dashboard' });
      },
    },

    namespaced: true,
  };
}
