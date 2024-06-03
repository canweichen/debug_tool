<template>
  <headerTitle :pageTitle="pageTitle" />
  <el-calendar>
    <template #date-cell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>
    </template>
  </el-calendar>

  <el-row>
    <el-col :span="6">
      <el-statistic title="Total Number" :value="state.totalNumber" />
    </el-col>
    <el-col :span="6">
      <el-statistic :value="state.successedNumber">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            Successed Number
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix></template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
      <el-statistic title="Failed Number" :value="state.failedNumber" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Processed Number" :value="state.processedNumber">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <el-statistic title="Daily active users" :value="268500" />
    </el-col>
    <el-col :span="6">
      <el-statistic :value="138">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            Ratio of men to women
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix></template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
      <el-statistic title="Total Transactions" :value="outputValue" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Feedback number" :value="562">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useTransition } from '@vueuse/core'
import { ChatLineRound, Male } from '@element-plus/icons-vue'
import headerTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'

interface State {
  totalNumber: number
  successedNumber: number
  failedNumber: number
  processedNumber: number
  timer: any
  isClose: boolean
}
const state = reactive<State>({
  totalNumber: 0,
  successedNumber: 0,
  failedNumber: 17200,
  processedNumber: 0,
  timer: null,
  isClose: false
})
const source = ref(0)
const pageTitle = ref('Dashboard')
const outputValue = useTransition(source, {
  duration: 1500
})
source.value = 172000
onMounted(() => {
  getSummaries()
})

function getSummaries() {
  const invoiceSer = new InvoiceService()
  invoiceSer.getSummaryData().then(
    (result) => {
      const data = result.data
      state.totalNumber = data.total
      state.successedNumber = data.success
      state.failedNumber = data.fail
      state.processedNumber = data.process
    },
    (error) => {
      console.log(error)
    }
  )
}
</script>

<style scoped>
.el-col {
  text-align: center;
  margin-top: 20px;
}
.is-selected {
  color: #1989fa;
}
</style>
