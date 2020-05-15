<template>
  <div class="main-header py-3 px-3 d-flex align-items-center">
    <div class="main-header__overlay"></div>
    <button class="mr-3 btn btn-primary"
            @click="toggleSidebar"
    ><i class="fas fa-bars"></i></button>
    <span class="logo-title">Draftbook</span>
  </div>
</template>

<script>
  export default {
    name: "Header",
    methods: {
      toggleSidebar() {
        this.$emit('toggleSidebar');
        this.$parent.$parent.$refs.tabsWrapper.$el.classList.toggle('collapse-tabs');
      },
    }
  }
</script>
