<template>
  <div class="tab-item" :class="{ active }" @click="$emit('click', $event)">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  active: Boolean,
});
</script>

<style lang="scss">
.tab-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 256px;
  height: 64px;
  padding: 1rem 1.5rem 1rem .5rem;

  color: var(--link);
  background-color: var(--light);
  border-bottom: 1px solid var(--light-hover);
  border-radius: 0;

  cursor: pointer;
  transition: all .3s, width .6s ease-in-out;
  outline: none;
  position: relative;
  //&:not(:last-child) {
  //  border-bottom: 1px solid var(--light-hover);
  //}
  &:hover {
    background-color: var(--light-hover);
    color: var(--link-hover);

    .drag-icon {
      opacity: .7;
    }
  }

  &.active {
    background-color: var(--primary);
    color: var(--white);

    .tab-close {
      background-color: var(--primary);

      &:hover {
        background-color: var(--primary-hover);
      }
    }
  }

  &:focus {
    outline: none;
  }

  .tab-close {
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem;
    background-color: var(--light);
    transition: all .3s;
    margin-left: auto;

    &:hover {
      background-color: var(--light-hover)
    }
  }

  .tab-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.95rem;
    margin-left: 1rem;
    user-select: none;
  }

  .drag-icon {
    opacity: 0;
    cursor: grab;
    transition: opacity .3s;
    position: absolute;
    top: 50%;
    left: .5rem;
    transform: translateY(-50%);
  }
}
.tab-plus {
  justify-content: center;
  align-items: center;
}
</style>
