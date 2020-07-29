<template>
  <div class="tab-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Tab",
  }
</script>

<style lang="sass">
  .tab-item
    &:not(:last-child)
      border-bottom: 1px solid var(--light-hover)
  .tab-title
    text-overflow: ellipsis
    white-space: nowrap
    overflow: hidden
    line-height: 1.95rem
</style>
