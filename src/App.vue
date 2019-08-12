<template>
  <div id="app">
    <b-card no-body>
      <b-tabs v-model="tabIndex" pills card vertical>
        <b-tab v-for="(editor, key) in editors" :key="editor.id">
          <template slot="title">
            {{ editor.name }}
            <b-button size="sm" variant="secondary" @click="closeTab(key)">x</b-button>
          </template>
          <b-card-text>
            <Editor :editorData="editor.data" @change="changeData($event, key)"></Editor>
          </b-card-text>
        </b-tab>

        <template slot="tabs-end">
          <b-nav-item @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
        </template>

        <div slot="empty" class="text-center text-muted">
          There are no open tabs<br>
          Open a new tab using the <b>+</b> button above.
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
          name: 'Таб 0',
          data: 'Текст 0'
        }
      ],
      tabIndex: 0,
      tabCounter: 1
    }
  },
  created: function(){
    if(localStorage.getItem('multiple_cke_data')) {
      this.editors = JSON.parse(localStorage.getItem('multiple_cke_data'));
    }
  },
  methods: {
    changeData(data, key) {
      this.editors[key].data = data;
      localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
    },
    closeTab(x) {
      for (let editor in this.editors) {
        if(!this.editors.hasOwnProperty(editor)) continue;

        if (parseInt(editor) === x) {
          this.editors.splice(editor, 1)
        }
      }
    },
    newTab() {
      this.editors.push({
        id: this.tabCounter,
        name: 'Таб ' + this.tabCounter,
        data: 'Текст ' + this.tabCounter
      });
      this.tabCounter++;
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
}
.card,
.tabs,
.tab-pane {
  height: 100%;
}
.ck-editor__editable_inline {
    min-height: 90vh;
}
</style>
