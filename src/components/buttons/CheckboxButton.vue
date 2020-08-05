<template>
    <label
      class="checkbox-button"
      :class="{ active: value }"
      :v-b-tooltip="title"
    >
      <input
        :title="title"
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
    background-color: var(--light)
    border: 1px solid var(--light)
    color: var(--link)
    display: inline-flex
    align-items: center
    justify-content: center
    cursor: pointer
    flex: 1 1 auto
    padding: .375rem .75rem
    margin-bottom: 0
    text-align: center
    vertical-align: middle
    user-select: none
    font-size: 1rem
    line-height: 1.5
    border-radius: 0
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