<template>
  <div>
    <ckeditor :editor="editor" :value="editorData" :config="editorConfig" @input="changeData"></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';

export default {
  name: 'Editor',
  props: [
    'editorData'
  ],
  data() {
      return {
          editor: ClassicEditor,
          // editorData: '',
          editorConfig: {
              language: 'ru'
          }
      }
  },
  methods: {
    changeData: function( event) {
      this.$emit('change', event);
    }
  }
}
</script>

<style scoped>

</style>
