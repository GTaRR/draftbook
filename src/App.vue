<template>
  <div id="app">
    <b-card no-body :class="{'dark-mode': darkMode}">
      <b-tabs v-model="tabIndex"
              pills
              card
              vertical
              lazy
              ref="tabsWrapper"
      >
        <template slot="tabs-start">
          <div class="main-header py-3 px-3 d-flex align-items-center">
            <button class="mr-3 btn btn-primary"
                    @click="toggleSidebar"
            ><i class="fas fa-bars"></i></button>
            <span class="logo-title">Draft</span>
          </div>
        </template>

        <b-tab v-for="(editor, key) in editors"
               :key="editor.id"
               title-link-class="d-flex justify-content-between"
               @click="clickTab(editor.id)"
        >
          <template slot="title">
            <span class="tab-title"
                  @dblclick="focusTitle"
            >{{ editor.name }}</span>
            <span v-if="!collapse"
                  class="btn btn-sm"
                  :class="(tabIndex === key) ? 'btn-primary' : 'btn-light'"
                  @click="closeTab(key)"
            ><i class="fas fa-times"></i></span>
          </template>
          <b-card-text>
            <b-form-input ref="titleInput"
                          v-model="editor.name"
                          class="mb-2"
                          placeholder="Имя заметки"
                          @input="changeData"
            ></b-form-input>
            <ckeditor :editor="classicEditor"
                      v-model="editor.data"
                      :config="editorConfig"
                      @input="changeData"
                      @focus="onEditorFocus"
                      @blur="onEditorBlur"
            ></ckeditor>
            <div class="mt-3">
              <span class="mr-2">
                <span class="text-dark mr-2">Время с момента создания заметки:</span>
                <span class="text-success mr-2">{{ editor.time.create | moment("from", "now") }}</span>
<!--                <i class="fa far fa-clock text-success"></i>-->
              </span>
              <span class="mr-2">
                <span class="text-dark mr-2">Заметка открыта:</span>
                <span class="text-success mr-2">{{ -editor.time.open | duration('humanize', true) }}</span>
<!--                <i class="fa far fa-clock text-success"></i>-->
              </span>
              <span class="mr-2">
                <span class="text-dark mr-2">Поле в фокусе:</span>
                <span class="text-success">{{ -editor.time.focus | duration('humanize', true) }}</span>
<!--                <i class="fa far fa-clock text-success"></i>-->
              </span>
            </div>
          </b-card-text>
        </b-tab>

        <template slot="tabs-end">
          <b-nav-item @click.prevent="newTab"
                      class="text-center"
                      href="#"
          >
            <i class="fas fa-plus"></i>
          </b-nav-item>
          <div v-if="!collapse && 0"
               class="import-wrapper mt-auto d-flex"
          >
            <button class="btn btn-light"
                    @click="downloadJSON"
            >
              <i class="fas fa-download"></i>
              <span>Экспорт</span>
            </button>
            <b-form-file accept="application/json"
                         class="btn btn-light"
                         placeholder=""
                         drop-placeholder=""
                         v-model="jsonFile"
            >
              <i class="fas fa-upload"></i>
              <span>Импорт</span>
            </b-form-file>
            <button class="btn btn-light"
                    @click="darkMode = !darkMode"
            >
              <i class="fa fas fa-paint-brush"></i>
              <span>Тема</span>
            </button>
          </div>
        </template>

        <div slot="empty" class="text-center text-muted pt-5">
          Не создано ни одной заметки<br>
          создайте новую при помощи кнопки <b>+</b>
        </div>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import ClassicEditor from './ckeditor';
import moment from 'moment';

export default {
  name: 'app',
  data(){
    return {
      classicEditor: ClassicEditor,
      editorConfig: {},
      editors: [
        {
          id: 0,
          name: 'Первая заметка',
          data: `
            <h2>Черновик для заметок!</h2>
            <p>Это просто черновик для заметок, который автоматически запоминает данные в <code>LocalStorage</code> браузера и при закрытии страницы данные не теряются.</p>
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
              create: moment(new Date()).format(),
              open: 0,
              focus: 0,
          }
        }
      ],
      tabIndex: 0,
      tabCounter: 1,
      activeEditor: 0,
      collapse: false,
      darkMode: false,
      jsonFile: null,
      interval: null,
      inFocus: false,
    }
  },
  created: function(){
    this.tabCounter = Object.keys(this.editors).length;
    if(localStorage.getItem('multiple_cke_data')) {
      this.editors = JSON.parse(localStorage.getItem('multiple_cke_data'));
      this.tabCounter = 0;
      for(let editor of this.editors){
        if(editor.id > this.tabCounter){
          this.tabCounter = editor.id;
        }
      }
      this.tabCounter++;
    }
    this.editors.map(item => {
        if(typeof item.time === 'undefined') {
            item.time = {
                create: moment(new Date()).format(),
                open: 0,
                focus: 0
            }
        }
    });
  },
  mounted(){
    this.interval = setInterval(() => {
      this.tick();
    }, 500);
  },
  methods: {
    focusTitle() {
      let classList = this.$refs.titleInput[0].$el.classList;

      this.$refs.titleInput[0].focus();
      classList.add('animated');
      classList.add('shake');

      setTimeout(() => {
        classList.remove('animated');
        classList.remove('shake');
      }, 1000);
    },
    downloadJSON() {
      let blob = new Blob([JSON.stringify(this.editors)], {type : 'application/json'});
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'draft.json';
      link.click();
    },
    toggleSidebar() {
      this.collapse = !this.collapse;
      this.$refs.tabsWrapper.$el.classList.toggle('collapse-tabs');
    },
    changeData() {
      localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
    },
    closeTab(x) {
      for (let editor in this.editors) {
        if(!this.editors.hasOwnProperty(editor)) continue;

        if (parseInt(editor) === x) {
          this.editors.splice(parseInt(editor), 1);
          localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
        }
      }
    },
    newTab() {
      this.editors.push({
        id: this.tabCounter,
        name: 'Новая вкладка',
        data: 'Текст заметки ' + this.tabCounter,
        time: {
            create: moment(new Date()).format(),
            open: 0,
            focus: 0
        }
      });
      this.tabCounter++;
      localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
    },
    tick() {
      this.editors[this.tabIndex].time.open += 500;
      if(this.inFocus) {
          this.editors[this.tabIndex].time.focus += 500;
      }
    },
    clickTab(tabId) {
      this.activeEditor = tabId;
    },
    onEditorFocus() {
      this.inFocus = true;
    },
    onEditorBlur() {
      this.inFocus = false;
    }
  }
}
</script>
