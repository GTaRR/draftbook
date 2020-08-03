<template>
  <div class="btn-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ButtonsGroup"
}
</script>

<style lang="sass">
  .btn-group
    position: relative
    display: inline-flex
    vertical-align: middle
  .btn-group > .btn
    position: relative
    flex: 1 1 auto
  .btn:not(:disabled):not(.disabled)
    cursor: pointer
  .btn-group>.btn.active, .btn-group>.btn:active, .btn-group>.btn:focus, .btn-group>.btn:hover
    z-index: 1
</style>