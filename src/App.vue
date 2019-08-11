<template>
  <div id="app">
    <Editor :editorData="editorData" />
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
      editorData: ''
    }
  }
}
</script>

<style>

</style>
