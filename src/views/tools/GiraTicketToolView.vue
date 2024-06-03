<template>
  <HeaderTitle :page-title="pageTitle"></HeaderTitle>

  <el-tabs type="border-card" @tab-change="changeTab" class="demo-tabs mt-20">
    <el-tab-pane label="TableList">
      <div class="flex gap-4 mb-4 mt-20">
        <span class="pr-5">Spring Version#</span>
        <el-input
          v-model="requestData.version"
          style="width: 240px"
          placeholder="Please input Spring Version#"
        />

        <span class="pl-10 pr-5">Type#</span>
        <el-select-v2
          v-model="requestData.type"
          style="width: 240px"
          placeholder="Please input Type#"
          :options="typeOptions"
        />

        <span class="pl-10 pr-5">Status#</span>
        <el-select-v2
          v-model="requestData.status"
          style="width: 240px"
          placeholder="Please input status#"
          :options="statusOptions"
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
      </div>
      <el-table
        v-loading="state.loading"
        :data="state.invoiceData"
        show-summary
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
        <el-table-column label="Actions" width="120px; text-align: left;">
          <template #default="scope">
            <p class="mb-5">
              <el-button size="small" type="primary" @click="handleDelete(scope.$index, scope.row)">
                Edit
              </el-button>
            </p>
            <p class="mb-5">
              <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)">
                Copy
              </el-button>
            </p>
            <p>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                Delete
              </el-button>
            </p>
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
    </el-tab-pane>
    <el-tab-pane label="Add/Update">
      <el-form
        :inline="true"
        ref="invoiceFormData"
        :model="formData"
        label-width="auto"
        style="max-width: 800px"
      >
        <el-form-item label="Ticket#" :label-width="formLabelWidth">
          <el-input v-model="formData.ticket" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Name#" :label-width="formLabelWidth">
          <el-input v-model="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Type#" :label-width="formLabelWidth">
          <el-select-v2
            v-model="formData.type"
            placeholder="Please select type"
            :options="typeOptions"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="Priority#" :label-width="formLabelWidth">
          <el-select-v2
            v-model="formData.priority"
            placeholder="Please select priority"
            :options="priorityOptions"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="Status#" :label-width="formLabelWidth">
          <el-select-v2
            v-model="formData.status"
            placeholder="Please select status"
            :options="statusOptions"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="Epic#" :label-width="formLabelWidth">
          <el-select-v2
            v-model="formData.epic"
            placeholder="Please select epic"
            :options="epicOptions"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="Dev SP#" :label-width="formLabelWidth">
          <el-input v-model="formData.dev_sp" />
        </el-form-item>
        <el-form-item label="Dev Hour#" :label-width="formLabelWidth">
          <el-input v-model="formData.dev_hour" />
        </el-form-item>
        <el-form-item label="Dev User#" :label-width="formLabelWidth">
          <el-input v-model="formData.dev_user" />
        </el-form-item>
        <el-form-item label="Ext SP#" :label-width="formLabelWidth">
          <el-input v-model="formData.ext_sp" />
        </el-form-item>
        <el-form-item label="QA SP#" :label-width="formLabelWidth">
          <el-input v-model="formData.qa_sp" />
        </el-form-item>
        <el-form-item label="QA Hour#" :label-width="formLabelWidth">
          <el-input v-model="formData.qa_hour" />
        </el-form-item>
        <el-form-item label="QA User#" :label-width="formLabelWidth">
          <el-input v-model="formData.qa_user" />
        </el-form-item>
        <el-form-item label="Reporter#" :label-width="formLabelWidth">
          <el-input v-model="formData.reporter" />
        </el-form-item>
        <el-form-item label="Version#" :label-width="formLabelWidth">
          <el-select-v2
            v-model="formData.spring_version"
            placeholder="Please select version"
            :options="typeOptions"
          >
          </el-select-v2>
        </el-form-item>
      </el-form>
      <!-- <template #footer> -->
      <div style="margin-left: 50px">
        <el-button type="warning" @click="resetFormData">Reset</el-button>
        <el-button type="primary" @click="addGiraTicket"> Save </el-button>
      </div>
      <!-- </template> -->
    </el-tab-pane>
  </el-tabs>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import { ElMessage, type FormInstance } from 'element-plus'

