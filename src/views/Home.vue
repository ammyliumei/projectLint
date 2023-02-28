<template>
  <a-menu
    style="width: 200px"
    id="dddddd"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    @click="handleClick"
  >
    <a-sub-menu key="sub1" @titleClick="titleClick">
      <template #icon>
        <component :is="PlusOutlined"></component>
      </template>
      <template #title>新建设计</template>
    </a-sub-menu>
    <a-sub-menu key="sub2" @titleClick="titleClick">
      <template #icon> </template>
      <template #title>其他管理页面</template>
      <a-sub-menu key="5">
        <template #icon>
          <component :is="PlusOutlined"></component>
        </template>
        <template #title>新建设计</template>
      </a-sub-menu>
      <a-menu-item key="6">page 2</a-menu-item>
      <a-sub-menu key="sub3" title="Submenu">
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>
      </a-sub-menu>
    </a-sub-menu>
  </a-menu>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons-vue";

const selectedKeys = ref<string[]>(["1"]);
const openKeys = ref<string[]>(["sub1"]);
const handleClick = (e: Event) => {
  console.log("click", e);
};
const titleClick = (e: Event) => {
  console.log("titleClick", e);
};
watch(
  () => openKeys,
  (val) => {
    console.log("openKeys", val);
  }
);
</script>
