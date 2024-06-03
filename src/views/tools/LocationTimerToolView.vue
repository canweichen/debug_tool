<template>
  <headerTitle :pageTitle="pageTitle" />
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

  <div style="float: right; margin-top: 20px; margin-right: 120px; margin-bottom: 20px">
    <el-button type="info" @click="getLocationList">Search</el-button>
    <el-button type="danger" @click="openAllPDF">Open All PDF</el-button>
    <el-button type="primary" v-loading="state.loading" @click="openTimer">Start Timer</el-button>
    <el-button type="warning" @click="toDo">Trigger Once</el-button>
    <el-button type="danger" @click="closeTimer">Close Timer</el-button>
  </div>

  <div class="mb-20 mt-20" style="float: right">
    <el-pagination
      v-model:current-page="pageData.currentPage"
      v-model:page-size="pageData.pageSize"
      :page-sizes="[10, 50, 100, 200]"
      :small="pageData.small"
      :disabled="pageData.disabled"
      :background="pageData.background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-table :data="state.tableData" border style="width: 100%">
    <el-table-column
      v-for="item in tableHeaders"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
    >
      <template v-slot="scope">
        <!-- 使用作用域插槽的参数scope来访问行数据 -->
        <el-text
          v-if="item.prop === 'location_status'"
          :type="scope.row[item.prop] == 1 ? 'success' : 'danger'"
        >
          {{ scope.row[item.prop] == 1 ? 'Active' : 'Inactive' }}
        </el-text>
        <el-text
          v-if="item.prop === 'location_billto'"
          :type="scope.row[item.prop] == 1 ? 'success' : 'danger'"
        >
          {{ scope.row[item.prop] == 1 ? 'Yes' : 'No' }}
        </el-text>
        <el-text
          v-if="item.prop === 'location_shipper'"
          :type="scope.row[item.prop] == 1 ? 'success' : 'danger'"
        >
          {{ scope.row[item.prop] == 1 ? 'Yes' : 'No' }}
        </el-text>
        <el-text
          v-if="item.prop === 'location_warehouse'"
          :type="scope.row[item.prop] == 1 ? 'success' : 'danger'"
        >
          {{ scope.row[item.prop] == 1 ? 'Yes' : 'No' }}
        </el-text>
        <el-text
          v-if="item.prop === 'location_carrier_type'"
          :type="
            scope.row[item.prop] == 1
              ? 'success'
              : scope.row[item.prop] == 2
                ? 'warning'
                : scope.row[item.prop] == 3
                  ? 'primary'
                  : 'danger'
          "
        >
          {{
            scope.row[item.prop] == 1
              ? 'Delivery Agent'
              : scope.row[item.prop] == 2
                ? 'Broker Carrier'
                : scope.row[item.prop] == 3
                  ? 'Contract Carrier'
                  : ''
          }}
        </el-text>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ChatLineRound, Male } from '@element-plus/icons-vue'
import headerTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'

interface State {
  totalNumber: number
  successedNumber: number
  failedNumber: number
  processedNumber: number
  timer: any
  isClose: boolean
  loading: boolean
  tableData: any
}
const state = reactive<State>({
  totalNumber: 0,
  successedNumber: 0,
  failedNumber: 17200,
  processedNumber: 0,
  timer: null,
  isClose: false,
  loading: false,
  tableData: []
})
const pageData = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  small: false,
  background: false,
  disabled: false
})
const pageTitle = ref('Location Timer Tool')
const { openLoading, closeLoading } = useLoading()
const tableHeaders = [
  { prop: 'location_id', label: 'ID', width: 80 },
  { prop: 'location_code', label: 'Code', width: 120 },
  { prop: 'location_name', label: 'Name', width: 300 },
  { prop: 'location_status', label: 'Status', width: 100 },
  { prop: 'location_shipper', label: 'IsShipper', width: 100 },
  { prop: 'location_billto', label: 'IsBillTo', width: 100 },
  { prop: 'location_warehouse', label: 'IsTerminal', width: 100 },
  { prop: 'location_terminal_type', label: 'TerminalType', width: 120 },
  { prop: 'location_carrier_type', label: 'CarrierType', width: 100 },
  { prop: 'created_at', label: 'Created At', width: 100 },
  { prop: 'updated_at', label: 'Updated At', width: 100 }
]

onMounted(() => {
  getSummaries()
  getLocationList()
})

function toDo() {
  const invoiceSer = new InvoiceService()
  invoiceSer.syncLocation().then(
    (result) => {
      if (result.status) {
        state.successedNumber += result.okNum
        state.totalNumber += result.okNum
      }
    },
    (error) => {
      console.log(error)
    }
  )
}

function closeTimer() {
  if (state.timer === null) {
    return
  }
  clearInterval(state.timer)
  state.isClose = true
  state.loading = false
}

function openTimer() {
  state.isClose = false
  state.loading = true
  state.timer = setInterval(() => {
    toDo()
  }, 1000 * 30)
}

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

function handleSizeChange(val: number) {
  console.log(`${val} items per page`)
  getLocationList()
}
function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`)
  getLocationList()
}
function getLocationList() {
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.getLocationList(pageData.currentPage, pageData.pageSize).then(
    (result) => {
      closeLoading()
      if (result.status) {
        state.tableData = result.data
        pageData.total = result.total
      }
    },
    (err) => {
      closeLoading()
      console.log(err)
    }
  )
}

function openAllPDF() {
  if (state.tableData.length === 0) {
    return
  }
  for (let i = 0; i < state.tableData.length; i++) {
    window.open(state.tableData[i].url, '_blank')
  }
}
</script>

<style scoped>
.pl-10 {
  padding-left: 10px;
}
.pr-5 {
  padding-right: 5px;
}
.mt-20 {
  margin-top: 20px;
}
.mb-20 {
  margin-bottom: 20px;
}
.el-col {
  text-align: center;
  margin-top: 20px;
}
</style>
