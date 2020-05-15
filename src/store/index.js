import Vue from 'vue';
import Vuex from 'vuex';
import theme from './theme'
import timer from './timer'
import editors from "./editors";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {

  },
  modules: {
    theme,
    timer,
    editors
  }
});
