<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">Invoice ID#</span>
    <el-input
      v-model="requestData.id"
      style="width: 240px"
      placeholder="Please input Invoice ID#"
    />

    <span class="pl-10 pr-5">Start Date</span>
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

  <div class="mt-20 mb-20">
    <el-button type="primary" @click="getTableData">Search</el-button>
    <el-button type="primary" @click="clearInput">Reset</el-button>
  </div>
  <el-table :data="state.invoiceLogList" border style="width: 100%">
    <el-table-column
      v-for="item in tableHeaders"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    />
    <el-table-column fixed="right" label="Operations" width="100">
      <template v-slot="scope">
        <el-button size="small" type="danger" @click="handleDetails(scope.row)">
          Details
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="mb-20 mt-20" style="float: right">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 50, 100, 200]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="state.invoiceLogTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-backtop :right="100" :bottom="100" />
  <PopupDialog
    v-if="state.dialogVisible"
    title="Details"
    :dialogTableVisible="state.dialogVisible"
    :headers="transferHeaders"
    :data="state.details"
  ></PopupDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import PopupDialog from '@/components/utils/PopupDialog.vue'

const pageTitle = ref('Invoice Log')
const { openLoading, closeLoading } = useLoading()
const state = reactive({
  invoiceLogList: [],
  invoiceLogTotal: 1000,
  loading: false,
  details: [],
  dialogVisible: false,
  headers: []
})
const requestData = reactive({
  id: '',
  start_date: '2024-04-01',
  end_date: ''
})
const tableHeaders = [
  { prop: 'ARID', label: 'ID' },
  { prop: 'OrderID', label: 'OrderID' },
  { prop: 'fk_file_id', label: 'FileID' },
  { prop: 'InvoiceNumber', label: 'InvoiceNumber' },
  { prop: 'tms_ar_desc', label: 'Desc' },
  { prop: 'tms_ar_invoice_date', label: 'InvoiceDate' },
  { prop: 'tms_ar_log_text', label: 'Text' },
  { prop: 'tms_ar_balance', label: 'Balance' },
  { prop: 'tms_ar_log_created_date', label: 'LogDate' }
]

const transferHeaders = [
  { prop: 'tms_rpc_log_id', label: 'ID', width: 80 },
  { prop: 'tms_rpc_log_status', label: 'Status', width: 80 },
  { prop: 'tms_rpc_log_target_url', label: 'Url', width: 80 },
  { prop: 'tms_rpc_log_request_when', label: 'Created Date', width: 80 },
  { prop: 'tms_rpc_log_response_when', label: 'Response Date', width: 80 },
  { prop: 'tms_rpc_log_response', label: 'Response', width: 200 },
  { prop: 'tms_rpc_log_request', label: 'Request', width: 400 }
]

let currentPage = ref(1)
let pageSize = ref(20)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

function handleSizeChange(val: number) {
  getInvoiceLogList()
  console.log(`${val} items per page`)
}
function handleCurrentChange(val: number) {
  getInvoiceLogList()
  console.log(`current page: ${val}`)
}

onMounted(() => {
  getNowTime()
  getInvoiceLogList()
})

function getNowTime() {
  const now = new Date()
  const year = now.getFullYear() // 得到年份
  let month = (now.getMonth() + 1).toString() // 得到月份
  let date = (now.getDate() - 1).toString() // 得到日期
  month = month.padStart(2, '0')
  date = date.padStart(2, '0')
  requestData.start_date = `${year}-${month}-${date}`
}

function getTableData() {
  getInvoiceLogList()
}

function getInvoiceLogList() {
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.getInvoiceLogList(requestData, currentPage.value, pageSize.value).then(
    (data) => {
      closeLoading()
      state.invoiceLogList = data.data
      state.invoiceLogTotal = parseInt(data.total)
    },
    (err) => {
      closeLoading()
      console.log(err)
    }
  )
}

function handleDetails(row: any) {
  console.log(row)
  state.dialogVisible = false
  if (row.tms_ar_log_text === '') {
    return
  }
  const text = row.tms_ar_log_text.split('#')
  if (text.length != 2) {
    return
  }
  openLoading()
  const track_id = text[1]
  const invoiceSer = new InvoiceService()
  invoiceSer.getTransferDetail(track_id).then(
    (data) => {
      if (data.status === 'success') {
        const detail = data.data
        state.details = detail
        state.dialogVisible = true
      }
      closeLoading()
    },
    (err) => {
      console.log(err)
    }
  )
}

function clearInput() {
  requestData.id = ''
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
