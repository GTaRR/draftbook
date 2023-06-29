<template>
  <div id="app">
    <app-sidebar ref="sidebar" :collapse="collapse">
      <app-header @toggle-sidebar="collapse = !collapse" />

      <app-tabs>
        <template v-if="editors.length">
          <draggable
              :list="editors"
              class="list-group"
              ghost-class="ghost"
              handle=".drag-icon"
              @end="dragEnd"
          >
            <transition-group>
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
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                </span>
              </app-tab>
            </transition-group>
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
            <font-awesome-icon :icon="['fas', 'gear']" />
          </app-button>

          <checkbox-button
              v-model="darkMode"
              @input="darkModeChange"
              title="Темная тема"
          >
            <font-awesome-icon :icon="['fas', 'moon']" />
          </checkbox-button>
        </buttons-group>
      </app-footer-panel>
    </app-sidebar>

    <template v-if="editors.length">
      <app-main>
        <title-input1
            ref="titleInput"
            :value="currentEditor.name"
            placeholder="Имя заметки"
            @input="changeEditorName"
        ></title-input1>

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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import moment from 'moment';
import Beautify from 'js-beautify';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import Draggable from 'vuedraggable';

import ClassicEditor from './ckeditor';

import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import AppTabs from './components/AppTabs.vue';
import AppTab from './components/AppTab.vue';
import AppFooterPanel from './components/FooterPanel.vue';
import AppMain from './components/AppMain.vue';
import TitleInput1 from './components/TitleInput.vue';
import AppTimers from './components/AppTimers.vue';
import ThemeList from './components/ThemeList.vue';

import ButtonsGroup from './components/buttons/ButtonsGroup.vue'
import AppButton from './components/buttons/AppButton.vue'
import CheckboxButton from '@/components/buttons/CheckboxButton.vue';
import { useBVModal, useBVToast, useBVRoot } from '@/composables/bootstarp-vue';

import { useThemeStore } from '@/store/theme';
import { useEditorsStore } from '@/store/editors';

const classicEditor = ref(ClassicEditor);

// options
const collapse = ref(false);

// timers
const interval = ref(null);
const inFocus = ref(false);
const currentTabTimeDiff = ref('');
const currentTabTimeWhileOpen = ref('');
const currentTabTimeWhileFocus = ref('');

// source editor
const sourceCodeEditorDataBeautify = ref('');
const sourceCodeEditorData = ref('');
const cmOptions = ref({
  tabSize: 2,
  mode: 'xml',
  htmlMode: true,
  matchClosing: true,
  theme: 'idea',
  lineNumbers: true,
  line: true,
  lineWrapping: false,
  autofocus: true,
  autoRefresh: true,
});

const $toast = useBVToast();

const themeStore = useThemeStore();
const editorsStore = useEditorsStore();

const color = computed(() => themeStore.color);
const coloredMode = computed(() => themeStore.coloredMode);
const customColor = computed(() => themeStore.customColor);
const theme = computed(() => themeStore.theme);
const themes = computed(() => themeStore.themes);
const editors = computed(() => editorsStore.editors);
const activeEditor = computed(() => editorsStore.activeEditor);

const currentEditor = computed(() => editors.value[activeEditor.value]);
const darkMode = computed({
  get() {
    return themeStore.darkMode;
  },
  set(value) {
    themeStore.setDarkMode(value);
  },
});

onMounted(() => {
  editorsStore.loadEditors();

  interval.value = setInterval(() => {
    tick();
  }, 1000);

  document.addEventListener('showSourceModal', () => {
    sourceCodeEditorDataBeautify.value = Beautify.html(
        editors.value[activeEditor.value].data
    );
    useBVModal().show('sourceViewer');
    sourceCodeEditorData.value = '';
  });

  useBVRoot().$on('bv::modal::hide', (bvEvent, modalId) => {
    if (isSourceViewerOk(bvEvent, modalId)) {
      editorsStore.setSourceCodeEditorData(sourceCodeEditorData.value);
    }
  });

  initTheme();
});

watch(darkMode, (darkMode) => {
  if (darkMode) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
});
watch(coloredMode, (colored) => {
  if (colored) document.body.classList.add('colored');
  else document.body.classList.remove('colored');
});

