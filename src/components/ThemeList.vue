<template>
  <div class="theme-list">
    <div
      class="theme-item default"
      @click="$emit('changeTheme','default')"
      :class="{active: theme === 'default'}"
    >
      <div class="theme-item__title">Светлая</div>
      <div class="theme-wrapper">
        <div class="theme-sidebar">
          <div class="theme-sidebar__top"></div>
          <div class="theme-sidebar__bottom"></div>
        </div>
        <div class="theme-body"></div>
      </div>
    </div>

    <div
      class="theme-item colored"
      @click="$emit('changeTheme','colored')"
      :class="{active: theme === 'colored'}"
    >
      <div class="theme-item__title">Цветная</div>
      <div class="theme-wrapper">
        <div class="theme-sidebar">
          <div class="theme-sidebar__top"></div>
          <div class="theme-sidebar__bottom"></div>
        </div>
        <div class="theme-body"></div>
      </div>
    </div>

    <div
      class="theme-item dark"
      @click="$emit('changeTheme','dark')"
      :class="{active: theme === 'dark'}"
    >
      <div class="theme-item__title">Тёмная</div>
      <div class="theme-wrapper">
        <div class="theme-sidebar">
          <div class="theme-sidebar__top"></div>
          <div class="theme-sidebar__bottom"></div>
        </div>
        <div class="theme-body"></div>
      </div>
    </div>

    <div
      class="theme-item colored dark"
      @click="$emit('changeTheme','colored-dark')"
      :class="{active: theme === 'colored-dark'}"
    >
      <div class="theme-item__title">Тёмная + Цветная</div>
      <div class="theme-wrapper">
        <div class="theme-sidebar">
          <div class="theme-sidebar__top"></div>
          <div class="theme-sidebar__bottom"></div>
        </div>
        <div class="theme-body"></div>
      </div>
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

<style lang="sass">
  .theme-list
    display: flex
    body.dark &
      filter: invert(1)
  .theme-item
    & + &
      margin-left: 16px
  .theme-item__title
    margin-bottom: 8px
    text-align: center
    .active &
      color: var(--primary)
  .theme-wrapper
    display: flex
    width: 220px
    height: 160px
    outline: 1px solid #ccc
    cursor: pointer
    background-color: #fff
    transition: all .2s
    &:hover
      opacity: 0.85
    .active &
      outline: 2px solid var(--primary)
  .theme-sidebar
    width: 20%
    display: flex
    flex-direction: column
    background-color: #f8f9fa
    &__top
      height: 20%
      background-color: var(--primary)
    .theme-item.dark &
      background-color: #2d2d2d
    .theme-item.colored &
      background-color: var(--primary-light)
  .theme-body
    width: 80%
    .theme-item.dark &
      background-color: #202020

  body.dark
    .theme-list
      filter: invert(1)
    .theme-wrapper
      outline: 1px solid #202020
    .rcp
      filter: invert(1)
    .theme-item__title
      color: var(--gray-700)

    .theme-item.active
      .theme-wrapper
        outline: 2px solid var(--primary)
      .theme-item__title
        color: var(--primary)

  @media (max-width: 767px)
    .theme-list
      flex-direction: column
    .theme-item + .theme-item
      margin-left: 0
    .theme-item__title
      margin-top: 6px
      text-align: left
</style>
