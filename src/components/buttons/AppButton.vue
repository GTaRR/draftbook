<template>
  <button
    @click="$emit('click')"
    type="button"
    class="btn btn-light"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "AppButton"
}
</script>

<style lang="sass">

</style>