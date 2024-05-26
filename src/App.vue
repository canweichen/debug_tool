<template>
  <div v-if="!LoginService.checkUserLoginStatus()" class="full-page-background">
    <RouterView />
  </div>
  <div v-else>
    <MenuList />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import LoginService from './services/invoices/loginService'
import MenuList from './components/base/MenuLst.vue'
</script>

<style scoped></style>
