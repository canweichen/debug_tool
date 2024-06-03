<template>
  <el-container class="layout-container-demo" style="height: 728px">
    <el-aside width="200px" class="layoutAside">
      <el-scrollbar>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="35" height="35" />
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          :default-active="state_current_index"
          :default-openeds="openedMenus"
          text-color="#ffffff"
          @close="handleClose"
        >
          <template v-for="menu in menuList" :key="menu.menu_id">
            <el-sub-menu v-if="menu.sub_menu.length > 0" :index="menu.menu_id">
              <template #title>
                <!-- 动态加载图标组件 -->
                <el-icon>
                  <component :is="menu.menu_icon" />
                </el-icon>
                {{ menu.menu_name }}
              </template>
              <el-menu-item
                v-for="subMenu in menu.sub_menu"
                :key="subMenu.menu_id"
                :index="`${menu.menu_id}-${subMenu.menu_id}`"
              >
                <el-icon>
                  <component :is="subMenu.menu_icon" />
                </el-icon>
                <RouterLink :to="subMenu.menu_url">{{ subMenu.menu_name }}</RouterLink>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.menu_id">
              <el-icon><component :is="menu.menu_icon" /></el-icon>
              <RouterLink :to="menu.menu_url">{{ menu.menu_name }}</RouterLink>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px; font-size: 16px; color: white">
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
          <span style="font-size: 16px">
            <el-icon class="el-icon--left"><User /></el-icon>
            {{ username }}
          </span>
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
import { RouterView } from 'vue-router'
import {
  Menu as IconMenu,
  Document,
  Location,
  Setting,
  House,
  Service,
  Pointer,
  Star,
  Notification,
  Connection,
  ChatDotRound,
  Clock,
  Odometer,
  ChatSquare,
  ChatRound,
  ChatLineRound,
  ChatLineSquare,
  View,
  Unlock,
  Aim,
  CirclePlus,
  User
} from '@element-plus/icons-vue'
import loginService from '@/services/invoices/loginService'

const username = ref<string>(sessionStorage.getItem('user-name') || '')
const state_current_index = ref<string>('1')
const openedMenus = ref(['0'])
type VueComponent = typeof Document
interface MenuItem {
  menu_id: string
  menu_name: string
  menu_url: string
  menu_icon: VueComponent
  sub_menu: MenuItem[]
}

const menuList: MenuItem[] = [
  {
    menu_id: '0',
    menu_name: 'Dashboard',
    menu_url: '/',
    menu_icon: Document,
    sub_menu: []
  },
  {
    menu_id: '1',
    menu_name: 'Log Manager',
    menu_url: '',
    menu_icon: Location,
    sub_menu: [
      {
        menu_id: '10001',
        menu_name: 'Transfer',
        menu_url: '/tool',
        menu_icon: House,
        sub_menu: []
      },
      {
        menu_id: '10002',
        menu_name: 'Invoices',
        menu_url: '/invoiceLog',
        menu_icon: Service,
        sub_menu: []
      },
      {
        menu_id: '10003',
        menu_name: 'Quotes',
        menu_url: '/quoteLog',
        menu_icon: Pointer,
        sub_menu: []
      },
      {
        menu_id: '10008',
        menu_name: 'UserRequest',
        menu_url: '/logs/userRequestLog',
        menu_icon: Star,
        sub_menu: []
      },
      {
        menu_id: '10009',
        menu_name: 'UserRpcLog',
        menu_url: '/logs/userRpcLog',
        menu_icon: Notification,
        sub_menu: []
      },
      {
        menu_id: '10012',
        menu_name: 'Trips',
        menu_url: '/logs/syncTripToBNP',
        menu_icon: Connection,
        sub_menu: []
      }
    ]
  },
  {
    menu_id: '2',
    menu_name: 'Invoice Manager',
    menu_url: '',
    menu_icon: IconMenu,
    sub_menu: [
      {
        menu_id: '10004',
        menu_name: 'Payments',
        menu_url: '/compareBalance',
        menu_icon: ChatDotRound,
        sub_menu: []
      }
    ]
  },
  {
    menu_id: '3',
    menu_name: 'Outbound API',
    menu_url: '',
    menu_icon: Clock,
    sub_menu: [
      {
        menu_id: '10005',
        menu_name: 'Driver',
        menu_url: '/driver/list',
        menu_icon: Odometer,
        sub_menu: []
      },
      {
        menu_id: '10013',
        menu_name: 'Acc Setup',
        menu_url: '/driver/acc/list',
        menu_icon: ChatSquare,
        sub_menu: []
      }
    ]
  },
  {
    menu_id: '4',
    menu_name: 'Tools',
    menu_url: '',
    menu_icon: ChatRound,
    sub_menu: [
      {
        menu_id: '10014',
        menu_name: 'Fail Invoice',
        menu_url: '/invoice/fail/list',
        menu_icon: Aim,
        sub_menu: []
      },
      {
        menu_id: '10015',
        menu_name: 'Gira Ticket',
        menu_url: '/gira/ticket/list',
        menu_icon: CirclePlus,
        sub_menu: []
      },
      {
        menu_id: '10006',
        menu_name: 'Form',
        menu_url: '/about',
        menu_icon: ChatLineRound,
        sub_menu: []
      },
      {
        menu_id: '10007',
        menu_name: 'Attention',
        menu_url: '/home',
        menu_icon: ChatLineSquare,
        sub_menu: []
      },
      {
        menu_id: '10010',
        menu_name: 'TimerTool',
        menu_url: '/tools/timer',
        menu_icon: View,
        sub_menu: []
      },
      {
        menu_id: '10011',
        menu_name: 'LocationTimerTool',
        menu_url: '/tools/location',
        menu_icon: Unlock,
        sub_menu: []
      }
    ]
  }
]

//监听当前选中菜单

const handleClose = (key: string, keyPath: string[]) => {
  console.log('close', key, keyPath)
  openedMenus.value = keyPath
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background: #545c64;
  /* background-color: var(--el-color-primary-light-7); */
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: #545c64;
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
  color: white;
}
.layoutAside a {
  text-decoration: none;
  color: white;
}
.logo {
  margin: 20px 2rem 0 3rem;
}
.layout-main {
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 20px;
}
.el-menu-item.is-active a {
  color: #ffd048;
}
</style>
