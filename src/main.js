import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import * as Sentry from '@sentry/browser';

import './plugins/vue-datepicker';
import './plugins/vue-select';
import './plugins/vue-toasted';
import './plugins/vuelidate';
import './plugins/misc';
import extendAxios from './plugins/extendAxios';
import i18n from './plugins/i18n';
import router from './router';
import store from './store/RootStore';
import './globalComponents';
import AppView from './App.vue';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://784314fe11d44fb0872d0044a28339a3@sentry.io/1796353',
    integrations: [new Sentry.Integrations.Vue({ Vue, attachProps: true })],
    environment: process.env.VUE_APP_BUILD_PURPOSE,
  });
}

Vue.use(VueRouter);
Vue.use(Vuex);
sync(store, router);
extendAxios(store);

new Vue(
  {
    i18n,
    router,
    store,
    data: {},
    render: h => h(AppView),
  },
).$mount('#app');
