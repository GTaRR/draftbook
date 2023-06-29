<template>
  <div class="btn-group top-border">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.btn-group {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  width: 100%;
}
.btn-group > .btn {
  position: relative;
  flex: 1 1 auto;
}
.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}
.btn-group>.btn.active, .btn-group>.btn:active, .btn-group>.btn:focus, .btn-group>.btn:hover {
  z-index: 1;
}
</style>