// theme
function darkModeChange(dark) {
  themeStore.setDarkMode(dark);
  let colored = coloredMode.value;

  if (colored && dark) {
    setTheme('colored-dark');
  }
  if (!colored && dark) {
    setTheme('dark');
  }
  if (!colored && !dark) {
    setTheme('default');
  }
  if (colored && !dark) {
    setTheme('colored');
  }

  if (customColor.value) {
    setColor(color.value.hue);
  }
}
function setColor(hue) {
  themeStore.setColor(hue);
  setTheme(theme.value);
}
function setTheme(name) {
  const theme = themes.value.find(theme => theme.name === name);
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

  let h = color.value.hue;

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

  cmOptions.value.theme = (dark) ? 'darcula' : 'idea';

  themeStore.setTheme(name);
}
function initTheme(){
  themeStore.initTheme();
  setTheme(theme.value);
}

// source code editor
function isSourceViewerOk(bvEvent, modalId) {
  return modalId === 'sourceViewer'
      && bvEvent.trigger === 'ok'
      && sourceCodeEditorData.value;
}
async function copySource() {
  if (navigator.clipboard === undefined) {
    $toast.toast(`Невозможно скопировать в буфер обмена из отсутствия HTTPS`, {
      title: 'Ошибка',
      autoHideDelay: 2000,
      appendToast: true,
      variant: 'danger',
      toaster: 'b-toaster-top-center'
    });

    return;
  }

  try {
    await navigator.clipboard.writeText(
        (sourceCodeEditorData.value)
            ? sourceCodeEditorData.value
            : sourceCodeEditorDataBeautify.value
    )
    $toast.toast(`Исходный код скопирован`, {
      title: 'Уведомление',
      autoHideDelay: 2000,
      appendToast: true,
      variant: 'success',
      toaster: 'b-toaster-top-center'
    })
  } catch (err) {
    $toast.toast(`Произошла ошибка при копировании в буфер`, {
      title: 'Ошибка',
      autoHideDelay: 2000,
      appendToast: true,
      variant: 'danger',
      toaster: 'b-toaster-top-center'
    });
    console.error('Произошла ошибка при копировании в буфер', err);
  }
}

function onCmCodeChange(data) {
  sourceCodeEditorData.value = data;
}

// Editor change handlers
function changeData() {
  if (!document.hidden) {
    editorsStore.setLocalStorageEditors();
  }
}
function changeEditorData(value) {
  editorsStore.setEditorProperty({ property: 'data', value });
}
function changeEditorName(value) {
  editorsStore.setEditorProperty({ property: 'name', value });
}

function setTab(id) {
  editorsStore.setTab(id);
}
function dragEnd({ newIndex }) {
  editorsStore.setTab(newIndex);
}

const titleInput = ref(null);

function focusTitle() {
  let classList = titleInput.value.$el.classList;

  titleInput.value.focus();
  classList.add('animated');
  classList.add('shake');

  setTimeout(() => {
    classList.remove('animated');
    classList.remove('shake');
  }, 1000);
}

// timers
function tick() {
  if (!editors.value.length) return;

  let time = Object.assign({}, currentEditor.value.time);
  time.open += 1000;
  if (inFocus.value) time.focus += 1000;
  editorsStore.setEditorProperty({ property: 'time', value: time });

  setCurrentTabTimeFromCreate();
  setCurrentTabTimeWhileOpen();
  setCurrentTabTimeWhileFocus();

  changeData();
}
function setCurrentTabTimeFromCreate() {
  const diffTime = moment().diff(currentEditor.value.time.create);
  const duration = moment.duration(diffTime);
  currentTabTimeDiff.value = `${getFormattedTimes(duration)} назад`;
}
function setCurrentTabTimeWhileOpen() {
  const duration = moment.duration(currentEditor.value.time.open);
  currentTabTimeWhileOpen.value = getFormattedTimes(duration);
}
function setCurrentTabTimeWhileFocus() {
  const duration = moment.duration(currentEditor.value.time.focus);
  currentTabTimeWhileFocus.value = getFormattedTimes(duration);
}
function getFormattedTimes(duration) {
  let hours = '0' + duration.hours();
  let minutes = '0' + duration.minutes();
  let seconds = '0' + duration.seconds();
  hours = hours.slice(-2);
  minutes = minutes.slice(-2);
  seconds = seconds.slice(-2);

  return `${hours}:${minutes}:${seconds}`;
}
</script>

<style>
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
</style>
