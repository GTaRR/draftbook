<template>
  <div class="sidebar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Sidebar"
  }
</script>

<style lang="sass">
  .sidebar
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    flex: 0 0 auto
    min-height: 100vh
    width: 256px
    max-width: 256px
    padding: 0
    position: fixed
    z-index: 1
    overflow: hidden
    box-shadow: 0 0 15px -5px rgba(0,0,0,.2)
    background-color: var(--sidebar-background)
    transition: all .3s, width .6s ease-in-out
    &--collapse
      width: 72px
      display: flex
</style>
