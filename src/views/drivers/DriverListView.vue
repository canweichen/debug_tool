<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <el-table :data="state.driverList" border style="width: 100%; margin-top: 20px">
    <el-table-column
      v-for="item in driverHeader"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    >
      <template v-slot="scope">
        <span
          v-if="
            item.prop === 'OwnerOperatorID' || item.prop === 'EmployeeID' || item.prop === 'SSOID'
          "
        >
          {{
            scope.row[item.prop] !== '' && scope.row[item.prop] !== null
              ? scope.row[item.prop]
              : '未分配'
          }}
        </span>

        <span v-if="item.prop === 'EmployeeApprovesPayOnBnp'">
          {{ scope.row[item.prop] > 0 ? 'Yes' : 'No' }}
        </span>

        <span v-if="item.prop === 'PayTypeId'">
          {{ scope.row[item.prop] === 1 ? 'Cash' : 'Deposit' }}
        </span>

        <el-button
          v-if="item.prop === 'Opeartions'"
          size="small"
          type="primary"
          @click="handleDetails(scope.row)"
        >
          Details
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import invoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'

const pageTitle = ref('Drivers Manager')
const { openLoading, closeLoading } = useLoading()
const state = reactive({
  driverList: []
})
const driverHeader = [
  { prop: 'Driver_ID', label: 'Driver_ID' },
  { prop: 'FirstName', label: 'FirstName' },
  { prop: 'LastName', label: 'LastName' },
  { prop: 'EmailAddress', label: 'Email' },
  { prop: 'PhoneNumber', label: 'Phone' },
  { prop: 'DriverStatus', label: 'Status' },
  { prop: 'SSOID', label: 'SSOID' },
  { prop: 'Terminal', label: 'Terminal' },
  { prop: 'PayTypeId', label: 'PayTypeId' },
  { prop: 'TerminalID', label: 'TerminalID' },
  { prop: 'EmployeeApprovesPayOnBnp', label: 'PayOnBnp' },
  { prop: 'EmployeeID', label: 'EmpID' },
  { prop: 'OwnerOperatorID', label: 'OwnOpeID' },
  { prop: 'Opeartions', label: 'Opeartions' }
]
function handleDetails(row: any) {
  console.log(row)
}

onMounted(() => {
  getDriverList()
})

function getDriverList() {
  openLoading()
  const invoiceSer = new invoiceService()
  invoiceSer.getDriverList('123').then(
    (res) => {
      state.driverList = res.data
      closeLoading()
    },
    (err) => {
      console.log(err)
      closeLoading()
    }
  )
}
</script>

<style scoped></style>
