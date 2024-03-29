import { defineStore } from 'pinia';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { useStorage } from '@vueuse/core';

import 'moment/locale/ru';

const setCanDataChange = debounce(state => { state.canDataChange = true; }, 1000);
const storage = useStorage(
  'multiple_cke_data',
  [
    {
      id: 0,
      name: 'Первая заметка',
      data: `
          <h2><strong>D R A F T B O O K</strong></h2>
          <h4><strong>Черновик для заметок</strong></h4>
          <ul class="todo-list">
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Автоматически запоминает данные в </span></label><code><label class="todo-list__label"><span class="todo-list__label__description">LocalStorage</span></label></code><label class="todo-list__label"><span class="todo-list__label__description"> браузера.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Данные не потеряются ни при закрытии вкладки, ни при закрытии браузера.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Запоминаются все вкладки.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Есть тёмная тема.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Есть настройки цветовой схемы.</span></label></li>
          </ul>
          <blockquote>
              <p><strong>Как создать новую вкладку?</strong></p>
              <p>Нажмите <code>+</code> в боковой панели.</p>
          </blockquote>
          <blockquote>
              <p><strong>Как переименовать вкладку?</strong></p>
              <p>Заголовок заметки сверху является текстовым полем ввода.</p>
          </blockquote>
          <p><strong>Внимание, при очистке кеша всего браузера стираются и эти заметки из </strong><code><strong>LocalStorage</strong></code><strong>.</strong></p>
        `,
      time: {
        create: moment().format(),
        open: 0,
        focus: 0,
      }
    },
  ],
  localStorage,
  { mergeDefaults: true },
)

export const useEditorsStore = defineStore('editors', {
  state: () => ({
    editors: [
      {
        id: 0,
        name: 'Первая заметка',
        data: `
          <h2><strong>D R A F T B O O K</strong></h2>
          <h4><strong>Черновик для заметок</strong></h4>
          <ul class="todo-list">
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Автоматически запоминает данные в </span></label><code><label class="todo-list__label"><span class="todo-list__label__description">LocalStorage</span></label></code><label class="todo-list__label"><span class="todo-list__label__description"> браузера.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Данные не потеряются ни при закрытии вкладки, ни при закрытии браузера.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Запоминаются все вкладки.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Есть тёмная тема.</span></label></li>
              <li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Есть настройки цветовой схемы.</span></label></li>
          </ul>
          <blockquote>
              <p><strong>Как создать новую вкладку?</strong></p>
              <p>Нажмите <code>+</code> в боковой панели.</p>
          </blockquote>
          <blockquote>
              <p><strong>Как переименовать вкладку?</strong></p>
              <p>Заголовок заметки сверху является текстовым полем ввода.</p>
          </blockquote>
          <p><strong>Внимание, при очистке кеша всего браузера стираются и эти заметки из </strong><code><strong>LocalStorage</strong></code><strong>.</strong></p>
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
  }),
  actions: {
    setTab(id) {
      this.canDataChange = false;
      setCanDataChange(this);
      this.activeEditor = id;
    },
    closeTab(x) {
      console.log(x);
      let isSetActiveEditor = false;
      for (let editor in this.editors) {
        if (!({}).hasOwnProperty.call(this.editors, editor)) continue;

        if (this.activeEditor === x && x !== parseInt(editor) && !isSetActiveEditor) {
          this.activeEditor = parseInt(editor);
          isSetActiveEditor = true;
        }

        if (parseInt(editor) === x) {
          this.editors.splice(parseInt(editor), 1);
        }
      }
      this.setLocalStorageEditors();
    },
    newTab() {
      this.editors.push({
        id: Date.now(),
        name: 'Новая заметка',
        data: 'Текст заметки',
        time: {
          create: moment().format(),
          open: 0,
          focus: 0
        }
      });

      this.setLocalStorageEditors();
    },
    setLocalStorageEditors() {
      storage.value = this.editors;
    },
    loadEditors() {
      this.editors = storage.value;

      // Проверка заполнения времени
      this.editors.map(item => {
        if(typeof item.time === 'undefined') {
          item.time = {
            create: moment().format(),
            open: 0,
            focus: 0
          }
        }
      });
    },
    setEditors(editors) {
      this.editors = editors;
      this.setLocalStorageEditors();
    },
    setEditorProperty({ property, value }) {
      if (property === 'data' && !this.canDataChange) return;

      this.editors[this.activeEditor][property] = value;
      this.setLocalStorageEditors();
    },
  },
});
