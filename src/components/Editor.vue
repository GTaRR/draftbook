<template>
  <div>
    <ckeditor :editor="editor" :value="editorData" :config="editorConfig" @input="changeData"></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';
// import Link from '@ckeditor/ckeditor5-link/src/link';
// import List from '@ckeditor/ckeditor5-list/src/list';
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
// import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import '@ckeditor/ckeditor5-build-classic/build/translations/ru';

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
            language: 'ru',
            // plugins: [
            //   EssentialsPlugin,
            //   Paragraph,
            //   Bold,
            //   Italic,
            //   Autoformat,
            //   Heading,
            //   Link,
            //   List,
            //   Alignment,
            //   Autoformat,
            //   BlockQuote
            // ],
            toolbar: {
              items: [
                'heading',
                '|',
                'bold', 'italic', 'link', 'bulletedList',
                'numberedList', 'blockQuote', "insertTable",
                '|',
                'undo', 'redo',
                // '|',
                // 'clipboard', 'autoformat', 'alignment',
              ]
            },
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
