<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">Invoice ID#</span>
    <el-input
      v-model="requestData.ar_id"
      style="width: 240px"
      placeholder="Please input Invoice ID#"
    />

    <span class="pl-10 pr-5">PRO#</span>
    <el-input v-model="requestData.pro" style="width: 240px" placeholder="Please input pro#" />

    <span class="pl-10 pr-5">Order ID#</span>
    <el-input
      v-model="requestData.order_id"
      style="width: 240px"
      placeholder="Please input Order ID#"
    />

    <span class="pl-10 pr-5">Object Type#</span>
    <el-select v-model="requestData.type" placeholder="Select" style="width: 240px">
      <el-option
        v-for="item in TypeOptions"
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
    <el-button type="primary" @click="getTableData">
      <el-icon class="el-icon--left"><Search /></el-icon>
      Search
    </el-button>
    <el-button type="warning" @click="clearInput">
      <el-icon class="el-icon--left"><SetUp /></el-icon>
      Reset
    </el-button>
  </div>

  <el-table
    v-loading="state.loading"
    :data="state.invoiceData"
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
        <el-text
          v-if="item.prop === 'tms_api_transfer_void'"
          :type="scope.row[item.prop] == 1 ? 'danger' : 'success'"
        >
          {{ scope.row[item.prop] == 1 ? 'Void' : 'Active' }}
        </el-text>
        <el-text
          v-if="item.prop === 'tms_api_transfer_status'"
          :type="scope.row[item.prop] == 1 ? 'success' : 'primary'"
        >
          {{ scope.row[item.prop] == 1 ? 'Done' : 'Running' }}
        </el-text>
        <span v-if="item.prop === 'ObjectID'">
          {{
            scope.row['tms_api_transfer_type'] === 'Trip Carrier'
              ? scope.row['fk_tms_dispatch_id']
              : scope.row['tms_api_transfer_type'] === 'Order' ||
                  scope.row['tms_api_transfer_type'] === 'File'
                ? scope.row['fk_tms_order_id']
                : scope.row['tms_api_transfer_type'] === 'AR'
                  ? scope.row['fk_tms_ar_id']
                  : 0
          }}
        </span>
        <el-col v-if="item.prop === 'operations'">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">
            <el-icon class="el-icon--left"> <Edit /> </el-icon>
            Detail
          </el-button>
        </el-col>
        <el-col v-if="item.prop === 'operations'">
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            <el-icon class="el-icon--left"> <Delete /> </el-icon>Delete
          </el-button>
        </el-col>
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
      :total="state.invoiceTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <PopupDialog
    v-if="state.dialogTableVisible"
    title="Request Transfer Details"
    :dialogTableVisible="state.dialogTableVisible"
    :headers="transferHeaders"
    :data="state.transferDetail"
  ></PopupDialog>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import PopupDialog from '@/components/utils/PopupDialog.vue'
import { Delete, Search, Edit, SetUp } from '@element-plus/icons-vue'

let state = reactive({
  invoiceData: [],
  invoiceTotal: 0,
  loading: false,
  dialogTableVisible: false,
  transferDetail: []
})
const pageTitle = ref('Sync Invoice To BNP')
const { openLoading, closeLoading } = useLoading()
const requestData = reactive({
  ar_id: '',
  start_date: '2024-03-01',
  end_date: '',
  order_id: '',
  pro: '',
  type: 'ALL'
})
const tableHeaders = [
  { prop: 'tms_api_transfer_id', label: 'ID' },
  { prop: 'ObjectID', label: 'ObjectID' },
  { prop: 'tms_api_transfer_type', label: 'Type' },
  { prop: 'tms_api_transfer_desc', label: 'Desc' },
  { prop: 'tms_api_transfer_status', label: 'Status' },
  { prop: 'tms_api_transfer_response', label: 'Response' },
  { prop: 'tms_api_transfer_create_when', label: 'Created Date' },
  { prop: 'tms_api_transfer_update_when', label: 'Response Date' },
  { prop: 'tms_api_transfer_void', label: 'IsVoid' },
  { prop: 'tms_api_transfer_failed_times', label: 'Failed Times' },
  { prop: 'operations', label: 'Operation' }
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

const TypeOptions = [
  {
    value: 'ALL',
    label: 'ALL'
  },
  {
    value: 'AR',
    label: 'AR'
  },
  {
    value: 'Order',
    label: 'Order'
  },
  {
    value: 'File',
    label: 'File'
  },
  {
    value: 'Trip Carrier',
    label: 'Trip Carrier'
  }
]

let currentPage4 = ref(1)
let pageSize4 = ref(20)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  getTableData()
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  getTableData()
}

