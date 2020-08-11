<template>
  <div class="tab-list" ref="tabList">
    <slot></slot>
  </div>
</template>

<script>
import SimpleScrollbar from 'simple-scrollbar';
import 'simple-scrollbar/simple-scrollbar.css';

export default {
  name: "Tabs",
  mounted() {
    SimpleScrollbar.initEl(this.$refs.tabList);
  }
}
</script>

<style lang="sass">
  .tab-list
    display: flex
    flex-direction: column
    overflow: hidden
    max-height: calc(100vh - 70px - 38px)
    .ss-content
      max-height: calc(100vh - 70px - 38px)
</style>
