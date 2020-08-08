<template>
  <button
    @click="$emit('click')"
    type="button"
    class="btn"
    :class="btnClass"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: ['variant'],
  computed: {
    btnClass() {
      return (this.variant) ? 'btn-' + this.variant : ''
    }
  }
}
</script>

<style lang="sass">

</style>
