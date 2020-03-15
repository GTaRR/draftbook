import Vue from 'vue';
import App from './App.vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import BootstrapVue from 'bootstrap-vue';
import Clipboard from 'v-clipboard'

import moment from 'moment';
require('moment/locale/ru');

import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import './sass/main.sass';

Vue.config.productionTip = false;

Vue.use( CKEditor );
Vue.use( BootstrapVue );
Vue.use( Clipboard );
Vue.use(require('vue-moment'), {
  moment
});

new Vue({
  render: h => h(App)
}).$mount('#app');
