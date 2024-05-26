<template>
  <el-container class="layout-container-demo" style="height: 728px">
    <el-aside width="200px" class="layoutAside">
      <el-scrollbar>
        <!-- <el-menu :default-openeds="['0']"> -->
        <el-menu :default-active="$route.path" :default-openeds="openedMenus">
          <template v-for="menu in menuList" :key="menu.menu_id">
            <el-sub-menu v-if="menu.sub_menu.length > 0" :index="menu.menu_id.toString()">
              <template #title>
                <el-icon
                  ><Lock v-if="menu.menu_id == 1" />
                  <Finished v-else-if="menu.menu_id == 2" />
                  <message v-else-if="menu.menu_id == 3" />
                  <setting v-else-if="menu.menu_id == 4" />
                </el-icon>
                {{ menu.menu_name }}
              </template>
              <el-menu-item
                v-for="subMenu in menu.sub_menu"
                :key="subMenu.menu_id"
                :index="`${menu.menu_id}-${subMenu.menu_id}`"
              >
                <RouterLink :to="subMenu.menu_url">{{ subMenu.menu_name }}</RouterLink>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.menu_url || '/'">
              <el-icon><icon-menu /></el-icon>
              <RouterLink :to="menu.menu_url">{{ menu.menu_name }}</RouterLink>
            </el-menu-item>
          </template>
          <!-- </el-menu> -->
          <!-- <el-menu :default-active="$route.path" router>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <el-menu-item v-if="!menuItem.sub_menu.length" :index="menuItem.menu_url || '/'">
              {{ menuItem.menu_name }}
            </el-menu-item>
            <el-submenu v-else :index="menuItem.menu_name">
              <template #title>{{ menuItem.menu_name }}</template>
              <el-menu-item
                v-for="(subMenuItem, subIndex) in menuItem.sub_menu"
                :key="subIndex"
                :index="subMenuItem.menu_url || '/'"
              >
                {{ subMenuItem.menu_name }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu> -->
          <!-- <el-sub-menu v-for="menu in menuList" :key="menu.menu_id">
            <template #title>
              <el-icon><icon-menu /></el-icon>{{ menu.menu_name }}
              <el-menu-item-group title="" v-if="menu.sub_menu.length > 0">
                <el-menu-item
                  v-for="item in menu"
                  :key="item.menu_id"
                  :index="menu.menu_id + '-' + item.menu_id"
                  ><RouterLink :to="item.menu_url">{{ item.menu_name }}</RouterLink>
                </el-menu-item>
              </el-menu-item-group>
            </template>
          </el-sub-menu> -->

          <!-- <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>Invoice
            </template>
            <el-menu-item-group title="">
              <template #title>Group 1</template>
              <el-menu-item index="1-1"><RouterLink to="/">Home</RouterLink></el-menu-item>
              <el-menu-item index="1-2"
                ><RouterLink to="/dashboard">Dashboard</RouterLink></el-menu-item
              >
              <el-menu-item index="1-3"><RouterLink to="/about">About</RouterLink></el-menu-item>
              <el-menu-item index="1-4"><RouterLink to="/tool">SyncToBNP</RouterLink></el-menu-item>
              <el-menu-item index="1-5"
                ><RouterLink to="/compareBalance">CompareBalance</RouterLink></el-menu-item
              >
              <el-menu-item index="1-6"
                ><RouterLink to="/quoteLog">QuoteLog</RouterLink></el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>Tools
            </template>
            <el-menu-item index="2-1"
              ><RouterLink to="/invoiceLog">InvoiceLog</RouterLink></el-menu-item
            >
            <el-menu-item-group title="Group 2">
              <el-menu-item index="2-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>Option 4</template>
              <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>Outbound API
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="3-1">
                <RouterLink to="/driver/list">Driver Manager</RouterLink>
              </el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>Option 4</template>
              <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu> -->
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="35" height="35" /> -->
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item @click="loginService.handleLogOut">Log out</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ username }}</span>
        </div>
      </el-header>

      <el-main class="layout-main">
        <el-scrollbar>
          <RouterView />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Menu as IconMenu, Message, Setting, Finished, Lock } from '@element-plus/icons-vue'
import loginService from '@/services/invoices/loginService'

const openedMenus = ref<string[]>(['0'])
const username = ref<string>(sessionStorage.getItem('user-name') || '')
interface MenuItem {
  menu_id: number
  menu_name: string
  menu_url: string
  sub_menu: MenuItem[]
}

const menuList: MenuItem[] = [
  {
    menu_id: 0,
    menu_name: 'Dashboard',
    menu_url: '/',
    sub_menu: []
  },
  {
    menu_id: 1,
    menu_name: 'Log Manager',
    menu_url: '',
    sub_menu: [
      { menu_id: 10001, menu_name: 'Transfer', menu_url: '/tool', sub_menu: [] },
      { menu_id: 10002, menu_name: 'Invoices', menu_url: '/invoiceLog', sub_menu: [] },
      { menu_id: 10003, menu_name: 'Quotes', menu_url: '/quoteLog', sub_menu: [] },
      { menu_id: 10008, menu_name: 'UserRequest', menu_url: '/logs/userRequestLog', sub_menu: [] },
      { menu_id: 10009, menu_name: 'UserRpcLog', menu_url: '/logs/userRpcLog', sub_menu: [] },
      { menu_id: 10012, menu_name: 'Trips', menu_url: '/logs/syncTripToBNP', sub_menu: [] }
    ]
  },
  {
    menu_id: 2,
    menu_name: 'Invoice Manager',
    menu_url: '',
    sub_menu: [{ menu_id: 10004, menu_name: 'Payments', menu_url: '/compareBalance', sub_menu: [] }]
  },
  {
    menu_id: 3,
    menu_name: 'Outbound API',
    menu_url: '',
    sub_menu: [{ menu_id: 10005, menu_name: 'Driver', menu_url: '/driver/list', sub_menu: [] }]
  },
  {
    menu_id: 4,
    menu_name: 'Tools',
    menu_url: '',
    sub_menu: [
      { menu_id: 10006, menu_name: 'Form', menu_url: '/about', sub_menu: [] },
      { menu_id: 10007, menu_name: 'Attention', menu_url: '/home', sub_menu: [] },
      { menu_id: 10010, menu_name: 'TimerTool', menu_url: '/tools/timer', sub_menu: [] },
      { menu_id: 10011, menu_name: 'LocationTimerTool', menu_url: '/tools/location', sub_menu: [] }
    ]
  }
]
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.layoutAside a {
  text-decoration: none;
  color: black;
}
.logo {
  margin: 0 2rem 0 3rem;
}
.layout-main {
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 20px;
}
</style>
