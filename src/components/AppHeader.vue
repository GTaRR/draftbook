<template>
  <header class="main-header">
    <button class="main-header__btn btn btn-primary"
            @click="toggleSidebar"
    ><i class="fas fa-bars"></i></button>
    <span class="main-header__title">Draftbook</span>
  </header>
</template>

<script>
  export default {
    name: "Header",
    methods: {
      toggleSidebar() {
        this.$emit('toggleSidebar');
        this.$parent.$parent.$refs.tabsWrapper.$el.classList.toggle('collapse-tabs');
      },
    }
  }
</script>

<style lang="sass">
  .main-header
    width: 100%
    padding: 1rem
    display: flex
    align-items: center
    position: relative
    //background-color: #{"rgba("}var(--primary-rgb), .75#{")"}
    background-color: #fff
    &:before
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: var(--primary)
      opacity: .75
    & > *
      position: relative
      z-index: 1

    &__btn
      display: inline-block
      padding: .375rem .75rem
      margin-right: 1rem

      font-weight: 400
      text-align: center
      vertical-align: middle
      user-select: none
      color: var(--white)
      font-size: 1rem
      line-height: 1.5

      background-color: var(--primary)
      border: 1px solid var(--primary)
      border-radius: 0
      cursor: pointer
      outline: none

      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out
      &:focus
        outline: none

    &__title
      transition: all .6s
      width: 155px
      opacity: 1
      overflow: hidden
      white-space: nowrap
      letter-spacing: 5px
      text-transform: uppercase
      color: #fff
      font-size: 1.25rem
</style>
