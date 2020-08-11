<template>
  <div class="main">
    <slot>
      <div class="main__empty">
        Не создано ни одной заметки<br>
        создайте новую при помощи кнопки <b>+</b>
      </div>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "Main"
  }
</script>

<style lang="sass">
  .main
    display: flex
    flex-direction: column
    padding: 0 1.125rem 1.125rem
    flex: 1 1 auto
    margin-left: 256px
    transition: margin-left .6s ease-in-out
    &__empty
      text-align: center
      color: #888
      padding-top: 3rem
    .sidebar--collapse + &
      margin-left: 72px
</style>
