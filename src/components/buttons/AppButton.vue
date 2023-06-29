<template>
  <button
    @click="$emit('click')"
    type="button"
    class="btn"
    :class="btnClass"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  variant: String,
});

const btnClass = computed(() => {
  return (props.variant) ? 'btn-' + props.variant : '';
});
</script>
