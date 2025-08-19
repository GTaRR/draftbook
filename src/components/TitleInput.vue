<template>
  <input
    type="text"
    class="form-control editor-title"
    :value="value"
    :placeholder="placeholder"
    ref="input"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script setup>
import { defineProps, ref, defineExpose } from 'vue';

defineProps({
  value: String,
  placeholder: String,
});

defineEmits(['input']);

const input = ref(null);

// eslint-disable-next-line no-unused-vars
function focus() {
  input.value.focus();
}
defineExpose({
  focus,
});
</script>

<style lang="scss">
.editor-title {
  display: block;
  width: 100%;
  height: calc(1.5em + 1.175rem + 4px);
  padding: .5875rem 0;
  margin-bottom: .5rem;
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--primary);
  background-color: var(--background);
  background-clip: padding-box;
  border-bottom: 2px solid var(--gray-400);
  border-radius: 0;
  outline: none;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out, color .15s ease-in-out;

  &:focus {
    outline: none;
    color: var(--gray-700);
    border-color: var(--gray-500);
    background-color: var(--background);
  }
}
</style>
