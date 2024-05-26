<template>
  <el-dialog v-model="dialogTableVisible" destroy-on-close :title="props.title" width="1000">
    <div class="table-container">
      <el-table :data="props.data">
        <el-table-column
          v-for="item in props.headers"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface TableHeader {
  prop: string
  label: string
  width?: string | number
}
const props = defineProps<{
  title: string
  dialogTableVisible: boolean
  headers: TableHeader[]
  data: any[]
}>()
const dialogTableVisible = props.dialogTableVisible
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow: auto;
}
</style>
