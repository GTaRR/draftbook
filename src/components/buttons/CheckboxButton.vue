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

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: String,
  value: Boolean,
});
</script>

<style scoped lang="scss">
label.checkbox-button {
  margin-bottom: 0;
}
input {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}
</style>
