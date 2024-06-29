<template>
  <div v-if="true" class="full-page-background">
    <el-form ref="loginForm" class="login-form" :model="user">
      <el-text style="font-size: 20px; color: white">Tools Center Login</el-text>
      <el-form-item
        prop="username"
        :rules="[
          { required: true, message: 'Please input username', trigger: 'blur' },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['change']
          }
        ]"
      >
        <label class="text-white-bg">Username:</label>
        <el-input v-model="user.username" placeholder="Please username" />
      </el-form-item>
      <el-form-item
        prop="password"
        :rules="[{ required: true, message: 'Please input password', trigger: 'blur' }]"
      >
        <label class="text-white-bg">Password:</label>
        <el-input v-model="user.password" type="password" placeholder="Please password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login(loginForm)">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const loginForm = ref<FormInstance>()
const user = reactive({
  username: 'alex.chen@unisco.com',
  password: ''
})
//提交form表单到后台
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      submitForm(user)
    } else {
      console.log('error submit!', fields)
    }
  })
}

async function submitForm(formData: any) {
  // 这里是异步API调用提交表单数据的示例
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await response.json()
    const UserID = data.UserID
    const UserToken = data.UserToken
    const UserName = data.UserFirstLast
    console.log(btoa(UserID + ':' + UserToken))
    if (response.ok) {
      if (
        UserToken == '' ||
        UserID == '' ||
        UserToken == null ||
        UserID == null ||
        UserToken == undefined ||
        UserID == undefined
      ) {
        ElMessage.error('Oops, your username or password is incorrect.')
        return
      }
      // 处理登录成功的逻辑
      sessionStorage.setItem(
        'user-token',
        btoa(
          JSON.stringify({
            token: btoa(UserID + ':' + UserToken),
            expired: Date.now() + 1000 * 60 * 60
          })
        )
      )
      sessionStorage.setItem('user-name', UserName)
      // 跳转到首页
      window.location.href = '/'
    } else {
      // 处理登录失败的逻辑
      ElMessage.error('Oops, your username or password is incorrect.')
    }
  } catch (error) {
    ElMessage.error('Error: Login failed. Please try again later.')
  }
}
</script>

<style scoped>
.full-page-background {
  width: 100vw; /* 视口的宽度 */
  height: 100vh; /* 视口的高度 */
  background-image: url('@/assets/images/snow.jpg');
  background-size: cover; /* 或者使用 'contain' 或 'repeat' */
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-white-bg {
  color: white;
}
</style>
