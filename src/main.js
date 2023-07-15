import { createApp } from 'vue';
import { createPinia } from 'pinia';
import CKEditor from '@ckeditor/ckeditor5-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { VTooltip } from 'floating-vue';
import App from './App.vue';

import 'floating-vue/dist/style.css';
import './sass/main.scss';

library.add(fas);

const pinia = createPinia();
const app = createApp(App);

app.component('FontAwesomeIcon', FontAwesomeIcon);
app.directive('tooltip', VTooltip);
app.use(CKEditor);
app.use(pinia);
app.mount('#app');
