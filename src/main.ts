import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

const isDevelopment = process.env.NODE_ENV !== 'production';

Vue.config.productionTip = false;
Vue.config.devtools = isDevelopment;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
