<template>
  <div class="tab-list" ref="tabList">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import SimpleScrollbar from 'simple-scrollbar';

const tabList = ref(null);

onMounted(() => {
  SimpleScrollbar.initEl(tabList.value);
});
</script>

<style lang="scss">
@import 'simple-scrollbar/simple-scrollbar.css';

.tab-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100vh - 70px - 38px);

  .ss-content {
    max-height: calc(100vh - 70px - 38px);
  }
}
</style>
