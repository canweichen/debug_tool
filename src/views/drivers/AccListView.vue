<template>
  <HeaderTitle :pageTitle="pageTitle" />
  <div style="margin: 20px 0; float: right">
    <el-button type="primary" @click="getAccList">Search</el-button>
    <el-button type="warning" @click="generateAccExcel">Download</el-button>
  </div>
  <el-table :data="state.accList" border style="width: 100%; margin-top: 20px">
    <el-table-column
      v-for="item in accHeader"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    >
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import HeaderTitle from '@/components/base/HeaderTitle.vue'
import invoiceService from '@/services/invoices/InvoiceService'
import useLoading from '@/utils/popoupLoading'

const pageTitle = ref('ACC Setup')
const { openLoading, closeLoading } = useLoading()
const state = reactive({
  accList: []
})
const accHeader = [
  { prop: 'Code', label: 'Code' },
  { prop: 'Description', label: 'Description' },
  { prop: 'IsActive', label: 'IsActive' },
  { prop: 'IsBillingItem', label: 'IsBillingItem' },
  { prop: 'IsPayItem', label: 'IsPayItem' },
  { prop: 'IsHotkey', label: 'IsHotkey' },
  { prop: 'IsCustomer', label: 'IsCustomer' },
  { prop: 'tms_acc_name_id', label: 'TMSID' },
  { prop: 'tms_acc_name_code', label: 'TSMCode' },
  { prop: 'tms_acc_name_name', label: 'TSMName' },
  { prop: 'tms_acc_name_active', label: 'Active' },
  { prop: 'tms_acc_name_billing', label: 'Billing' },
  { prop: 'tms_acc_name_hotkey', label: 'Hotkey' },
  { prop: 'tms_acc_name_customer', label: 'Customer' }
]

onMounted(() => {
  getAccList()
})

function getAccList() {
  openLoading()
  const invoiceSer = new invoiceService()
  invoiceSer.getAccList().then(
    (res) => {
      state.accList = res.data
      closeLoading()
    },
    (err) => {
      console.log(err)
      closeLoading()
    }
  )
}

function generateAccExcel() {
  const invoiceSer = new invoiceService()
  invoiceSer.generateAccListExcel()
}
</script>

<style scoped></style>
