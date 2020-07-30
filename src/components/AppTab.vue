<template>
  <div class="tab-item" :class="{active}">
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
    padding: 1rem 1.5rem

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
      &:hover
        background-color: var(--light-hover)
    .tab-title
      text-overflow: ellipsis
      white-space: nowrap
      overflow: hidden
      line-height: 1.95rem

  .tab-plus
    justify-content: center
    align-items: center
</style>
