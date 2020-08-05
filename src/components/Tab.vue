<template>
  <div class="tab-item" :class="{ active }" @click="$emit('click', $event)">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['active'],
    name: "Tab",
  }
</script>

<style lang="sass">
  .tab-item
    display: flex
    align-items: center
    justify-content: space-between

    width: 256px
    height: 64px
    padding: 1rem 1.5rem 1rem .5rem

    color: var(--link)
    background-color: var(--light)
    border-bottom: 1px solid var(--light-hover)
    border-radius: 0

    cursor: pointer
    transition: all .3s,width .6s ease-in-out
    //&:not(:last-child)
      border-bottom: 1px solid var(--light-hover)
    &:hover
      background-color: var(--light-hover)
      color: var(--link-hover)
      .drag-icon
        opacity: .7
    &.active
      background-color: var(--primary)
      color: var(--white)
      .tab-close
        background-color: var(--primary)

    .tab-close
      padding: .25rem .5rem
      font-size: .875rem
      line-height: 1.5
      border-radius: .2rem
      background-color: var(--light)
      transition: all .3s
      margin-left: auto
      &:hover
        background-color: var(--light-hover)
    .tab-title
      text-overflow: ellipsis
      white-space: nowrap
      overflow: hidden
      line-height: 1.95rem
      margin-left: .5rem
    .drag-icon
      opacity: 0
      cursor: grab
      transition: opacity .3s

  .tab-plus
    justify-content: center
    align-items: center
</style>
