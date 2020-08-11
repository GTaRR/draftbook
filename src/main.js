import Vue from 'vue';
import App from './App.vue';

import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use(CKEditor);

import { ModalPlugin, VBTooltipPlugin, ToastPlugin } from 'bootstrap-vue';
Vue.use(ModalPlugin);
Vue.use(VBTooltipPlugin);
Vue.use(ToastPlugin);

import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/mode/xml/xml.js';
require('codemirror/addon/display/autorefresh.js');
Vue.use(VueCodemirror);

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faPlus,
  faCog,
  faMoon,
  faDownload,
  faUpload,
  faThumbtack,
  faSave,
  faClipboard,
  faBars,
  faGripVertical,
  faSort,
  faGripLinesVertical,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faTimes,
  faPlus,
  faCog,
  faMoon,
  faDownload,
  faUpload,
  faThumbtack,
  faSave,
  faClipboard,
  faBars,
  faGripVertical,
  faSort,
  faGripLinesVertical,
  faEllipsisV
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import moment from 'moment';
require('moment/locale/ru');

import { store } from './store';

import './sass/main.sass';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'), { moment });

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
