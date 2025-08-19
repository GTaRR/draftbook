<template>
  <div id="app">
    <app-sidebar
      ref="sidebar"
      :collapse="collapse"
    >
      <app-header @toggle-sidebar="collapse = !collapse" />

      <app-tabs>
        <!--eslint-disable-->
        <SlickList
          v-if="editors.length"
          v-model:list="getEditors"
          axis="y"
          lock-axis="y"
          helper-class="ghost"
          use-drag-handle
          item-key="id"
          @sort-end="dragEnd"
        >
          <!--eslint-enable-->
          <SlickItem v-for="(editor, index) in getEditors" :key="editor.id" :index="index">
            <app-tab
              :editor="editor"
              :active="(activeEditor === index)"
              @click="setTab(index)"
            >
              <DragHandle>
                <font-awesome-icon
                  v-if="!collapse"
                  :icon="['fas', 'sort']"
                  class="drag-icon"
                />
              </DragHandle>
              <span
                v-tooltip="editor.name"
                class="tab-title"
                @dblclick="focusTitle"
              >
                {{ editor.name }}
              </span>
              <span
                v-if="!collapse"
                class="tab-close"
                @click="editorsStore.closeTab(index)"
              >
                <font-awesome-icon :icon="['fas', 'xmark']" />
              </span>
            </app-tab>
          </SlickItem>
        </SlickList>
        <div
          class="tab-item tab-plus"
          @click.prevent="editorsStore.newTab()"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </div>
      </app-tabs>

      <app-footer-panel>
        <buttons-group>
          <app-button
            v-if="!collapse"
            v-tooltip="'Настройки'"
            variant="light"
            @click="showSettingsModal = true"
          >
            <font-awesome-icon :icon="['fas', 'gear']" />
          </app-button>

          <checkbox-button
            :value="darkMode"
            title="Темная тема"
            @input="darkModeChange"
          >
            <font-awesome-icon :icon="['fas', 'moon']" />
          </checkbox-button>
        </buttons-group>
      </app-footer-panel>
    </app-sidebar>

    <template v-if="editors.length">
      <app-main>
        <TitleInput
          ref="titleInput"
          :value="currentEditor.name"
          placeholder="Имя заметки"
          @input="changeEditorName"
        />

        <ckeditor
          :editor="classicEditor"
          :model-value="currentEditor.data"
          :config="{}"
          @update:model-value="changeEditorData"
          @focus="inFocus = true"
          @blur="inFocus = false"
        />

        <app-timers
          :editor="currentEditor"
          :current-tab-time-diff="currentTabTimeDiff"
          :current-tab-time-while-open="currentTabTimeWhileOpen"
          :current-tab-time-while-focus="currentTabTimeWhileFocus"
        />

        <app-modal
          v-if="showSettingsModal"
          id="settingsModal"
          title="Настройки"
        >
          <h4>Тема</h4>
          <hr>

          <theme-list @change-theme="setTheme" />
          <hr>

          <h4>Цвет</h4>
          <hr>

          <color-picker
            v-bind="color"
            @input="setColor"
          />

          <template #footer>
            <app-button
              variant="primary"
              @click="showSettingsModal = false"
            >
              OK
            </app-button>
          </template>
        </app-modal>
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
import 'moment/locale/ru';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import { SlickList, SlickItem, DragHandle } from 'vue-slicksort';

import ClassicEditor from './ckeditor';

import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import AppTabs from './components/AppTabs.vue';
import AppTab from './components/AppTab.vue';
import AppFooterPanel from './components/FooterPanel.vue';
import AppMain from './components/AppMain.vue';
import TitleInput from './components/TitleInput.vue';
import AppTimers from './components/AppTimers.vue';
import ThemeList from './components/ThemeList.vue';
import AppModal from '@/components/AppModal.vue';

import ButtonsGroup from './components/buttons/ButtonsGroup.vue'
import AppButton from './components/buttons/AppButton.vue'
import CheckboxButton from '@/components/buttons/CheckboxButton.vue';

import { themeStorage } from '@/store/theme';
import { useEditorsStore } from '@/store/editors';

const classicEditor = ref(ClassicEditor);

// options
const collapse = ref(false);

// source editor
const editorsStore = useEditorsStore();

const editors = computed(() => editorsStore.editors);
const activeEditor = computed(() => editorsStore.activeEditor);
const currentEditor = computed(() => editors.value[activeEditor.value]);
const getEditors = computed({
  get() {
    return editors.value || [];
  },
  set(value) {
    editorsStore.setEditors(value);
  },
});

const showSettingsModal = ref(false);

onMounted(() => {
  editorsStore.loadEditors();

  interval.value = setInterval(() => {
    tick();
  }, 1000);

  initTheme();
});

// theme
const color = computed(() => themeStorage.value.color);
const coloredMode = computed(() => themeStorage.value.coloredMode);
const customColor = computed(() => themeStorage.value.customColor);
const theme = computed(() => themeStorage.value.theme);
const themes = computed(() => themeStorage.value.themes);
const darkMode = computed(() => themeStorage.value.darkMode);

function darkModeChange(dark) {
  themeStorage.value.darkMode = dark;
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
  themeStorage.value.color.hue = hue;
  themeStorage.value.customColor = true;
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

  themeStorage.value.darkMode = dark;
  themeStorage.value.theme = name;
}
function initTheme(){
  setTheme(theme.value);
}

watch(darkMode, (darkMode) => {
  if (darkMode) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}, { immediate: true });
watch(coloredMode, (colored) => {
  if (colored) document.body.classList.add('colored');
  else document.body.classList.remove('colored');
}, { immediate: true });

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
  console.log(value);
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
const interval = ref(null);
const inFocus = ref(false);
const currentTabTimeDiff = ref('');
const currentTabTimeWhileOpen = ref('');
const currentTabTimeWhileFocus = ref('');

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
  currentTabTimeDiff.value = `${getFormattedTimes(moment.duration(diffTime))} назад`;
}
function setCurrentTabTimeWhileOpen() {
  currentTabTimeWhileOpen.value = getFormattedTimes(
      moment.duration(currentEditor.value.time.open),
  );
}
function setCurrentTabTimeWhileFocus() {
  currentTabTimeWhileFocus.value = getFormattedTimes(
      moment.duration(currentEditor.value.time.focus),
  );
}
function getFormattedTimes(duration) {
  const hours = `0${duration.hours()}`.slice(-2);
  const minutes = `0${duration.minutes()}`.slice(-2);
  const seconds = `0${duration.seconds()}`.slice(-2);

  return `${hours}:${minutes}:${seconds}`;
}
</script>

<style>
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
</style>
