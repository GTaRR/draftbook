<template>
  <div class="main">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Main"
  }
</script>

<style lang="sass">
  .main
    display: flex
    flex-direction: column
    padding: 0 1.125rem 1.125rem
</style>
