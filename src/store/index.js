import Vue from 'vue';
import Vuex from 'vuex';
import theme from './theme'
import editors from "./editors";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    theme,
    editors,
  }
});
