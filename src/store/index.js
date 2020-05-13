import Vue from 'vue';
import Vuex from 'vuex';
import theme from './theme'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {

  },
  modules: {
    theme
  }
});
