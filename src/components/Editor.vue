<template>
  <div>
    <ckeditor :editor="editor" :value="editorData" :config="editorConfig"></ckeditor>
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
      };
  }
}
</script>

<style scoped>

</style>
