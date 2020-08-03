<template>
  <div class="tab-list">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Tabs"
  }
</script>

<style lang="sass">
  .tab-list
    display: flex
    flex-direction: column
</style>
