<template>
  <div id="app">
    <b-card no-body>
      <b-tabs v-model="tabIndex" pills card vertical ref="tabsWrapper">
        <template slot="tabs-start">
          <div class="main-header py-3 px-3 d-flex align-items-center">
            <button class="mr-3 btn btn-primary" @click="toggleSidebar"><i class="fas fa-bars"></i></button>
            <span class="logo-title">Draft</span>
          </div>
        </template>

        <b-tab v-for="(editor, key) in editors" :key="editor.id" title-link-class="d-flex justify-content-between">
          <template slot="title">
            <span class="tab-title">{{ editor.name }}</span>
            <span v-if="!collapse" class="btn btn-sm" :class="(tabIndex === key) ? 'btn-primary' : 'btn-light'" @click="closeTab(key)"><i class="fas fa-times"></i></span>
          </template>
          <b-card-text>
            <b-form-input v-model="editor.name" class="mb-2" placeholder="Имя заметки"></b-form-input>
            <Editor :editorData="editor.data" @change="changeData($event, key)"></Editor>
          </b-card-text>
        </b-tab>

        <template slot="tabs-end">
          <b-nav-item @click.prevent="newTab" class="text-center" href="#"><b><i class="fas fa-plus"></i></b></b-nav-item>
          <div v-if="!collapse && 0" class="import-wrapper mt-auto d-flex">
            <button class="btn btn-light" @click="getJSON">
              <i class="fas fa-download"></i>
              <span>Экспорт</span>
            </button>
            <button class="btn btn-light">
              <i class="fas fa-upload"></i>
              <span>Импорт</span>
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
import Editor from './components/Editor.vue';

export default {
  name: 'app',
  components: {
    Editor
  },
  data(){
    return {
      editors: [
        {
          id: 0,
          name: 'Первая заметка',
          data: '<h2>Черновик для заметок!</h2><p>Это просто черновик для заметок, который автоматически запоминает данные в LocalStorage браузера и при закрытии страницы данные не теряются.</p><p>Удобно использовать для написания оценок, инструкций и прочего без создания документа, использования отдельного редактора.</p><p>Запоминаются все вкладки. При очистке кеша всего браузера стираются и эти заметки из LocalStorage.</p>'
        }
      ],
      tabIndex: 0,
      tabCounter: 1,
      collapse: false
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
  },
  methods: {
    getJSON() {
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
    changeData(data, key) {
      this.editors[key].data = data;
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
        data: 'Текст заметки ' + this.tabCounter
      });
      this.tabCounter++;
      localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
    }
  }
}
</script>
