import moment from 'moment';
require('moment/locale/ru');

export default {
  state: {
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
    tabIndex: 0,
    currentEditor: null,
  },
  getters: {
    editors: s => s.editors,
    activeEditor: s => s.activeEditor,
    tabIndex: s => s.tabIndex,
    currentEditor: s => s.currentEditor,
  },
  mutations: {
    setTabIndex(state, index) {
      state.tabIndex = index;
    },
    setActiveEditor(state, id) {
      state.activeEditor = id;
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
        store.editors = JSON.parse(localStorage.getItem('multiple_cke_data'));
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
      state.editors[state.tabIndex].data = data;
    },
    setEditors(state, editors) {
      state.editors = editors;
    },
    setEditorProperty(state, {property, value}) {
      state.editors[state.tabIndex][property] = value;
    },
  },
  actions: {
    newTab({commit}) {
      commit('newTab');
      localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
    },
    setLocalStorageEditors({getters}) {
      localStorage.setItem('multiple_cke_data', JSON.stringify(getters.editors));
    }
  }
}
