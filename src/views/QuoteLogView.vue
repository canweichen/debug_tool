<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">ID#</span>
    <el-input v-model="requestData.id" style="width: 240px" placeholder="Please input Object ID#" />

    <span class="pl-10 pr-5">Type</span>
    <el-select v-model="requestData.type" placeholder="Select" size="middle" style="width: 240px">
      <el-option
        v-for="item in TypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

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

  <div class="mt-20">
    <el-button type="primary" @click="getTableData">Search</el-button>
    <el-button type="primary" @click="clearInput">Reset</el-button>
  </div>
  <el-table :data="state.quoteLogList" stripe style="width: 100%">
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
      :total="state.quoteLogTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-backtop :right="100" :bottom="100" />
  <PopupDialog
    v-if="state.dialogVisible"
    title="Details"
    :dialogTableVisible="state.dialogVisible"
    :headers="state.headers"
    :data="state.details"
  ></PopupDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import PopupDialog from '@/components/utils/PopupDialog.vue'

const pageTitle = ref('Quote Log')
const { openLoading, closeLoading } = useLoading()
const state = reactive<State>({
  quoteLogList: [],
  quoteLogTotal: 1000,
  loading: false,
  details: [],
  dialogVisible: false,
  headers: []
})
const requestData = reactive({
  id: '',
  start_date: '',
  end_date: '',
  type: ''
})

interface State {
  quoteLogList: any[]
  quoteLogTotal: number
  loading: boolean
  dialogVisible: boolean
  details: any[]
  headers: Header[]
}

interface Header {
  prop: string
  label: string
}

const TypeOptions = [
  {
    value: '',
    label: 'Please selected'
  },
  {
    value: 'tcl_quote_logs',
    label: 'QuoteRequestFromTms'
  },
  {
    value: 'tcl_quotes',
    label: 'CalcRatingFromBnp'
  },
  {
    value: 'tcl',
    label: 'Others'
  }
]
const tableHeaders = [
  { prop: 'tms_pull_bnp_data_id', label: 'ID' },
  { prop: 'fk_company_id', label: 'Company ID' },
  { prop: 'tms_pull_bnp_data_type', label: 'Type' },
  { prop: 'tms_pull_bnp_data_object_id', label: 'Object ID' },
  { prop: 'tms_pull_bnp_data_created_date', label: 'Created Date' }
]
const logHeaders: any = [
  { prop: 'tms_rpc_log_id', label: 'ID' },
  { prop: 'tms_rpc_log_status', label: 'Status' },
  { prop: 'tms_rpc_log_target_url', label: 'Url' },
  { prop: 'tms_rpc_log_request_when', label: 'Created Date' },
  { prop: 'tms_rpc_log_response_when', label: 'Response Date' },
  { prop: 'tms_rpc_log_request', label: 'Request' }
]
const quoteHeader: any = [
  { prop: 'tms_quote_lines_id', label: 'ID' },
  { prop: 'fk_tms_quote_id', label: 'Quote ID' },
  { prop: 'tms_quote_lines_lane_status', label: 'Status' },
  { prop: 'tms_quote_lines_type', label: 'Type' },
  { prop: 'tms_quote_lines_calc_text', label: 'Desc' },
  { prop: 'tms_quote_lines_lane_text', label: 'Text' },
  { prop: 'tms_quote_lines_quote_amount', label: 'Amount' },
  { prop: 'tms_quote_lines_created_date', label: 'Created Date' }
]

let currentPage = ref(1)
let pageSize = ref(20)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

function handleSizeChange(val: number) {
  getQuoteLogList()
  console.log(`${val} items per page`)
}
function handleCurrentChange(val: number) {
  getQuoteLogList()
  console.log(`current page: ${val}`)
}

onMounted(() => {
  getQuoteLogList()
})

function getQuoteLogList() {
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.getQuoteLogList(requestData, currentPage.value, pageSize.value).then(
    (data) => {
      closeLoading()
      state.quoteLogList = data.list
      state.quoteLogTotal = parseInt(data.count)
    },
    (err) => {
      closeLoading()
      console.log(err)
    }
  )
}

function handleDetails(row: any) {
  state.dialogVisible = false
  if (row.tms_pull_bnp_data_id === '') {
    return
  }
  if (
    row.tms_pull_bnp_data_type === 'tcl_quote_logs' ||
    row.tms_pull_bnp_data_type === 'pre_tms_quote_request'
  ) {
    state.headers = logHeaders
  } else if (row.tms_pull_bnp_data_type === 'tcl_quotes') {
    state.headers = quoteHeader
  }
  const invoiceSer = new InvoiceService()
  invoiceSer.getQuoteDetails(row).then(
    (data) => {
      state.details = data
      state.dialogVisible = true
      console.log(data)
    },
    (err) => {
      console.log(err)
    }
  )
}

function getTableData() {
  getQuoteLogList()
}

function clearInput() {
  requestData.id = ''
  requestData.type = ''
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