const handleEdit = (index: number, row: any) => {
  state.dialogTableVisible = false
  if (row.tms_api_transfer_response === null) {
    return
  }
  openLoading()
  const line = JSON.parse(row.tms_api_transfer_response)
  const trace_id = line.trace_request_id
  const invoiceSer = new InvoiceService()
  invoiceSer.getTransferDetail(trace_id).then(
    (result) => {
      if (result.status === 'success') {
        const detail = result.data
        console.log(detail)
        state.transferDetail = detail
        state.dialogTableVisible = true
      }
      closeLoading()
    },
    (err) => {
      console.log(err)
    }
  )
}
const handleDelete = (index: number, row: any) => {
  console.log(index, row)
}

onMounted(() => {
  getNowTime()
  getTableData()
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
  openLoading()
  let sql = ''
  let leftJoin = ''

  if (requestData.ar_id !== '') {
    sql += ` and bnp.fk_tms_ar_id = '${requestData.ar_id}'`
  }
  if (requestData.order_id !== '') {
    sql += ` and bnp.fk_tms_order_id = '${requestData.order_id}'`
  }
  if (requestData.pro !== '') {
    leftJoin =
      'inner join tms_ar as ar on bnp.fk_tms_ar_id = ar.tms_ar_id inner join tms_order as o on ar.fk_tms_order_id = o.tms_order_id '
    sql += ` and o.tms_order_pro = '${requestData.pro}'`
  }
  if (requestData.type !== 'ALL') {
    sql += ` and bnp.tms_api_transfer_type = '${requestData.type}'`
  }
  if (requestData.start_date !== '' && requestData.end_date !== '') {
    const start_datetime = requestData.start_date + ' 00:00:00'
    const end_datetime = requestData.end_date + ' 23:59:59'
    sql += ` and bnp.tms_api_transfer_create_when BETWEEN '${start_datetime}' AND '${end_datetime}'`
  } else if (requestData.start_date !== '' && requestData.end_date === '') {
    const start_datetime = requestData.start_date + ' 00:00:00'
    sql += ` and bnp.tms_api_transfer_create_when >= '${start_datetime}'`
  } else if (requestData.start_date === '' && requestData.end_date !== '') {
    const end_datetime = requestData.end_date + ' 23:59:59'
    sql += ` and bnp.tms_api_transfer_create_when <= '${end_datetime}'`
  }
  let base_sql =
    'select bnp.* from tms_api_transfer_sync_data_to_bnp as bnp ' + leftJoin + ' where 1=1'
  if (sql === '') {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const currentDate = `${year}-${month}-${day}`
    const start_datetime = currentDate + ' 00:00:00'
    const end_datetime = currentDate + ' 23:59:59'
    sql = ` and bnp.tms_api_transfer_create_when BETWEEN '${start_datetime}' AND '${end_datetime}'`
  }
  base_sql += sql
  const data = encodeURIComponent(base_sql + ';')
  const page = currentPage4.value
  const limit = pageSize4.value
  const invoiceSer = new InvoiceService()
  invoiceSer.getTransferData(data, page, limit).then(
    (res: any) => {
      console.log(res)
      state.invoiceTotal = parseInt(res.total) || 0
      state.invoiceData = res.data
      closeLoading()
      //合并对象
      //Object.assign(tableData, res.data)
      console.log(state.invoiceData)
    },
    (error: any) => {
      console.log(error)
      closeLoading()
    }
  )
}

function clearInput() {
  requestData.ar_id = ''
  requestData.order_id = ''
  requestData.start_date = ''
  requestData.end_date = ''
  requestData.pro = ''
  requestData.type = 'ALL'
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
