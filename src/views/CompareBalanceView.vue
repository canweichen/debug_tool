<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">Invoice Num#</span>
    <el-input
      v-model="requestData.invoice_num"
      style="width: 240px"
      placeholder="Please input Invoice Number#"
    />

    <span class="pl-10 pr-5">Invoice ID#</span>
    <el-input
      v-model="requestData.ar_id"
      style="width: 240px"
      placeholder="Please input Invoice ID#"
    />

    <span class="pl-10 pr-5">Order ID#</span>
    <el-input
      v-model="requestData.order_id"
      style="width: 240px"
      placeholder="Please input Order ID#"
    />
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

    <el-radio-group v-model="requestData.sort" class="ml-4 pl-10 pr-5">
      <el-radio value="ASC" size="large">正序</el-radio>
      <el-radio value="DESC" size="large">逆序</el-radio>
    </el-radio-group>
  </div>

  <div class="mt-20 mb-20">
    <el-button type="primary" @click="getTableData">Search</el-button>
    <el-button type="danger" @click="clearInput">Reset</el-button>
    <el-button type="warning" @click="generateExcel">Download</el-button>
    <el-button type="info" @click="clearInput">Export</el-button>
  </div>
  <el-table :data="state.CompareInvoicList" border style="width: 100%">
    <el-table-column
      v-for="item in tableHeaders"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    >
      <template v-slot="scope">
        <span
          v-if="item.prop === 'ComposerBalance'"
          :class="{ 'sync-success': scope.row[item.prop], 'sync-fail': !scope.row[item.prop] }"
        >
          {{ scope.row[item.prop] === true ? '同步成功' : '同步失败' }}
        </span>
        <span
          v-if="item.prop === 'ComposerAmount'"
          :class="{ 'sync-success': scope.row[item.prop], 'sync-fail': !scope.row[item.prop] }"
        >
          {{ scope.row[item.prop] === true ? '总金额一致' : '总金额不一致' }}
        </span>
        <!-- 使用作用域插槽的参数scope来访问行数据 -->
        <el-button
          v-if="item.prop === 'Operations'"
          size="small"
          type="primary"
          @click="handleDetail(scope.row)"
        >
          Detail
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="mb-20 mt-20" style="float: right">
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[500, 1000, 2500, 5000, 10000]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="state.invoiceTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <PopupDialog
    v-if="state.dialogTableVisible"
    title="Payment Details"
    :dialogTableVisible="state.dialogTableVisible"
    :headers="paymentHeaders"
    :data="state.paymentDetail"
  ></PopupDialog>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import PopupDialog from '@/components/utils/PopupDialog.vue'

const pageTitle = ref('Compare Invoice Balance')
const { openLoading, closeLoading } = useLoading()
const state = reactive({
  CompareInvoicList: [],
  invoiceTotal: 1000,
  loading: false,
  dialogTableVisible: false,
  paymentDetail: []
})
const requestData = reactive({
  ar_id: '',
  start_date: '2020-01-01',
  end_date: '',
  order_id: '',
  invoice_num: '',
  sort: 'ASC'
})
const tableHeaders = [
  { prop: 'ARID', label: 'ARID' },
  { prop: 'OrderID', label: 'OrderID' },
  { prop: 'InvoiceNumber', label: 'InvoiceNum' },
  { prop: 'InvoiceDate', label: 'InvoiceDate' },
  { prop: 'TMSAmount', label: 'TMSAmount' },
  { prop: 'TotalAmount', label: 'BNPAmount' },
  { prop: 'TMSBalance', label: 'TMSBalance' },
  { prop: 'BNPBalance', label: 'BNPBalance' },
  { prop: 'BNPApply', label: 'BNPApply' },
  { prop: 'ComposerBalance', label: 'ComBalance' },
  { prop: 'ComposerAmount', label: 'ComAmount' },
  { prop: 'Operations', label: 'Operations' }
]

const paymentHeaders = [
  { prop: 'batchID', label: 'batchID' },
  { prop: 'receiptType', label: 'receiptType' },
  { prop: 'batchDate', label: 'batchDate' },
  { prop: 'cashReceiptNumber', label: 'cashNumber' },
  { prop: 'cashReceiptAmount', label: 'cashAmount' },
  { prop: 'vendorName', label: 'Name' },
  { prop: 'accountID', label: 'Code' },
  { prop: 'invoiceNumber', label: 'Number' },
  { prop: 'applyPostDate', label: 'applyDate' },
  { prop: 'totalAmount', label: 'totalAmount' },
  { prop: 'balance', label: 'balance' },
  { prop: 'receiptAmount', label: 'PayAmount' },
  { prop: 'notes', label: 'notes' },
  { prop: 'appType', label: 'appType' },
  { prop: 'invoiceDate', label: 'invoiceDate' },
  { prop: 'dueDate', label: 'dueDate' },
  { prop: 'eventAction', label: 'eventAction' },
  { prop: 'invoiceType', label: 'Type' }
]

let currentPage4 = ref(1)
let pageSize4 = ref(2500)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

function handleSizeChange(val: number) {
  getCompareBalanceList()
  console.log(`${val} items per page`)
}
function handleCurrentChange(val: number) {
  getCompareBalanceList()
  console.log(`current page: ${val}`)
}

function generateExcel() {
  let dataJson = 'ar_id=' + requestData.ar_id
  dataJson += '&order_id=' + requestData.order_id
  dataJson += '&start_date=' + requestData.start_date
  dataJson += '&end_date=' + requestData.end_date
  dataJson += '&invoice_num=' + requestData.invoice_num
  dataJson += '&sort=' + requestData.sort
  dataJson += '&download=1'
  dataJson += '&page=' + currentPage4.value
  dataJson += '&limit=' + pageSize4.value
  window.open('http://localhost:3000/compareInvoices?' + dataJson)
}

function handleDetail(row: any) {
  state.dialogTableVisible = false
  if (row.InvoiceNumber === '') {
    return
  }
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.getPaymentDetail(row.InvoiceNumber).then(
    (result) => {
      console.log(result.list)
      closeLoading()
      state.paymentDetail = result.list
      state.dialogTableVisible = true
    },
    (error) => {
      closeLoading()
      console.log(error)
    }
  )
}

onMounted(() => {
  getCompareBalanceList()
})

function getCompareBalanceList() {
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer
    .getCompareBalanceList(requestData, currentPage4.value, pageSize4.value)
    .then((result) => {
      state.CompareInvoicList = result.list
      closeLoading()
    })
  //const data = invoiceSer.testCompareInvoices(requestData, currentPage4.value, pageSize4.value)
  //state.CompareInvoicList = data
  //closeLoading()
}

function getTableData() {
  getCompareBalanceList()
}

function clearInput() {
  requestData.ar_id = ''
  requestData.order_id = ''
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
.sync-success {
  color: green;
}
.sync-fail {
  color: red;
}
</style>
