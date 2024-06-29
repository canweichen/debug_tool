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
          <template #default="scope">
            <p v-if="item.prop == 'content'" v-html="scope.row.content"></p>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120px; text-align: left;">
          <template #default="scope">
            <p class="mb-5">
              <el-button size="small" type="primary" @click="handlEdit(scope.$index, scope.row)">
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
          :total="state.techknowledgeTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Add/Update">
      <el-form
        ref="techknowledgeFormData"
        :model="formData"
        label-width="auto"
        style="width: 600px"
      >
        <el-form-item label="ID#" :label-width="formLabelWidth">
          <el-input disabled v-model="formData.id" autocomplete="off" />
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
        <el-form-item label="Node Color#" :label-width="formLabelWidth">
          <el-color-picker v-model="formData.color" />
        </el-form-item>
        <el-form-item label="Content#" :label-width="formLabelWidth">
          <MyEditor v-model:valueHtml="formData.content"></MyEditor>
        </el-form-item>
      </el-form>
      <!-- <template #footer> -->
      <div style="margin-left: 50px">
        <el-button type="warning" @click="resetFormData">Reset</el-button>
        <el-button type="primary" @click="addTechknowledge"> Save </el-button>
      </div>
      <!-- </template> -->
    </el-tab-pane>
    <el-tab-pane label="Timeline">
      <el-timeline v-if="state.techknowledgeData.length" style="max-width: 960px">
        <el-timeline-item
          v-for="item in state.techknowledgeData"
          :key="item.id"
          :timestamp="formatDate(item.created_at)"
          :color="item.color"
          placement="top"
        >
          <el-card>
            <template #header>
              <h4>
                {{ item.name }} <el-tag type="success">{{ item.type }}</el-tag>
              </h4>
            </template>
            <p v-html="item.content"></p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-tab-pane>
  </el-tabs>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import InvoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'
import { ElMessage, type FormInstance } from 'element-plus'
import MyEditor from '@/components/utils/MyEditor.vue'

const pageTitle = ref('Techknowledge Tool')
const techknowledgeFormData = ref<FormInstance>()
const formLabelWidth = '100px'
interface TechKnowledgeItem {
  id: number
  name: string
  type: string
  icon: string
  color: string
  content: string
  created_at: string
  updated_at: string
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
  content: '12345',
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
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: 'Name' },
  { prop: 'type', label: 'Type' },
  { prop: 'content', label: 'Content' },
  { prop: 'created_at', label: 'Created At' },
  { prop: 'updated_at', label: 'updated At' }
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

const handlEdit = (index: number, row: TechKnowledgeItem) => {
  console.log(index, row)
  formData.id = row.id
  formData.name = row.name
  formData.type = row.type
  formData.content = row.content
  formData.color = row.color
  state.activeTabIndex = '1'
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

const addTechknowledge = () => {
  if (formData.content === '') {
    ElMessage.error('Please input content.')
    return
  }
  openLoading()
  const invoiceSer = new InvoiceService()
  invoiceSer.addTechknowledge(formData).then(
    (res) => {
      if (res.status) {
        ElMessage.success('Add Techknowledge Successfully.')
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
  invoiceSer.getTechknowledge(requestData, currentPage4.value, pageSize4.value).then(
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
