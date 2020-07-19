<template>
  <div class="mt-3 app-timers">
    <span class="mr-2">
      <span class="text-dark mr-2">Заметка создана:</span>
      <span
        class="text-primary mr-2"
        v-b-tooltip.hover
        :title="editor.time.create | moment('Do MMMM YYYY, H:mm:ss')"
      >
        {{ currentTabTimeDiff }}
      </span>
    </span>
    <span class="mr-2">
      <span class="text-dark mr-2">Заметка открыта:</span>
      <span class="text-primary mr-2">{{ currentTabTimeWhileOpen }}</span>
    </span>
    <span class="mr-2">
      <span class="text-dark mr-2">Поле в фокусе:</span>
      <span class="text-primary">{{ currentTabTimeWhileFocus }}</span>
    </span>
  </div>
</template>

<script>
  export default {
    name: "Timers",
    props: ['editor', 'currentTabTimeDiff', 'currentTabTimeWhileOpen', 'currentTabTimeWhileFocus']
  }
</script>

<style scoped lang="sass">
  .app-timers
    display: flex
    align-items: center
    flex-wrap: wrap
  @media (max-width: 767px)
    .app-timers
      flex-direction: column
      align-items: flex-start
</style>
