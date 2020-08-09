<template>
    <label
      class="checkbox-button"
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
    height: 38px
    padding: .375rem .75rem
    margin-bottom: 0

    display: inline-flex
    align-items: center
    justify-content: center
    flex: 1 1 auto

    background-color: var(--light)
    color: var(--link)
    border: 1px solid var(--light)
    border-radius: 0

    font-size: 1rem
    line-height: 1.5
    text-align: center
    vertical-align: middle
    user-select: none
    cursor: pointer

    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out, -webkit-box-shadow .15s ease-in-out
    &:hover
      color: var(--link)
      background-color: var(--light-hover)
      border-color: var(--light-hover)
    &:focus
      box-shadow: 0 0 0 4px var(--light-active)
    &:not(:disabled):not(.disabled)
      &.active, &:active
        background-color: var(--light-active)
        border-color: var(--light-active)
        color: var(--link)
        i
          filter: saturate(1.5) brightness(1.15)
  input
    position: absolute
    clip: rect(0,0,0,0)
    pointer-events: none
</style>
