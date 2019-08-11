<template>
  <div id="app">
  <b-card no-body>
    <b-tabs v-model="tabIndex" pills card vertical>
      <b-tab :title="editor.name" v-for="editor in editors" :key="editor.id">
        <b-card-text>
          <Editor :editorData="editor.data"></Editor> 
        </b-card-text>
      </b-tab>
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
          name: 'test',
          data: '1'
        },
        {
          id: 1,
          name: 'test',
          data: '2'
        }
      ],
      tabIndex: 0
    }
  }
}
</script>

<style>
#app,
.card,
.tabs,
.tab-pane {
  height: 100vh;
}
.ck-editor__editable_inline {
    min-height: 400px;
}
</style>
