import Vue from 'vue';
import App from './App.vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import BootstrapVue from 'bootstrap-vue';

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/3024-day.css'
import 'codemirror/mode/xml/xml.js'

import moment from 'moment';
require('moment/locale/ru');

import {store} from './store'

import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import './sass/main.sass';

Vue.config.productionTip = false;

Vue.use( CKEditor );
Vue.use( BootstrapVue );
Vue.use(require('vue-moment'), {
  moment
});
Vue.use( VueCodemirror );

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
