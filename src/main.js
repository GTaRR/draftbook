import Vue from 'vue';
import App from './App.vue';

import CKEditor from '@ckeditor/ckeditor5-vue2';
Vue.use(CKEditor);

import { ModalPlugin, VBTooltipPlugin, ToastPlugin } from 'bootstrap-vue';
Vue.use(ModalPlugin);
Vue.use(VBTooltipPlugin);
Vue.use(ToastPlugin);

import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/display/autorefresh.js';
Vue.use(VueCodemirror);

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import moment from 'moment';
require('moment/locale/ru');

import './sass/main.sass';

import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.config.productionTip = false;

Vue.use(require('vue-moment'), { moment });

new Vue({
  render: h => h(App),
  pinia,
}).$mount('#app');
