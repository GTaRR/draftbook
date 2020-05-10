<template>
  <div id="app">
    <b-card no-body :class="{'dark-mode': darkMode}">
      <b-tabs
          v-model="tabIndex"
          pills
          card
          vertical
          lazy
          ref="tabsWrapper"
          :nav-class="{'fixed-nav':fixedSidebar}"
          nav-wrapper-class="nav-wrapper"
      >

        <template slot="tabs-start">
          <div class="main-header py-3 px-3 d-flex align-items-center">
            <div class="main-header__overlay"></div>
            <button class="mr-3 btn btn-primary"
                    @click="toggleSidebar"
            ><i class="fas fa-bars"></i></button>
            <span class="logo-title">Draftbook</span>
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
                  v-b-tooltip="editor.name"
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

            <div class="mt-3 d-flex align-items-center flex-wrap">
              <span class="mr-2">
                <span class="text-dark mr-2">Заметка создана:</span>
                <span class="text-primary mr-2"
                      v-b-tooltip.hover
                      :title="editor.time.create | moment('Do MMMM YYYY, H:mm:ss')"
                >
                  {{ currentTabTimeDiff }}
                </span>
              </span>
              <span class="mr-2">
                <span class="text-dark mr-2">Заметка открыта:</span>
                <span class="text-primary mr-2">{{ currentTabTimeWhileOpen }}</span>
              </span>
              <span class="mr-2">
                <span class="text-dark mr-2">Поле в фокусе:</span>
                <span class="text-primary">{{ currentTabTimeWhileFocus }}</span>
              </span>

              <div
                  v-if="!collapse && 0"
                  class="import-wrapper ml-auto d-flex"
              >
                <b-button
                    variant="light"
                    @click="downloadJSON"
                    size="sm"
                >
                  <i class="fas fa-download"></i>
                  <span>Экспорт</span>
                </b-button>
                <b-form-file
                    accept="application/json"
                    class="btn btn-light"
                    placeholder=""
                    drop-placeholder=""
                    v-model="jsonFile"
                    size="sm"
                >
                  <i class="fas fa-upload"></i>
                  <span>Импорт</span>
                </b-form-file>
                <b-button
                    variant="light"
                    @click="darkMode = !darkMode"
                    size="sm"
                >
                  <i class="fa fas fa-paint-brush"></i>
                  <span>Тема</span>
                </b-button>
              </div>

              <color-picker v-bind="color" @input="changeColor"></color-picker>

            </div>

            <b-modal id="sourceViewer" size="xl" centered title="Исходный код" >
              <codemirror
                  ref="cmEditor"
                  :value="sourceCodeEditorDataBeautify"
                  :options="cmOptions"
                  @ready="onCmReady"
                  @input="onCmCodeChange"
              />

              <template v-slot:modal-footer="{ ok }">
                <b-button variant="success" @click="ok()">
                  <i class="fas fa-save mr-2"></i>Сохранить
                </b-button>
                <b-button variant="dark" @click="copySource" ref="copyInBufferBtn">
                  <i class="fas fa-clipboard mr-2"></i>Скопировать
                </b-button>
              </template>
            </b-modal>

          </b-card-text>

        </b-tab>

        <template slot="tabs-end">

          <b-nav-item
            @click.prevent="newTab"
            class="text-center"
            href="#"
          >
            <i class="fas fa-plus"></i>
          </b-nav-item>


          <b-button-group class="mt-auto top-border">
            <b-button
                v-b-tooltip="'Экспорт в JSON'"
                variant="light"
                v-if="!collapse"
                @click="downloadJSON"
            >
              <i class="fas fa-download"></i>
            </b-button>
            <b-button
                v-b-tooltip="'Импорт из JSON'"
                variant="light"
                v-if="!collapse"
                @click="uploadJSON"
            >
              <i class="fas fa-upload"></i>
            </b-button>
            <input
                class="d-none"
                type="file"
                accept="application/json"
                ref="fileInput"
            >
            <b-form-checkbox
                title="Фиксирование сайдбара"
                v-b-tooltip="'Фиксирование сайдбара'"
                button-variant="light"
                v-model="fixedSidebar"
                button
                class="flex-fill fixed-checkbox"
            >
              <i class="fas fa-thumbtack"></i>
            </b-form-checkbox>
          </b-button-group>

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
import Beautify from 'js-beautify';
import ColorPicker from '@radial-color-picker/vue-color-picker';

