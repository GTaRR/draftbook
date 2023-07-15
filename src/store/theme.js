// import { defineStore } from 'pinia';
// import { reactive } from 'vue';
import { useStorage } from '@vueuse/core';
import merge from 'lodash/merge';

const DEFAULT_STATE = {
  color: {
    hue: 212,
    saturation: 38,
    luminosity: 62,
    alpha: 1
  },
  darkMode: false,
  coloredMode: false,
  customColor: false,
  theme: 'default',
  themes: [
    {
      name: 'default',
      saturation: 38,
      luminosity: 62,
      background: '#fff',
      sidebarBackground: '#fff',
      light: '#f8f9fa',
      lightHover: '#eee',
      lightActive: '#eee',
      gray: {
        400: "#ced4da",
        500: "#aaa",
        700: "#5a5a5a",
        800: "#343a40",
      },
      dark: false,
      colored: false,
    },
    {
      name: 'dark',
      saturation: 25,
      luminosity: 48,
      background: '#202020',
      sidebarBackground: '#202020',
      light: '#252424',
      lightHover: '#2d2d2d',
      lightActive: '#1b1b1b',
      gray: {
        400: "#45403c",
        500: "#606060",
        700: "#ccc",
        800: "#ccc",
      },
      dark: true,
      colored: false,
    },
    {
      name: 'colored',
      saturation: 36,
      luminosity: 62,
      background: '#fff',
      sidebarBackground: '#fff',
      light: '#f8f9fa',
      lightHover: '#eee',
      lightActive: '#eee',
      gray: {
        400: "#ced4da",
        500: "#aaa",
        700: "#5a5a5a",
        800: "#343a40",
      },
      dark: false,
      colored: true,
    },
    {
      name: 'colored-dark',
      saturation: 32,
      luminosity: 54,
      background: '#202020',
      sidebarBackground: '#202020',
      light: '#252424',
      lightHover: '#2d2d2d',
      lightActive: '#393334',
      gray: {
        400: "#45403c",
        500: "#606060",
        700: "#ccc",
        800: "#ccc",
      },
      dark: true,
      colored: true,
    },
  ]
};

export const themeStorage = useStorage(
  'multiple_cke_theme',
  DEFAULT_STATE,
  localStorage,
  { mergeDefaults: (storageValue, defaults) => merge(defaults, storageValue) },
);

// export const useThemeStore = defineStore('theme', {
//   state: () => DEFAULT_STATE,
//   getters: {
//     currentTheme() {
//       return this.themes.filter(theme => theme.name === this.theme)[0];
//     },
//   },
//   actions: {
//     setTheme(name) {
//       this.theme = name;
//       this.darkMode = this.currentTheme.dark;
//       this.coloredMode = this.currentTheme.colored;
//
//       storage.value = this;
//     },
//     setColor(hue) {
//       this.color.hue = hue;
//       this.customColor = true;
//
//       this.setTheme(this.theme);
//     },
//     setDarkMode(dark) {
//       this.darkMode = dark;
//
//       this.setTheme(this.theme);
//     },
//     initTheme() {
//       const {
//         color,
//         darkMode,
//         coloredMode,
//         customColor,
//         theme,
//         themes
//       } = storage.value;
//
//       if (color) this.color = color;
//       if (darkMode) this.darkMode = darkMode;
//       if (coloredMode) this.coloredMode = coloredMode;
//       if (customColor) this.customColor = customColor;
//       if (theme) this.theme = theme;
//       if (themes) this.themes = themes;
//     },
//   },
// });
