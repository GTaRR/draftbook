<template>
  <div class="sidebar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Sidebar",
    methods: {

    }
  }
</script>

<style lang="sass">
  .sidebar
    display: flex
    flex-direction: column
    min-height: 100vh
    width: 256px
    max-width: 256px
    transition: all .3s, width .6s ease-in-out
</style>
