import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { get, union } from 'lodash-es';

import resources from '@/resources';
import DictionariesStore from './DictionariesStore';
import LeaveFeedbackStore from './LeaveFeedbackStore';
import UserStore from './UserStore';
import ExportFile from './ExportFileStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {},
    isLoading: false,
    pageError: null,
    initedParts: [],
  },
  mutations: {
    isLoading(state, value) {
      state.isLoading = value;
    },
    pageError(state, value) {
      state.pageError = value;
    },
    config(state, value) {
      state.config = value;
    },
    initedParts(state, value) {
      state.initedParts = union(state.initedParts, value);
    },
  },
  getters: {
    checkIfNeedToInitPart(state) {
      return (partName, initConfig) => {
        if (
          initConfig.includes(partName)
          && !state.initedParts.includes(partName)
        ) {
          return true;
        }
        return false;
      };
    },
  },
  actions: {
    async initState(
      { getters, dispatch, commit },
      initConfig = ['config', 'dictionaries', 'user'],
    ) {
      const parallelInit = [];
      if (!initConfig) {
        return;
      }
      if (getters.checkIfNeedToInitPart('config', initConfig)) {
        await dispatch('fetchConfig');
      }
      if (getters.checkIfNeedToInitPart('dictionaries', initConfig)) {
        parallelInit.push(dispatch('Dictionaries/initState'));
      }
      if (getters.checkIfNeedToInitPart('user', initConfig)) {
        parallelInit.push(dispatch('User/initState'));
      }
      await Promise.all(parallelInit);
      commit('initedParts', initConfig);
    },

    /**
     * Wtf? Because in production there is a need to pass env-variables
     * AFTER building phase - when the app is actually starting
     * So the variables are passed through local node-backend
     * In local development the backend is running on another port so we're
     * duplicating the service through vue.config.js
     */
    async fetchConfig({ commit }) {
      const { data } = await axios.get('/conf', {});
      commit('config', data);
    },

    setIsLoading({ commit }, value) {
      commit('isLoading', value);
    },

    setPageError({ commit }, error) {
      if (!error) {
        commit('pageError', null);
        return;
      }

      if (typeof error === 'number') {
        commit('pageError', error);
      } else {
        const errorCode = get(error, 'response.status', 520);
        commit('pageError', errorCode);
        console.error(error);
      }
    },

    async uploadImage(ctx, imagefile) {
      const formData = new FormData();
      formData.append('file', imagefile);
      const { data } = await axios.post('{ownBackendUrl}/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  },

  modules: {
    Dictionaries: DictionariesStore(resources),
    LeaveFeedback: LeaveFeedbackStore(resources),
    User: UserStore(resources),
    ExportFile: ExportFile(resources),
  },
});
