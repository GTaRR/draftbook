export default {
  state: {
    color: {
      hue: 163,
      saturation: 38,
      luminosity: 62,
      alpha: 1
    },
    darkMode: false,
    coloredMode: false,
    customColor: false,
    theme: 'dark',
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
  },
  getters: {
    color: s => s.color,
    darkMode: s => s.darkMode,
    coloredMode: s => s.coloredMode,
    customColor: s => s.customColor,
    theme: s => s.theme,
    themes: s => s.themes,
    currentTheme: s => s.themes.filter(theme => theme.name === s.theme)[0]
  },
  actions: {
    setColor({commit, getters}, hue) {
      commit('setColor', hue);
      commit('setTheme', getters.theme);
    },
    setTheme({commit, state, getters}, name) {
      commit('setTheme', {name, getters})
      localStorage.setItem('multiple_cke_theme', JSON.stringify(state));
    },
    setDarkMode({commit}, dark) {
      commit('setDarkMode', dark)
    },
    initTheme({commit}){
      if (localStorage.getItem('multiple_cke_theme')) {
        commit('initTheme');
      }
    },
  },
  mutations: {
    setColor(state, hue) {
      state.color.hue = hue;
      state.customColor = true;
    },
    setTheme(state, {name, getters}) {
      state.theme = name;
      const currentTheme = getters.currentTheme;

      state.darkMode = currentTheme.dark;
      state.coloredMode = currentTheme.colored;
    },
    setDarkMode(state, dark) {
      state.darkMode = dark;
    },
    initTheme(state) {
      const {
        color,
        darkMode,
        coloredMode,
        customColor,
        theme,
        themes
      } = JSON.parse(localStorage.getItem('multiple_cke_theme'));

      if(color) state.color = color;
      if(darkMode) state.darkMode = darkMode;
      if(coloredMode) state.coloredMode = coloredMode;
      if(customColor) state.customColor = customColor;
      if(theme) state.theme = theme;
      if(themes) state.themes = themes;
    }
  }
}
