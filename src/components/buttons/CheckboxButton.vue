<template>
    <label
      class="checkbox-button btn btn-light"
      :class="{ active: value }"
      v-b-tooltip
      :title="title"
    >
      <input
        type="checkbox"
        autocomplete="off"
        :checked="value"
        @change="$emit('input', $event.target.checked)"
      />
      <slot></slot>
    </label>
</template>

<script>
export default {
  name: "CheckboxButton",
  props: ['title', 'value']
}
</script>

<style scoped lang="sass">
  label.checkbox-button
    margin-bottom: 0
  input
    position: absolute
    clip: rect(0,0,0,0)
    pointer-events: none
</style>
