<template>
  <div class="timers">
    <span class="timers__item">
      <span class="timers__label">Заметка создана:</span>
      <span
        class="timers__time"
        v-b-tooltip.hover
        :title="currentTabTimeDiff"
      >{{ editor.time.create | moment('Do MMMM YYYY, H:mm:ss') }}</span>
    </span>
    <span class="timers__item">
      <span class="timers__label">Заметка открыта:</span>
      <span class="timers__time">{{ currentTabTimeWhileOpen }}</span>
    </span>
    <span class="timers__item">
      <span class="timers__label">Поле в фокусе:</span>
      <span class="timers__time">{{ currentTabTimeWhileFocus }}</span>
    </span>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return { moment };
  },
  props: {
    editor: Object,
    currentTabTimeDiff: String,
    currentTabTimeWhileOpen: String,
    currentTabTimeWhileFocus: String,
  },
}
</script>

<style scoped lang="scss">
.timers {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 1rem 0;

  &__item:not(:last-child) {
    margin-right: 1rem;
  }
  &__label {
    color: var(--gray-800);
    margin-right: .5rem;
  }
  &__time {
    color: var(--primary);
    margin-right: .5rem;
  }
  @media (max-width: 767px) {
    .timers {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
