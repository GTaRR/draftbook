<template>
  <div class="theme-list">
    <div
      class="theme-item default"
      @click="$emit('changeTheme','default')"
      :class="{active: theme === 'default'}"
    >
      <div class="theme-sidebar">
        <div class="theme-sidebar__top"></div>
        <div class="theme-sidebar__bottom"></div>
      </div>
      <div class="theme-body"></div>
    </div>

    <div
      class="theme-item colored"
      @click="$emit('changeTheme','colored')"
      :class="{active: theme === 'colored'}"
    >
      <div class="theme-sidebar">
        <div class="theme-sidebar__top"></div>
        <div class="theme-sidebar__bottom"></div>
      </div>
      <div class="theme-body"></div>
    </div>

    <div
      class="theme-item dark"
      @click="$emit('changeTheme','dark')"
      :class="{active: theme === 'dark'}"
    >
      <div class="theme-sidebar">
        <div class="theme-sidebar__top"></div>
        <div class="theme-sidebar__bottom"></div>
      </div>
      <div class="theme-body"></div>
    </div>

    <div
      class="theme-item colored dark"
      @click="$emit('changeTheme','colored-dark')"
      :class="{active: theme === 'colored-dark'}"
    >
      <div class="theme-sidebar">
        <div class="theme-sidebar__top"></div>
        <div class="theme-sidebar__bottom"></div>
      </div>
      <div class="theme-body"></div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'color',
        'darkMode',
        'coloredMode',
        'customColor',
        'theme',
        'themes'
      ])
    },
  }
</script>
