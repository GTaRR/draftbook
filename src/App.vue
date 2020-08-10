<template>
  <div id="app">
    <app-sidebar ref="sidebar">
      <app-header @toggleSidebar="collapse = !collapse" />

      <app-tabs>
        <template v-if="editors.length">
          <draggable
            :list="editors"
            class="list-group"
            ghost-class="ghost"
            handle=".drag-icon"
          >
            <app-tab
              v-for="(editor, key) in editors"
              :key="editor.id"
              @click="setTab(key)"
              :editor="editor"
              :active="(activeEditor === key)"
            >
              <font-awesome-icon :icon="['fas', 'sort']" class="drag-icon" v-if="!collapse" />
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
                @click="$store.dispatch('closeTab', key)"
              >
                <font-awesome-icon :icon="['fas', 'times']" />
              </span>
            </app-tab>
          </draggable>
        </template>
        <div
          @click.prevent="$store.dispatch('newTab')"
          class="tab-item tab-plus"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </div>
      </app-tabs>

      <app-footer-panel>
        <buttons-group>
          <app-button
            v-b-tooltip="'Настройки'"
            v-if="!collapse"
            @click="$bvModal.show('settingsModal')"
            variant="light"
          >
            <font-awesome-icon :icon="['fas', 'cog']" />
          </app-button>

          <checkbox-button
            v-model="darkMode"
            @input="darkModeChange"
            title="Темная тема"
            v-if="!collapse"
          >
            <font-awesome-icon :icon="['fas', 'moon']" />
          </checkbox-button>

          <app-button
            v-b-tooltip="'Экспорт в JSON'"
            variant="light"
            v-if="!collapse && 0"
            @click="downloadJSON"
          >
            <font-awesome-icon :icon="['fas', 'download']" />
          </app-button>

          <app-button
            v-b-tooltip="'Импорт из JSON'"
            variant="light"
            v-if="!collapse && 0"
            @click="uploadJSON"
          >
            <font-awesome-icon :icon="['fas', 'upload']" />
          </app-button>

          <input
            style="display: none;"
            type="file"
            accept="application/json"
            ref="fileInput"
          />

          <checkbox-button
            title="Фиксирование сайдбара"
            v-model="fixedSidebar"
            class="fixed-btn"
          >
            <font-awesome-icon :icon="['fas', 'thumbtack']" />
          </checkbox-button>
        </buttons-group>
      </app-footer-panel>
    </app-sidebar>

    <template v-if="editors.length">
      <app-main>
        <title-input
          ref="titleInput"
          :value="currentEditor.name"
          placeholder="Имя заметки"
          @input="changeEditorName"
        ></title-input>

        <ckeditor
          :editor="classicEditor"
          :value="currentEditor.data"
          :config="{}"
          @input="changeEditorData"
          @focus="inFocus = true"
          @blur="inFocus = false"
        ></ckeditor>

        <app-timers
          :editor="currentEditor"
          :currentTabTimeDiff="currentTabTimeDiff"
          :currentTabTimeWhileOpen="currentTabTimeWhileOpen"
          :currentTabTimeWhileFocus="currentTabTimeWhileFocus"
        ></app-timers>

        <b-modal id="settingsModal" size="xl" centered title="Настройки">
          <h4>Тема</h4>
          <hr>
          <theme-list @changeTheme="setTheme" />

          <hr>
          <h4>Цвет</h4>
          <hr>
          <color-picker v-bind="color" @input="setColor"></color-picker>

          <template v-slot:modal-footer="{ ok }">
            <app-button variant="primary" @click="ok()">
              OK
            </app-button>
          </template>
        </b-modal>

        <b-modal
          id="sourceViewer"
          size="xl"
          centered
          title="Исходный код"
          @show="onShowSourceViewer"
        >
          <codemirror
            id="cmEditor"
            ref="cmEditor"
            :value="sourceCodeEditorDataBeautify"
            :options="cmOptions"
            @input="onCmCodeChange"
          ></codemirror>

          <template v-slot:modal-footer="{ ok }">
            <app-button variant="primary" @click="ok()">
              <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />Сохранить
            </app-button>
            <app-button variant="dark" @click="copySource" ref="copyInBufferBtn">
              <font-awesome-icon :icon="['fas', 'clipboard']" class="mr-2" />Скопировать
            </app-button>
          </template>
        </b-modal>
      </app-main>
    </template>

    <template v-else>
      <app-main />
    </template>
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
import CheckboxButton from "@/components/buttons/CheckboxButton";

import Draggable from 'vuedraggable';

export default {
  name: 'app',
  components: {
    ColorPicker,
    Draggable,
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
    CheckboxButton,
  },
  data(){
    return {
      classicEditor: ClassicEditor,
      canSaveData: true,

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
        autoRefresh: true,
      },
    }
  },
  computed: {
    ...mapGetters([
      // editors
      'editors',
      'activeEditor',
      'activeEditor',

      // theme
      'color',
      'coloredMode',
      'customColor',
      'theme',
      'themes',
    ]),
    currentEditor() {
      return this.editors[this.activeEditor];
    },
    darkMode: {
      get() {
        return this.$store.getters.darkMode
      },
      set(value) {
        this.$store.dispatch('setDarkMode', value)
      }
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
        this.editors[this.activeEditor].data
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
    onShowSourceViewer() {},
    onCmCodeChange(data) {
      this.sourceCodeEditorData = data;
    },

    // JSON Experimental
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

    // Editor change handlers
    changeData() {
      if (!document.hidden && this.canSaveData) {
        this.$store.dispatch('setLocalStorageEditors');
      }
    },
    changeEditorData(value) {
      this.$store.commit('setEditorProperty', {property: 'data', value});
    },
    changeEditorName(value) {
      this.$store.commit('setEditorProperty', {property: 'name', value});
    },

    setTab(id) {
      this.$store.dispatch('setTab', id);
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

    // timers
    tick() {
      if (!this.editors.length) return;

      let time = this.editors[this.activeEditor].time;
      time.open += 1000;
      if (this.inFocus) {
        time.focus += 1000;
      }
      this.$store.commit('setEditorProperty', {property: 'time', value: time});

      this.setCurrentTabTimeFromCreate();
      this.setCurrentTabTimeWhileOpen();
      this.setCurrentTabTimeWhileFocus();

      this.changeData();
    },
    setCurrentTabTimeFromCreate() {
      const diffTime = this.$moment().diff(this.editors[this.activeEditor].time.create);
      const duration = this.$moment.duration(diffTime);
      const {hours, minutes, seconds} = this.getFormattedTimes(duration);
      this.currentTabTimeDiff = `${hours}:${minutes}:${seconds} назад`;
    },
    setCurrentTabTimeWhileOpen() {
      const duration = this.$moment.duration(this.editors[this.activeEditor].time.open);
      const {hours, minutes, seconds} = this.getFormattedTimes(duration);
      this.currentTabTimeWhileOpen = `${hours}:${minutes}:${seconds}`;
    },
    setCurrentTabTimeWhileFocus() {
      const duration = this.$moment.duration(this.editors[this.activeEditor].time.focus);
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
  }
}
</script>

<style>
  @import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
</style>
