<template>
  <HeaderTitle :page-title="pageTitle"></HeaderTitle>
  <el-tabs
    type="border-card"
    v-model="state.activeTabIndex"
    @tab-change="changeTab"
    class="demo-tabs mt-20"
  >
    <el-tab-pane label="TableList">
      <div class="flex gap-4 mb-4 mt-20">
        <span class="pr-5">Type#</span>
        <el-select-v2
          v-model="requestData.type"
          style="width: 240px"
          placeholder="Please input Type#"
          :options="typeOptions"
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
        :data="state.techknowledgeData"
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
        <el-table-column fixed="right" label="Actions" width="120px; text-align: left;">
          <template #default="scope">
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
          :total="state.techknowledgeTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tab-pane>
  </el-tabs>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'

const pageTitle = ref('Trip Terminal')

interface TechKnowledgeItem {
  TaskGroupID: number
  TripID: number
  OrderID: number
  Type: string
  OrigTerminalName: string
  OrigTerminalCode: string
  OrigTerminalStreet: string
  OrigTerminalCity: string
  OrigTerminalState: string
  OrigTerminalZip: string
  DestTerminalName: string
  DestTerminalCode: string
  DestTerminalStreet: string
  DestTerminalCity: string
  DestTerminalState: string
  DestTerminalZip: string
  TripDate: string
}
let state = reactive<{
  techknowledgeData: TechKnowledgeItem[]
  techknowledgeTotal: number
  loading: boolean
  dialogTableVisible: boolean
  transferDetail: never[]
  activeTabIndex: string
}>({
  techknowledgeData: [],
  techknowledgeTotal: 0,
  loading: false,
  dialogTableVisible: false,
  transferDetail: [],
  activeTabIndex: '0'
})
let formData = reactive({
  id: 0,
  name: '',
  type: '',
  icon: '',
  content: '',
  color: '#409EFF'
})
const typeOptions = [
  { value: 'PHP', label: 'PHP' },
  { value: 'Java', label: 'Java' },
  { value: 'Mysql', label: 'Mysql' },
  { value: 'Github', label: 'Github' },
  { value: 'NVM', label: 'NVM' },
  { value: 'Javascript', label: 'Javascript' },
  { value: 'Golang', label: 'Golang' },
  { value: 'Other', label: 'Other' }
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
  { prop: 'TaskGroupID', label: 'ID' },
  { prop: 'TripID', label: 'TripID' },
  { prop: 'OrderID', label: 'OrderID' },
  { prop: 'Type', label: 'Type' },
  { prop: 'OrigTerminalName', label: 'OTName' },
  { prop: 'OrigTerminalCode', label: 'OTCode' },
  { prop: 'OrigTerminalStreet', label: 'OTStreet' },
  { prop: 'OrigTerminalCity', label: 'OTCity' },
  { prop: 'OrigTerminalState', label: 'OTState' },
  { prop: 'OrigTerminalZip', label: 'OTZip' },
  { prop: 'DestTerminalName', label: 'DTName' },
  { prop: 'DestTerminalCode', label: 'DTCode' },
  { prop: 'DestTerminalStreet', label: 'DTStreet' },
  { prop: 'DestTerminalCity', label: 'DTCity' },
  { prop: 'DestTerminalState', label: 'DTState' },
  { prop: 'DestTerminalZip', label: 'DTZip' },
  { prop: 'TripDate', label: 'TripDate' }
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

const formatDate = computed(() => (date: string) => {
  return new Date(date).toLocaleString()
})

const changeTab = (tabIndex: string) => {
  if (tabIndex === '1') {
    resetFormData()
  }
}

const resetFormData = () => {
  formData.id = 0
  formData.name = ''
  formData.type = ''
  formData.content = ''
  formData.color = '#409EFF'
}

onMounted(() => {
  getTableData()
})

function getTableData() {
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.getTripTerminalList(requestData, currentPage4.value, pageSize4.value).then(
    (res: any) => {
      console.log(res)
      state.techknowledgeTotal = parseInt(res.total) || 0
      state.techknowledgeData = res.data
      closeLoading()
      //合并对象
      //Object.assign(tableData, res.data)
      console.log(state.techknowledgeData)
    },
    (error: any) => {
      console.log(error)
      closeLoading()
    }
  )
}

function clearInput() {
  requestData.type = ''
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
