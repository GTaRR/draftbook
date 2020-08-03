<template>
  <div id="app">
    <app-sidebar>
      <app-header @toggleSidebar="collapse = !collapse" />

      <app-tabs ref="tabsWrapper">
        <app-tab
          v-for="(editor, key) in editors"
          :key="editor.id"
          :value="tabIndex"
          @click="$store.commit('setActiveEditor', editor.id)"
          :editor="editor"
          :active="(tabIndex === key)"
        >
          <span
            class="tab-title"
            @dblclick="focusTitle"
            v-b-tooltip="editor.name"
          >
            {{ editor.name }}
          </span>
          <span
            v-if="!collapse"
            class="tab-close"
            @click="closeTab(key)"
          >
            <i class="fas fa-times"></i>
          </span>
        </app-tab>
        <div
          @click.prevent="$store.dispatch('newTab')"
          class="tab-item tab-plus"
        >
          <i class="fas fa-plus"></i>
        </div>
      </app-tabs>

      <app-footer-panel>
        <buttons-group>
          <app-button
            v-b-tooltip="'Настройки'"
            v-if="!collapse"
            @click="$bvModal.show('settingsModal')"
          >
            <i class="fas fa-cog"></i>
          </app-button>
        </buttons-group>

        <b-button-group class="mt-auto top-border">
          <b-button
            v-b-tooltip="'Настройки'"
            variant="light"
            v-if="!collapse"
            @click="$bvModal.show('settingsModal')"
          >
            <i class="fas fa-cog"></i>
          </b-button>

          <b-form-checkbox
            title="Темная тема"
            v-b-tooltip="'Темная тема'"
            button-variant="light"
            :checked="darkMode"
            v-if="!collapse"
            @change="darkModeChange"
            button
            class="flex-fill fixed-checkbox"
          >
            <i class="fas fa-moon"></i>
          </b-form-checkbox>

          <b-button
            v-b-tooltip="'Экспорт в JSON'"
            variant="light"
            v-if="!collapse && 0"
            @click="downloadJSON"
          >
            <i class="fas fa-download"></i>
          </b-button>

          <b-button
            v-b-tooltip="'Импорт из JSON'"
            variant="light"
            v-if="!collapse && 0"
            @click="uploadJSON"
          >
            <i class="fas fa-upload"></i>
          </b-button>

          <input
            class="d-none"
            type="file"
            accept="application/json"
            ref="fileInput"
          />

          <b-form-checkbox
            title="Фиксирование сайдбара"
            v-b-tooltip="'Фиксирование сайдбара'"
            button-variant="light"
            v-model="fixedSidebar"
            button
            class="flex-fill fixed-checkbox fixed-btn"
          >
            <i class="fas fa-thumbtack"></i>
          </b-form-checkbox>
        </b-button-group>
      </app-footer-panel>
    </app-sidebar>

    <app-main>
      <title-input
        ref="titleInput"
        :value="currentEditor.name"
        class="mb-2"
        placeholder="Имя заметки"
        @input="changeEditorName"
      />

      <ckeditor
        :editor="classicEditor"
        :value="currentEditor.data"
        :config="{}"
        @input="changeEditorData"
        @focus="inFocus = true"
        @blur="inFocus = false"
      />

      <app-timers
        :editor="currentEditor"
        :currentTabTimeDiff="currentTabTimeDiff"
        :currentTabTimeWhileOpen="currentTabTimeWhileOpen"
        :currentTabTimeWhileFocus="currentTabTimeWhileFocus"
      />

      <b-modal id="settingsModal" size="xl" centered title="Настройки">
        <h4>Тема</h4>
        <hr>
        <theme-list @changeTheme="setTheme" />

        <hr>
        <h4>Цвет</h4>
        <hr>
        <color-picker v-bind="color" @input="setColor"></color-picker>

        <template v-slot:modal-footer="{ ok }">
          <b-button variant="primary" @click="ok()">
            OK
          </b-button>
        </template>
      </b-modal>

      <b-modal id="sourceViewer" size="xl" centered title="Исходный код">
        <codemirror
          ref="cmEditor"
          :value="sourceCodeEditorDataBeautify"
          :options="cmOptions"
          @ready="onCmReady"
          @input="onCmCodeChange"
        />

        <template v-slot:modal-footer="{ ok }">
          <b-button variant="primary" @click="ok()">
            <i class="fas fa-save mr-2"></i>Сохранить
          </b-button>
          <b-button variant="dark" @click="copySource" ref="copyInBufferBtn">
            <i class="fas fa-clipboard mr-2"></i>Скопировать
          </b-button>
        </template>
      </b-modal>
    </app-main>
  </div>
