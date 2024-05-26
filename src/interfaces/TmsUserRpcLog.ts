import { reactive } from 'vue'

interface TmsUserRpcLog {
  tms_rpc_log_id: number
  tms_rpc_log_status: string
  tms_rpc_log_authorization: string
  tms_rpc_log_request_when: string
  tms_rpc_log_trigger_where: string
  tms_rpc_log_target_url: string
  tms_rpc_log_method: string
  tms_rpc_log_reference_1: string
}

interface TmsUserRpcLogDetail {
  userRequestData: TmsUserRpcLog[]
  userRequestTotal: number
  loading: boolean
  dialogTableVisible: boolean
  transferDetail: TmsUserRpcLog[]
}

export const state: TmsUserRpcLogDetail = reactive({
  userRequestData: [],
  userRequestTotal: 0,
  loading: false,
  dialogTableVisible: false,
  transferDetail: []
})
