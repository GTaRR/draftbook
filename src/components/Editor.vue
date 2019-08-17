<template>
  <div>
    <ckeditor :editor="editor" :value="editorData" :config="editorConfig" @input="changeData"></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from '../ckeditor';

export default {
  name: 'Editor',
  props: [
    'editorData'
  ],
  data() {
      return {
          editor: ClassicEditor,
          // editorData: '',
          editorConfig: {}
      }
  },
  methods: {
    changeData: function( event) {
      this.$emit('change', event);
    }
  }
}
</script>
