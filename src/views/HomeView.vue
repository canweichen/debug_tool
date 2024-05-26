<template>
  <el-page-header @back="goBack">
    <template #content>
      <h3 class="text-large font-800 mr-3">Home Page</h3>
    </template>
  </el-page-header>
  <main style="margin-top: 20px; margin-left: 30px">
    <TheWelcome />
  </main>
</template>

<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
const goBack = () => history.back()
</script>