const pageTitle = ref('Gira Ticket Tool')
const invoiceFormData = ref<FormInstance>()
const formLabelWidth = '100px'
let state = reactive({
  invoiceData: [],
  invoiceTotal: 0,
  loading: false,
  dialogTableVisible: false,
  transferDetail: []
})
let formData = reactive({
  ticket: '',
  name: '',
  type: 'Ticket',
  priority: '',
  status: '',
  epic: '',
  dev_sp: '',
  dev_hour: '',
  dev_user: '',
  ext_sp: '',
  qa_sp: '',
  qa_hour: '',
  qa_user: '',
  reporter: '',
  spring_version: ''
})
const typeOptions = [
  { value: 'Task', label: 'Task' },
  { value: 'Bug', label: 'Bug' },
  { value: 'Support', label: 'Support' },
  { value: 'Impletement', label: 'Impletement' },
  { value: 'Story', label: 'Story' }
]

const priorityOptions = [
  { value: 'Blocker', label: 'Blocker' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'Majar', label: 'Majar' },
  { value: 'Critical', label: 'Critical' }
]

const statusOptions = [
  { value: '1', label: 'New' },
  { value: '2', label: 'Doing' },
  { value: '3', label: 'Develop Completed' },
  { value: '4', label: 'Test' },
  { value: '5', label: 'PO Review' },
  { value: '6', label: 'PO Approved' },
  { value: '7', label: 'Release' },
  { value: '8', label: 'Closed' }
]

const epicOptions = [
  { value: 'TMS', label: 'TMS' },
  { value: 'CP', label: 'CP' },
  { value: 'APAR Support', label: 'APAR Support' },
  { value: 'CRN', label: 'CRM' }
]
const { openLoading, closeLoading } = useLoading()
const requestData = reactive({
  version: '',
  status: '',
  type: '',
  start_date: '',
  end_date: ''
})
const tableHeaders = [
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'ticket', label: 'Ticket', width: 100 },
  { prop: 'name', label: 'Name', width: 300 },
  { prop: 'type', label: 'Task Type', width: 100 },
  { prop: 'priority', label: 'Type', width: 100 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'epic', label: 'Epic Link', width: 100 },
  { prop: 'dev_sp', label: 'SP', width: 80 },
  { prop: 'dev_hour', label: 'Hour', width: 80 },
  { prop: 'ext_sp', label: 'Ext', width: 80 },
  { prop: 'dev_user', label: 'User', width: 80 },
  { prop: 'spring_version', label: 'Version' }
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

const handleDelete = (index: number, row: any) => {
  console.log(index, row)
}

const changeTab = (tabIndex: string) => {
  if (tabIndex === '1') {
    resetFormData()
  }
}

const resetFormData = () => {
  formData.ticket = ''
  formData.name = ''
  formData.type = ''
  formData.priority = ''
  formData.status = ''
  formData.epic = ''
  formData.dev_sp = ''
  formData.dev_hour = ''
  formData.dev_user = 'alexc'
  formData.ext_sp = ''
  formData.qa_sp = ''
  formData.qa_hour = ''
  formData.qa_user = ''
  formData.reporter = ''
  formData.spring_version = ''
}

const addGiraTicket = () => {
  if (formData.ticket === '') {
    ElMessage.error('Please input ticket.')
    return
  }
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.addGiraTicket(formData).then(
    (res) => {
      if (res.status) {
        ElMessage.success('Add Gira Ticket Successfully.')
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
  invoiceSer.getGiraTicket(requestData, currentPage4.value, pageSize4.value).then(
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
  requestData.type = ''
  requestData.status = ''
  requestData.version = ''
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
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
.el-select {
  --el-select-width: 198px !important;
}
</style>
