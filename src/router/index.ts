import { createRouter, createWebHistory } from 'vue-router'
import LoginService from '@/services/invoices/loginService'
import HomeView from '../views/HomeView.vue'
import QuoteLogView from '@/views/QuoteLogView.vue'
import LoginView from '@/views/LoginView.vue'
import DriverList from '@/views/drivers/DriverListView.vue'
import UserRequestLog from '@/views/records/UserRequestLogView.vue'
import UserRpcLog from '@/views/records/UserRpcLogView.vue'
import TimerTool from '@/views/tools/TimerToolView.vue'
import LocationTimerTool from '@/views/tools/LocationTimerToolView.vue'
import SyncTripToBNP from '@/views/records/SyncTripToBNPView.vue'
import AccList from '@/views/drivers/AccListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/tool',
      name: 'tool',
      component: () => import('../views/ToolView.vue')
    },
    {
      path: '/compareBalance',
      name: 'compareBalance',
      component: () => import('../views/CompareBalanceView.vue')
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DebugView.vue')
    },
    {
      path: '/quoteLog',
      name: 'quoteLog',
      component: QuoteLogView
    },
    {
      path: '/invoiceLog',
      name: 'invoiceLog',
      component: () => import('../views/InvoiceLogView.vue')
    },
    {
      path: '/driver/list',
      name: 'driverList',
      component: DriverList
    },
    {
      path: '/logs/userRequestLog',
      name: 'userRequestLog',
      component: UserRequestLog
    },
    {
      path: '/logs/userRpcLog',
      name: 'userRpcLog',
      component: UserRpcLog
    },
    {
      path: '/tools/timer',
      name: 'timerTool',
      component: TimerTool
    },
    {
      path: '/tools/location',
      name: 'locationTimerTool',
      component: LocationTimerTool
    },
    {
      path: '/logs/syncTripToBNP',
      name: 'syncTripToBNP',
      component: SyncTripToBNP
    },
    {
      path: '/driver/acc/list',
      name: 'AccList',
      component: AccList
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 假设你有一个检查用户登录状态的函数
  const isLoggedIn = LoginService.checkUserLoginStatus()

  if (to.path === '/login' && isLoggedIn) {
    // 如果用户已登录，重定向到首页
    next('/')
  } else if (to.path !== '/login' && !isLoggedIn) {
    // 如果用户未登录，重定向到登录页面
    next('/login')
  } else {
    next() // 确保总是调用 next()
  }
})

export default router
