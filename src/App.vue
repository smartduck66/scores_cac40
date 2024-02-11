<script setup lang="ts">
// Note sur la performance (Inspired from )https://vuejs.org/guide/best-practices/performance.html) : dynamic component loading through the App
// A separate chunk is created for each component and its dependencies. It is only fetched on demand when the async component is rendered on the page.
import { defineAsyncComponent } from "vue";
const Masthead = defineAsyncComponent(() => import("./components/Masthead.vue"));
</script>

<template>
  <Masthead />
</template>

<style></style>