</template>

<script>
import Beautify from 'js-beautify';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import { mapGetters } from 'vuex';

import ClassicEditor from './ckeditor';

import AppSidebar from './components/Sidebar';
import AppHeader from './components/Header';
import AppTabs from './components/Tabs';
import AppTab from './components/Tab';
import AppFooterPanel from './components/FooterPanel';
import AppMain from './components/Main';
import TitleInput from './components/TitleInput';
import AppTimers from './components/Timers';
import ThemeList from './components/ThemeList';

import ButtonsGroup from './components/buttons/ButtonsGroup'
import AppButton from './components/buttons/AppButton'

export default {
  name: 'app',
  components: {
    ColorPicker,
    ThemeList,
    AppSidebar,
    AppHeader,
    AppTabs,
    AppTab,
    AppFooterPanel,
    AppMain,
    TitleInput,
    AppTimers,
    ButtonsGroup,
    AppButton,
  },
  data(){
    return {
      classicEditor: ClassicEditor,

      // options
      fixedSidebar: true,
      collapse: false,

      // import/export data
      jsonFile: null,

      // timers
      interval: null,
      inFocus: false,
      currentTabTimeDiff: '',
      currentTabTimeWhileOpen: '',
      currentTabTimeWhileFocus: '',

      // source editor
      sourceCodeEditorDataBeautify: '',
      sourceCodeEditorData: '',
      cmOptions: {
        tabSize: 2,
        mode: 'xml',
        htmlMode: true,
        matchClosing: true,
        theme: '3024-day',
        lineNumbers: true,
        line: true,
        lineWrapping: false,
        autofocus: true,
      },
    }
  },
  computed: {
    ...mapGetters([
      // editors
      'editors',
      'tabIndex',
      'activeEditor',

      // theme
      'color',
      'darkMode',
      'coloredMode',
      'customColor',
      'theme',
      'themes'
    ]),
    currentEditor() {
      return this.editors[this.tabIndex];
    }
  },
  created: function(){
    this.$store.commit('loadEditors');
  },
  mounted(){
    let vm = this;

    this.interval = setInterval(() => {
      this.tick();
    }, 1000);

    document.addEventListener('showSourceModal', () => {
      this.sourceCodeEditorDataBeautify = Beautify.html(
        this.editors[this.tabIndex].data
      );
      this.$bvModal.show('sourceViewer');
      this.sourceCodeEditorData = '';
    });

    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (this.isSourceViewerOk(bvEvent, modalId)) {
        this.$store.commit(
          'setSourceCodeEditorData',
          this.sourceCodeEditorData
        );
      }
    });

    // импорт JSON
    this.$refs.fileInput.addEventListener('change', function () {
      if (!(this.files && this.files.length > 0)) return;

      const file = this.files[0];
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = function() {
        vm.$store.commit('setEditors', JSON.parse(reader.result));
      };

      reader.onerror = function() {
        console.log(reader.error);
      };
    });

    this.initTheme();
  },
  watch: {
    darkMode(darkmode) {
      if (darkmode) document.body.classList.add('dark');
      else document.body.classList.remove('dark');
    },
    coloredMode(colored) {
      if (colored) document.body.classList.add('colored');
      else document.body.classList.remove('colored');
    }
  },
  methods: {
    // theme
    darkModeChange(dark) {
      this.$store.dispatch('setDarkMode', dark);
      let colored = this.coloredMode;

      if (colored && dark) {
        this.setTheme('colored-dark');
      }
      if (!colored && dark) {
        this.setTheme('dark');
      }
      if (!colored && !dark) {
        this.setTheme('default');
      }
      if (colored && !dark) {
        this.setTheme('colored');
      }

      if (this.customColor) {
        this.setColor(this.color.hue);
      }
    },
    setColor(hue) {
      this.$store.commit('setColor', hue);
      this.setTheme(this.theme);
    },
    setTheme(name) {
      const theme = this.themes.filter(theme => theme.name === name)[0];
      if (!theme) return;

      let {
        saturation: s,
        luminosity: l,
        background,
        sidebarBackground,
        light,
        lightHover,
        lightActive,
        gray,
        dark,
        colored
      } = theme;

      let h = this.color.hue;

      let HI =  (dark) ? -7.5 : 7.5;  // hover increment
      let AI =  (dark) ? 2.5  : 10;   // active increment
      let LLD = (dark) ? 15   : 5;    // background luminosity decrement
      let BLD = (dark) ? 35   : 0;    // background luminosity decrement
      let BO =  (dark) ? 0.75 : 0.15; // background opacity
      let LHD = (dark) ? 2.5  : 15;   // light hover decrement
      let LAD = (dark) ? 5    : 20;   // light active decrement
      let LO =  (dark) ? 1    : .25;  // light opacity decrement

      let primary       = `hsl(${h}, ${s}%, ${l}%)`;
      let primaryHover  = `hsl(${h}, ${s}%, ${l-HI}%)`;
      let primaryActive = `hsl(${h}, ${s}%, ${l-AI}%)`;
      let primaryLight  = `hsla(${h}, ${s}%, ${l}%, 0.5)`;
      let link          = primary;
      let linkHover     = primaryActive;

      if (colored) {
        light =             `hsla(${h}, 30%, ${l - LLD}%, ${LO})`;
        lightHover =        `hsla(${h}, 30%, ${l - LLD - LHD}%, ${LO})`;
        lightActive =       `hsla(${h}, 40%, ${l - LLD - LAD}%, ${LO})`;
        sidebarBackground = `hsla(${h}, ${s}%, ${l - BLD}%, ${BO})`;

        if (dark) {
          link = linkHover = '#fff';
          sidebarBackground = `hsla(${h}, 10%, 15%, ${BO})`;
        } else {
          link = linkHover = `hsl(${h}, ${s}%, 30%)`;
        }
      }

      const colorsMap = [
        ['--primary', primary],
        ['--primary-hover', primaryHover],
        ['--primary-active', primaryActive],
        ['--primary-light', primaryLight],
        ['--link', link],
        ['--link-hover', linkHover],
        ['--background', background],
        ['--sidebar-background', sidebarBackground],
        ['--light', light],
        ['--light-hover', lightHover],
        ['--light-active', lightActive],
        ['--gray-400', gray["400"]],
        ['--gray-500', gray["500"]],
        ['--gray-700', gray["700"]],
        ['--gray-800', gray["800"]],
      ];

      for (let color of colorsMap) {
        let cssVar = color[0];
        let value = color[1];

        if (!cssVar || !value) return;

        document.documentElement.style.setProperty(cssVar, value);
      }

      this.$store.dispatch('setTheme', name);
    },
    initTheme(){
      this.$store.dispatch('initTheme');
      this.setTheme(this.theme);
    },

    // source code editor
    isSourceViewerOk(bvEvent, modalId) {
      return modalId === 'sourceViewer'
        && bvEvent.trigger === 'ok'
        && this.sourceCodeEditorData;
    },
    copySource() {
      if (navigator.clipboard === undefined) {
        this.$bvToast.toast(`Невозможно скопировать в буфер обмена из отсутствия HTTPS`, {
            title: 'Ошибка',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'danger',
            toaster: 'b-toaster-top-center'
        });

        return;
      }

      navigator.clipboard.writeText(
        (this.sourceCodeEditorData)
          ? this.sourceCodeEditorData
          : this.sourceCodeEditorDataBeautify
      )
        .then(() => {
          this.$bvToast.toast(`Исходный код скопирован`, {
            title: 'Уведомление',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'success',
            toaster: 'b-toaster-top-center'
          })
        })
        .catch(err => {
          this.$bvToast.toast(`Произошла ошибка при копировании в буфер`, {
            title: 'Ошибка',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'danger',
            toaster: 'b-toaster-top-center'
          });
          console.error('Произошла ошибка при копировании в буфер', err);
        });
    },
    onCmCodeChange(data) {
      this.sourceCodeEditorData = data;
    },
    onCmReady() {},

    downloadJSON() {
      let blob = new Blob([JSON.stringify(this.editors)], {type : 'application/json'});
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'draft.json';
      link.click();
    },
    uploadJSON() {
      this.$refs.fileInput.click();
    },

    changeData() {
      if (!document.hidden) {
        this.$store.dispatch('setLocalStorageEditors');
      }
    },
    changeEditorData(value) {
      this.$store.commit('setEditorProperty', {property: 'data', value});
    },
    changeEditorName(value) {
      this.$store.commit('setEditorProperty', {property: 'name', value});
    },

    focusTitle() {
      let classList = this.$refs.titleInput.$el.classList;

      this.$refs.titleInput.focus();
      classList.add('animated');
      classList.add('shake');

      setTimeout(() => {
        classList.remove('animated');
        classList.remove('shake');
      }, 1000);
    },

    // tabs
    closeTab(x) {
      for (let editor in this.editors) {
        if(!({}).hasOwnProperty.call(this.editors, editor)) continue;

        if (parseInt(editor) === x) {
          this.editors.splice(parseInt(editor), 1);
          this.$store.dispatch('setLocalStorageEditors');
        }
      }
    },
    newTab() {
      this.editors.push({
        id: Date.now(),
        name: 'Новая заметка',
        data: 'Текст заметки',
        time: {
          create: this.$moment(),
          open: 0,
          focus: 0
        }
      });
      this.$store.dispatch('setLocalStorageEditors');
    },
    clickTab(tabId) {
      this.$store.commit('setTabIndex', tabId);
    },

    // timers
    tick() {
      this.editors[this.tabIndex].time.open += 1000;
      if (this.inFocus) {
        this.editors[this.tabIndex].time.focus += 1000;
      }

      this.setCurrentTabTimeFromCreate();
      this.setCurrentTabTimeWhileOpen();
      this.setCurrentTabTimeWhileFocus();

      this.changeData();
    },
    setCurrentTabTimeFromCreate() {
      const diffTime = this.$moment().diff(this.editors[this.tabIndex].time.create);
      const duration = this.$moment.duration(diffTime);
      const {hours, minutes, seconds} = this.getFormattedTimes(duration);
      this.currentTabTimeDiff = `${hours}:${minutes}:${seconds} назад`;
    },
    setCurrentTabTimeWhileOpen() {
      const duration = this.$moment.duration(this.editors[this.tabIndex].time.open);
      const {hours, minutes, seconds} = this.getFormattedTimes(duration);
      this.currentTabTimeWhileOpen = `${hours}:${minutes}:${seconds}`;
    },
    setCurrentTabTimeWhileFocus() {
      const duration = this.$moment.duration(this.editors[this.tabIndex].time.focus);
      const {hours, minutes, seconds} = this.getFormattedTimes(duration);
      this.currentTabTimeWhileFocus = `${hours}:${minutes}:${seconds}`;
    },
    getFormattedTimes(duration) {
      let hours = '0' + duration.hours();
      let minutes = '0' + duration.minutes();
      let seconds = '0' + duration.seconds();
      hours = hours.slice(-2);
      minutes = minutes.slice(-2);
      seconds = seconds.slice(-2);

      return {hours, minutes, seconds};
    },

    debounce(f, ms) {
      let isCooldown = false;
      return function () {
        if (isCooldown) return;
        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => isCooldown = false, ms);
      };
  },
  }
}
</script>

<style>
  @import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
</style>
