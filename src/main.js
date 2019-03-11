import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';

import './plugins/bootstrap';
import './plugins/vue-datepicker';
import './plugins/vue-select';
import i18n from './plugins/i18n';
import router from './router';
import store from './store/RootStore';
import './globalComponents';
import AppView from './App.vue';

Vue.use(VueRouter);
Vue.use(Vuex);
sync(store, router);

new Vue(
  {
    i18n,
    router,
    store,
    data: {},
    render: h => h(AppView),
  },
).$mount('#app');
