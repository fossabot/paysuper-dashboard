import cookieParser from 'cookieparser';
import cookie from 'js-cookie';
import api from '@/api/auth';

export default {
  state: () => ({
    user: null,
  }),

  getters: {
    getUser: state => state.user || null,
  },

  mutations: {
    setUser(store, data) {
      store.user = data;
    },
    resetUser(store) {
      store.user = null;
    },
  },

  actions: {
    async nuxtServerInit({ commit, dispatch }, { req, res }) {
      let accessToken = null;

      if (!req.headers.cookie) {
        return;
      }

      const parsed = cookieParser.parse(req.headers.cookie);

      const data = {
        email: 'unknown',
      };

      if (parsed.PP_EML_V) {
        data.email = parsed.PP_EML_V;
      }

      if (!parsed.PP_ACC_T) {
        accessToken = await dispatch('refresh', { req, res });
      } else {
        accessToken = {
          value: parsed.PP_ACC_T,
          exp: parsed.PP_ACC_E,
        };
      }

      if (accessToken == null) {
        return;
      }

      data.accessToken = accessToken.value;
      data.expire = accessToken.exp;

      commit('setUser', data);

      await dispatch('merchant/get');
    },
    login({ commit }, data) {
      return api.login(data)
        .then((response) => {
          const uData = {
            accessToken: response.data.accessToken.value,
            expire: response.data.accessToken.exp * 1000,
            email: data.email,
          };

          commit('setUser', uData);
          return response;
        });
    },
    register({ commit }, data) {
      return api.register(data)
        .then((response) => {
          const uData = {
            accessToken: response.data.accessToken.value,
            expire: response.data.accessToken.exp * 1000,
            email: data.email,
          };

          commit('setUser', uData);
          return response;
        });
    },
    reset({ commit }) {
      commit('resetUser');
      return Promise.resolve();
    },
    async refresh({ commit }, { req, res }) {
      const parsed = cookieParser.parse(req.headers.cookie);

      if (!parsed.PP_RER_T) {
        return null;
      }

      let response;

      try {
        response = await api.refresh(parsed.PP_RER_T);
      } catch (e) {
        if (process.server) {
          const past = new Date();
          past.setTime(past.getTime() - 1000);

          res.setHeader(
            'Set-Cookie',
            [
              `PP_ACC_T=;expires=${past.toUTCString()}`,
              `PP_ACC_E=;expires=${past.toUTCString()}`,
              `PP_RER_T=;expires=${past.toUTCString()}`,
              `PP_EML_V=;expires=${past.toUTCString()}`,
            ],
          );
        } else {
          cookie.remove('PP_ACC_T');
          cookie.remove('PP_ACC_E');
          cookie.remove('PP_RER_T');
          cookie.remove('PP_EML_V');
        }

        return null;
      }

      if (!response.data || !response.data.accessToken
        || !response.data.refreshToken) {
        return null;
      }

      for (const key in response.data) {
        if (!response.data[key]) {
          continue;
        }

        response.data[key].exp = response.data[key].exp * 1000;
      }

      const expireAccessToken = new Date();
      const expireRefreshToken = new Date();

      expireAccessToken.setTime(response.data.accessToken.exp);
      expireRefreshToken.setTime(response.data.refreshToken.exp);

      if (process.server) {
        res.setHeader(
          'Set-Cookie',
          [
            `PP_ACC_T=${response.data.accessToken.value};expires=${expireAccessToken.toUTCString()}`,
            `PP_ACC_E=${response.data.accessToken.exp};expires=${expireAccessToken.toUTCString()}`,
            `PP_RER_T=${response.data.refreshToken.value};expires=${expireRefreshToken.toUTCString()}`,
          ],
        );
      } else {
        cookie.set('PP_ACC_T', response.data.accessToken.value, { expires: expireAccessToken });
        cookie.set('PP_ACC_E', response.data.accessToken.exp, { expires: expireAccessToken });
        cookie.set('PP_RER_T', response.data.refreshToken.value, { expires: expireRefreshToken });
      }

      return response.data.accessToken;
    },
  },
};
