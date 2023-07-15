'use strict';

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';

import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
// import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';

import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
// import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Font from '@ckeditor/ckeditor5-font/src/font';

import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import AutoFormat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
// import ClipBoard from '@ckeditor/ckeditor5-clipboard/src/clipboard';

import { SourceEditing }  from '@ckeditor/ckeditor5-source-editing';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';

// import SourceView from './plugins/sourceview';

import '@ckeditor/ckeditor5-build-classic/build/translations/ru';

import '@/sass/ckeditor_overrides.scss';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
    EssentialsPlugin,

    Paragraph,
    Heading,

    Alignment,

    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    // CodeBlock,
    // Subscript,
    // Superscript,

    Link,
    List,
    TodoList,
    BlockQuote,
    Table,
    TableToolbar,

    Font,
    RemoveFormat,

    // ClipBoard,
    AutoFormat,
    PasteFromOffice,

    GeneralHtmlSupport,
    SourceEditing,
    // SourceView,
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'alignment',
            '|',
            'bold', 'italic', 'underline', 'strikethrough', 'code', /*'codeBlock',*/
            '|',
            'link', 'bulletedList', 'numberedList', 'todoList', 'blockQuote', "insertTable",
            // '|',
            // 'fontSize', 'fontFamily',
            '|',
            'fontColor', 'fontBackgroundColor',
            // '|',
            'removeFormat',
            '|',
            'undo', 'redo',
            '|',
            'sourceEditing',
            // 'sourceView'
        ],
    },
    table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    },
    // codeBlock: {
    //     languages: [
    //         { language: 'css', label: 'CSS' },
    //         { language: 'html', label: 'HTML' },
    //         { language: 'php', label: 'PHP', class: 'php-code' },
    //         { language: 'javascript', label: 'JavaScript' },
    //     ]
    // },

    language: 'ru',
};
