import moment from 'moment';
require('moment/locale/ru');

import debounce from 'lodash/debounce';
const setCanDataChange = debounce(state => { state.canDataChange = true; }, 1000);

const state = {
  editors: [
    {
      id: 0,
      name: 'Первая заметка',
      data: `
          <h2>Черновик для заметок!</h2>
          <p>Это просто черновик для заметок, который автоматически запоминает данные в <code>LocalStorage</code> браузера, чтобы данные не потерялись ни при закрытии вкладки, ни при закрытии браузера.</p>
          <p>Удобно использовать для написания оценок, инструкций и прочего без создания документа, использования отдельного редактора.</p>
          <p>Запоминаются все вкладки. При очистке кеша всего браузера стираются и эти заметки из <code>LocalStorage</code>.</p>
          <blockquote>
              <p><strong>Как создать новую вкладку?&nbsp;</strong></p>
              <p>Нажмите <code>+</code> в боковой панели.</p>
          </blockquote>
          <blockquote>
              <p><strong>Как переименовать вкладку?&nbsp;</strong></p>
              <p>Заголовок заметки сверху является полем ввода.</p>
          </blockquote>
        `,
      time: {
        create: moment().format(),
        open: 0,
        focus: 0,
      }
    }
  ],
  activeEditor: 0,
  canDataChange: true,
}

const getters = {
  editors: s => s.editors,
  activeEditor: s => s.activeEditor,
  canDataChange: s => s.canDataChange,
}

const mutations = {
  setActiveEditor(state, id) {
    state.activeEditor = id;
  },
  setTab(state) {
    state.canDataChange = false;
    setCanDataChange(state);
  },
  closeTab(state, x) {
    let isSetActiveEditor = false;
    for (let editor in state.editors) {
      if (!({}).hasOwnProperty.call(state.editors, editor))
        continue;

      if (state.activeEditor === x && !isSetActiveEditor) {
        state.activeEditor = state.activeEditor = parseInt(editor);
        isSetActiveEditor = true;
      }

      if (parseInt(editor) === x) {
        state.editors.splice(parseInt(editor), 1);
      }
    }
  },
  newTab(state) {
    state.editors.push({
      id: Date.now(),
      name: 'Новая заметка',
      data: 'Текст заметки',
      time: {
        create: moment().format(),
        open: 0,
        focus: 0
      }
    });
  },
  loadEditors(store) {
    if(localStorage.getItem('multiple_cke_data')) {
      store.editors = JSON.parse(
        localStorage.getItem('multiple_cke_data')
      );
    }

    // Проверка заполнения времени
    store.editors.map(item => {
      if(typeof item.time === 'undefined') {
        item.time = {
          create: moment().format(),
          open: 0,
          focus: 0
        }
      }
    });

    store.currentEditor = store.editors[0];
  },
  setSourceCodeEditorData(state, data) {
    state.editors[state.activeEditor].data = data;
  },
  setEditors(state, editors) {
    state.editors = editors;
  },
  setEditorProperty(state, {property, value}) {
    if (property === 'data' && !state.canDataChange) return;

    state.editors[state.activeEditor][property] = value;
  },
}

const actions = {
  setTab({ commit }, id) {
    commit('setTab', id);
    commit('setActiveEditor', id);
  },
  closeTab({ commit, dispatch }, x) {
    commit('closeTab', x);
    dispatch('setLocalStorageEditors');
  },
  newTab({ commit, dispatch }) {
    commit('newTab');
    dispatch('setLocalStorageEditors');
  },
  setLocalStorageEditors({ getters }) {
    localStorage.setItem(
      'multiple_cke_data',
      JSON.stringify(getters.editors, null, '\t')
    );
  },

}

export default {
  state,
  getters,
  mutations,
  actions
}
