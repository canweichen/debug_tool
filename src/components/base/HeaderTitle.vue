<template>
  <el-page-header @back="goBack">
    <template #content>
      <h3 class="text-large font-800 mr-3">{{ pageTitle }}</h3>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  pageTitle: String
})
const goBack = () => history.back()
</script>

<style scoped></style>
