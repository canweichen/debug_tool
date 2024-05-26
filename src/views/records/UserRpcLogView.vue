<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">Url Search</span>
    <el-input
      v-model="requestData.url_keyword"
      style="width: 240px"
      placeholder="Please input url keyword"
    />

    <span class="pl-10 pr-5">Request Search</span>
    <el-input
      v-model="requestData.body_keyword"
      style="width: 240px"
      placeholder="Please input body keyword"
    />

    <span class="pl-10 pr-5">ID#</span>
    <el-input v-model="requestData.id" style="width: 240px" placeholder="Please input ID#" />

    <span class="pl-10 pr-5">Table ID#</span>
    <el-select v-model="requestData.db_id" placeholder="Select" style="width: 240px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>

  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">Start Date</span>
    <el-date-picker
      v-model="requestData.start_date"
      type="date"
      placeholder="Please pick start date"
      value-format="YYYY-MM-DD"
    />

    <span class="pl-10 pr-5">End Date</span>
    <el-date-picker
      v-model="requestData.end_date"
      type="date"
      placeholder="Please pick end date"
      value-format="YYYY-MM-DD"
    />
  </div>

  <div class="mt-20">
    <el-button type="primary" @click="getUserRequestData">Search</el-button>
    <el-button type="warning" @click="clearInput">Reset</el-button>
  </div>

  <el-table
    v-loading="state.loading"
    :data="state.userRequestData"
    border
    style="width: 100%"
    class="mt-20"
  >
    <el-table-column
      v-for="item in tableHeaders"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    >
      <template v-slot="scope">
        <!-- 使用作用域插槽的参数scope来访问行数据 -->
        <el-button
          v-if="item.prop === 'operations'"
          size="small"
          type="primary"
          @click="handleEdit(scope.$index, scope.row)"
        >
          Detail
        </el-button>
        <el-button
          v-if="item.prop === 'operations'"
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="mb-20 mt-20" style="float: right">
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 50, 100, 200]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="state.userRequestTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <PopupDialog
    v-if="state.dialogTableVisible"
    title="Details"
    :dialogTableVisible="state.dialogTableVisible"
    :headers="transferHeaders"
    :data="state.transferDetail"
  ></PopupDialog>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import PopupDialog from '@/components/utils/PopupDialog.vue'

const pageTitle = ref('User RPC Log')

let state: TmsUserRpcLogDetail = reactive({
  userRequestData: [],
  userRequestTotal: 0,
  loading: false,
  dialogTableVisible: false,
  transferDetail: []
})

interface TmsUserRpcLog {
  tms_rpc_log_id: number
  tms_rpc_log_status: string
  tms_rpc_log_authorization: string
  tms_rpc_log_request_when: string
  tms_rpc_log_trigger_where: string
  tms_rpc_log_target_url: string
  tms_rpc_log_method: string
  tms_rpc_log_reference_1: string
}

interface TmsUserRpcLogDetail {
  userRequestData: TmsUserRpcLog[]
  userRequestTotal: number
  loading: boolean
  dialogTableVisible: boolean
  transferDetail: TmsUserRpcLog[]
}
const { openLoading, closeLoading } = useLoading()
const requestData = reactive({
  url_keyword: '',
  start_date: '2024-05-01',
  end_date: '',
  db_id: 2,
  body_keyword: '',
  id: '54970070',
  sort: 0
})
const options = [
  {
    value: 1,
    label: 'User RPC Log#1'
  },
  {
    value: 2,
    label: 'User RPC Log#2'
  }
]

const tableHeaders = [
  { prop: 'tms_rpc_log_id', label: 'ID' },
  { prop: 'tms_rpc_log_status', label: 'Status' },
  { prop: 'tms_rpc_log_authorization', label: 'Auth' },
  { prop: 'tms_rpc_log_request_when', label: 'Date' },
  { prop: 'tms_rpc_log_trigger_where', label: 'Targger' },
  { prop: 'tms_rpc_log_target_url', label: 'Url' },
  { prop: 'tms_rpc_log_method', label: 'Method' },
  { prop: 'tms_rpc_log_reference_1', label: 'Reference' },
  { prop: 'operations', label: 'Operation' }
]

const transferHeaders = [
  { prop: 'tms_rpc_log_request', label: 'Request' },
  { prop: 'tms_rpc_log_response', label: 'Response' }
]

let currentPage4 = ref(1)
let pageSize4 = ref(200)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  getUserRequestData()
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  getUserRequestData()
}

const handleEdit = (index: number, row: any) => {
  state.dialogTableVisible = false
  openLoading()
  setTimeout(() => {
    state.transferDetail = []
    state.transferDetail.push(row)
    state.dialogTableVisible = true
    console.log(state.transferDetail)
    closeLoading()
  }, 1000)
}
const handleDelete = (index: number, row: any) => {
  console.log(index, row)
}

onMounted(() => {
  getNowTime()
  //getUserRequestData()
})

function getNowTime() {
  const now = new Date()
  const year = now.getFullYear() // 得到年份
  let month = (now.getMonth() + 1).toString() // 得到月份
  let date = now.getDate().toString() // 得到日期
  month = month.padStart(2, '0')
  date = date.padStart(2, '0')
  requestData.start_date = `${year}-${month}-${date}`
}

function getUserRequestData() {
  openLoading()

  const invoiceSer = new InvoiceService()
  invoiceSer.getUserRpcLogData(requestData, currentPage4.value, pageSize4.value).then(
    (res: any) => {
      console.log(res)
      state.userRequestTotal = parseInt(res.total) || 0
      state.userRequestData = res.data
      closeLoading()
    },
    (error: any) => {
      console.log(error)
      closeLoading()
    }
  )
}

function clearInput() {
  requestData.url_keyword = ''
  requestData.body_keyword = ''
  requestData.start_date = ''
  requestData.end_date = ''
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
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.table-container {
  max-height: 400px;
  overflow: auto;
}
</style>
