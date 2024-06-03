<template>
  <HeaderTitle :page-title="pageTitle"></HeaderTitle>

  <div class="flex gap-4 mb-4 mt-20">
    <span class="pr-5">Invoice ID#</span>
    <el-input v-model="requestData.ar_id" style="width: 240px" placeholder="Please input AR ID#" />

    <span class="pl-10 pr-5">Order ID#</span>
    <el-input
      v-model="requestData.order_id"
      style="width: 240px"
      placeholder="Please input order ID#"
    />

    <span class="pl-10 pr-5">Invoice Num#</span>
    <el-input
      v-model="requestData.invoice_num"
      style="width: 240px"
      placeholder="Please input num#"
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
  </div>

  <div class="mt-20">
    <el-button type="primary" @click="getTableData">Search</el-button>
    <el-button type="danger" @click="clearInput">Reset</el-button>
    <el-button type="success" @click="openInvoiceDialog">Add</el-button>
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

  <el-dialog v-model="state.logFailInvoiceVisible" title="Add Fail Invoice" width="500">
    <el-form ref="invoiceFormData" :model="formData" style="text-align: center">
      <el-form-item label="Order ID#" :label-width="formLabelWidth">
        <el-input v-model="formData.oid" autocomplete="off" />
      </el-form-item>
      <el-form-item label="AR ID#" :label-width="formLabelWidth">
        <el-input v-model="formData.aid" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Event Type#" :label-width="formLabelWidth">
        <el-select-v2
          v-model="formData.type"
          placeholder="Please select event type"
          :options="typeOptions"
        >
        </el-select-v2>
      </el-form-item>
      <el-form-item label="InvoiceNum#" :label-width="formLabelWidth">
        <el-input v-model="formData.invoice_num" type="textarea" />
      </el-form-item>
      <el-form-item label="Reason#" :label-width="formLabelWidth">
        <el-input v-model="formData.reason" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeInvoiceDialog">Cancel</el-button>
        <el-button type="primary" @click="addFailInvoice"> Save </el-button>
      </div>
    </template>
  </el-dialog>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import { ElMessage, type FormInstance } from 'element-plus'

const pageTitle = ref('Failed Invoice')
const invoiceFormData = ref<FormInstance>()
const formLabelWidth = '100px'
let state = reactive({
  invoiceData: [],
  invoiceTotal: 0,
  loading: false,
  dialogTableVisible: false,
  transferDetail: [],
  logFailInvoiceVisible: false
})
let formData = reactive({
  aid: '',
  oid: '',
  type: 'Ticket',
  invoice_num: '',
  reason: ''
})
const typeOptions = [
  { value: 'Ticket', label: 'Ticket' },
  { value: 'Contact Wechat', label: 'Contact Wechat' },
  { value: 'TMS To BNP Fail', label: 'TMS To BNP Fail' },
  { value: 'BNP Sync Balance Fail', label: 'BNP Sync Balance Fail' },
  { value: 'BNP Systern Error', label: 'BNP Systern Error' }
]
const { openLoading, closeLoading } = useLoading()
const requestData = reactive({
  ar_id: '',
  order_id: '',
  invoice_num: '',
  start_date: '',
  end_date: ''
})
const tableHeaders = [
  { prop: 'id', label: 'ID' },
  { prop: 'ar_id', label: 'AR ID' },
  { prop: 'order_id', label: 'Order ID' },
  { prop: 'invoice_num', label: 'Invoice Num' },
  { prop: 'type', label: 'Event Type' },
  { prop: 'reason', label: 'Reason' },
  { prop: 'created_at', label: 'Created Date' }
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

const openInvoiceDialog = () => {
  state.logFailInvoiceVisible = true
  resetFormData()
}

const closeInvoiceDialog = () => {
  state.logFailInvoiceVisible = false
}

const resetFormData = () => {
  formData.aid = ''
  formData.oid = ''
  formData.type = 'Ticket'
  formData.invoice_num = ''
  formData.reason = ''
}

const addFailInvoice = () => {
  if (formData.invoice_num === '') {
    ElMessage.error('Please input Invoice number.')
    return
  }
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.addFailInvoice(formData).then(
    (res) => {
      if (res.status) {
        ElMessage.success('Add Fail Invoice Successfully.')
        state.logFailInvoiceVisible = false
        getTableData()
      }
      closeLoading()
    },
    () => {
      closeLoading()
    }
  )
}

onMounted(() => {
  getTableData()
})

function getTableData() {
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.getFailInvoice(requestData, currentPage4.value, pageSize4.value).then(
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
  requestData.invoice_num = ''
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
</style>