export default {
  name: 'app',
  components: { ColorPicker },
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
            <p>Это просто черновик для заметок, который автоматически запоминает данные в <code>LocalStorage</code> браузера, чтобы данные не потерялись ни при закрытии вкладки, ни при закрытии браузера.</p>
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
              create: this.$moment(),
              open: 0,
              focus: 0,
          }
        }
      ],
      tabIndex: 0,
      tabCounter: 1,
      activeEditor: 0,

      // options
      fixedSidebar: true,
      collapse: false,
      darkMode: false,

      // import/export data
      jsonFile: null,

      // time
      interval: null,
      inFocus: false,
      currentTabTimeDiff: '',
      currentTabTimeWhileOpen: '',
      currentTabTimeWhileFocus: '',

      // source editor
      sourceCodeEditorDataBeautify: '',
      sourceCodeEditorData: '',
      cmOptions: {
        tabSize: 2,
        mode: 'xml',
        htmlMode: true,
        matchClosing: true,
        theme: '3024-day',
        lineNumbers: true,
        line: true,
        lineWrapping: false,
        autofocus: true,
      },

      // theme colors
      color: {
        hue: 163,
        saturation: 38,
        luminosity: 62,
        alpha: 1
      },
      theme: 'mint',
      themes: [
        {
          name: 'mint',
          primary: {
            hue: 163,
            saturation: 38,
            luminosity: 62
          },
          background: '#fff',
          light: '#eee',
          gray: {
            400: "#ced4da",
            500: "#aaa",
            700: "#5a5a5a",
          },
          dark: false
        },
        {
          name: 'dark',
          primary: {
            hue: 163,
            saturation: 38,
            luminosity: 62
          },
          background: '#202020',
          light: '#eee',
          gray: {
            400: "#ced4da",
            500: "#aaa",
            700: "#5a5a5a",
          },
          dark: true
        },
      ]
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
          create: this.$moment(),
          open: 0,
          focus: 0
        }
      }
    });
  },
  mounted(){
    let that = this;

    this.interval = setInterval(() => {
      this.tick();
    }, 1000);

    document.addEventListener('showSourceModal', () => {
      this.sourceCodeEditorDataBeautify = Beautify.html(
        this.editors[this.tabIndex].data
      );
      this.$bvModal.show('sourceViewer');
      this.sourceCodeEditorData = '';
    });

    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (this.isModalOk(bvEvent, modalId)) {
        this.editors[this.tabIndex].data = this.sourceCodeEditorData;
      }
    });

    // импорт JSON
    this.$refs.fileInput.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        let file = this.files[0];

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function() {
          that.editors = JSON.parse(reader.result);
        };

        reader.onerror = function() {
          console.log(reader.error);
        };
      }
    });

    // Применение темы
    this.changeTheme('dark');
  },
  methods: {
    changeColor(hue) {
      this.color.hue = hue;

      let color = `hsl(${this.color.hue},${this.color.saturation}%,${this.color.luminosity}%)`;
      let hoverColor = `hsl(${this.color.hue},${this.color.saturation}%,${this.color.luminosity-7.5}%)`;
      let activeColor = `hsl(${this.color.hue},${this.color.saturation}%,${this.color.luminosity-10}%)`;
      let transparentColor = `hsla(${this.color.hue},${this.color.saturation}%,${this.color.luminosity}%, 0.5)`;

      let colors = [
        ['--primary', color],
        ['--primary-hover', hoverColor],
        ['--primary-active', activeColor],
        ['--primary-light', transparentColor],
      ];

      for (let item of colors) {
          document.documentElement.style.setProperty(item[0], item[1]);
      }
    },
    changeTheme(themeName) {
      let themes = this.themes.filter(theme => theme.name === themeName);
      if (themes.length < 1) return;

      let {primary, background, light, gray, dark} = themes[0];

      let color = `hsl(${primary.hue},${primary.saturation}%,${primary.luminosity}%)`;
      let hoverColor = `hsl(${primary.hue},${primary.saturation}%,${primary.luminosity-7.5}%)`;
      let activeColor = `hsl(${primary.hue},${primary.saturation}%,${primary.luminosity-10}%)`;
      let transparentColor = `hsla(${primary.hue},${primary.saturation}%,${primary.luminosity}%, 0.5)`;

      let colors = [
        ['--primary', color],
        ['--primary-hover', hoverColor],
        ['--primary-active', activeColor],
        ['--primary-light', transparentColor],
        ['--background', background],
        ['--light-hover', light],
        ['--gray-500', gray["500"]],
        ['--gray-700', gray["700"]],
      ];

      for (let item of colors) {
        document.documentElement.style.setProperty(item[0], item[1]);
      }

      if (dark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    },

    isModalOk(bvEvent, modalId) {
      return modalId === 'sourceViewer'
        && bvEvent.trigger === 'ok'
        && this.sourceCodeEditorData;
    },
    copySource() {
      if (navigator.clipboard === undefined) {
        this.$bvToast.toast(`Невозможно скопировать в буфер обмена из отсутствия HTTPS`, {
            title: 'Ошибка',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'danger',
            toaster: 'b-toaster-top-center'
        });

        return;
      }

      navigator.clipboard.writeText(
        (this.sourceCodeEditorData)
          ? this.sourceCodeEditorData
          : this.sourceCodeEditorDataBeautify
      )
        .then(() => {
          this.$bvToast.toast(`Исходный код скопирован`, {
            title: 'Уведомление',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'success',
            toaster: 'b-toaster-top-center'
          })
        })
        .catch(err => {
          this.$bvToast.toast(`Произошла ошибка при копировании в буфер`, {
            title: 'Ошибка',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'danger',
            toaster: 'b-toaster-top-center'
          });
          console.error('Произошла ошибка при копировании в буфер', err);
        });
    },

    onCmCodeChange(data) {
      this.sourceCodeEditorData = data;
    },
    onCmReady() {

    },

    downloadJSON() {
      let blob = new Blob([JSON.stringify(this.editors)], {type : 'application/json'});
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'draft.json';
      link.click();
    },
    uploadJSON() {
      this.$refs.fileInput.click();
    },
    loadFile(input) {
      console.log(input);
    },
    changeData() {
      if (!document.hidden) {
        localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
      }
    },

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
    toggleSidebar() {
      this.collapse = !this.collapse;
      this.$refs.tabsWrapper.$el.classList.toggle('collapse-tabs');
    },
    closeTab(x) {
      for (let editor in this.editors) {
        if(!({}).hasOwnProperty.call(this.editors, editor)) continue;

        if (parseInt(editor) === x) {
          this.editors.splice(parseInt(editor), 1);
          localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
        }
      }
    },
    newTab() {
      this.editors.push({
        id: this.tabCounter,
        name: 'Новая заметка',
        data: 'Текст заметки ' + this.tabCounter,
        time: {
          create: this.$moment(),
          open: 0,
          focus: 0
        }
      });
      this.tabCounter++;
      localStorage.setItem('multiple_cke_data', JSON.stringify(this.editors));
    },
    clickTab(tabId) {
      this.activeEditor = tabId;
    },

    tick() {
      this.editors[this.tabIndex].time.open += 1000;
      if(this.inFocus) {
        this.editors[this.tabIndex].time.focus += 1000;
      }
      this.setCurrentTabTimeWhileFocus();
      this.setCurrentTabTimeWhileOpen();
      this.setCurrentTabTimeFromCreate();
      this.changeData();
    },

    onEditorFocus() {
      this.inFocus = true;
    },
    onEditorBlur() {
      this.inFocus = false;
    },

    setCurrentTabTimeFromCreate() {
      let diffTime = this.$moment().diff(this.editors[this.tabIndex].time.create);
      let duration = this.$moment.duration(diffTime);
      let hrs = '0' + duration.hours(),
          mins = '0' + duration.minutes(),
          secs = '0' + duration.seconds();
      this.currentTabTimeDiff = hrs.slice(-2) + ':' + mins.slice(-2) + ':' + secs.slice(-2) + ' назад';
    },
    setCurrentTabTimeWhileOpen() {
      let duration = this.$moment.duration(this.editors[this.tabIndex].time.open);
      let hrs = '0' + duration.hours(),
          mins = '0' + duration.minutes(),
          secs = '0' + duration.seconds();
      this.currentTabTimeWhileOpen = hrs.slice(-2) + ':' + mins.slice(-2) + ':' + secs.slice(-2);
    },
    setCurrentTabTimeWhileFocus() {
      let duration = this.$moment.duration(this.editors[this.tabIndex].time.focus);
      let hrs = '0' + duration.hours(),
          mins = '0' + duration.minutes(),
          secs = '0' + duration.seconds();
      this.currentTabTimeWhileFocus = hrs.slice(-2) + ':' + mins.slice(-2) + ':' + secs.slice(-2);
    },
  }
}
</script>

<style>
  @import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
</style>
