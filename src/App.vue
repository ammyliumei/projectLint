<script setup>
import Home from "./views/Home.vue";
</script>

<template>
  <div>
    <Home></Home>
  </div>
</template>

<style scoped lang="scss">
#scss {
  background-color: $bg_color;
  @include box-shadow();
}
/* 深度选择器 */
:deep(selector) {
  /* ... */
}

/* 插槽选择器 */
:slotted(selector) {
  /* ... */
}

/* 全局选择器 */
:global(selector) {
  /* ... */
}
</style>
