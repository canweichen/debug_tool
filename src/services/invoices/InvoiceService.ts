import HttpRequest from '@/utils/httpRequest'
import loginService from './loginService'
class InvoiceService {
  private token: string = ''
  constructor() {
    this.token = loginService.getToken()
  }

  async getTransferData(data: string, page: number, pageSize: number) {
    const dataJson =
      'sql_=' + data + '&page=' + page + '&limit=' + pageSize + '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.syncInvoiceToBnp, dataJson)
    return await response
  }

  async getTransferDetail(id: number) {
    const dataJson = 'id=' + id + '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.BNPLogDetail, dataJson)
    return await response
  }

  async getDriverList(id: string) {
    const dataJson = 'id=' + id + '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.driverList, dataJson)
    return await response
  }

  async getAccList() {
    const dataJson = 'token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.accList, dataJson)
    return await response
  }

  generateAccListExcel() {
    const dataJson = 'token=' + this.token + '&download=1'
    const url = HttpRequest.host + HttpRequest.path.accList
    window.open(url + '?' + dataJson)
  }

  async getCompareBalanceList(data: any, page: number, pageSize: number) {
    let dataJson = 'ar_id=' + data.ar_id
    dataJson += '&order_id=' + data.order_id
    dataJson += '&start_date=' + data.start_date
    dataJson += '&end_date=' + data.end_date
    dataJson += '&invoice_num=' + data.invoice_num
    dataJson += '&sort=' + data.sort
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.compareBalance, dataJson)
    return await response
  }

  generateExcel(requestData: any, page: number, pageSize: number) {
    let dataJson = 'ar_id=' + requestData.ar_id
    dataJson += '&order_id=' + requestData.order_id
    dataJson += '&start_date=' + requestData.start_date
    dataJson += '&end_date=' + requestData.end_date
    dataJson += '&invoice_num=' + requestData.invoice_num
    dataJson += '&sort=' + requestData.sort
    dataJson += '&download=1'
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const url = HttpRequest.host + HttpRequest.path.compareBalance
    window.open(url + '?' + dataJson)
  }

  async getUserRequestData(requestData: any, page: number, pageSize: number) {
    let dataJson = 'url_keyword=' + requestData.url_keyword
    dataJson += '&db_id=' + requestData.db_id
    dataJson += '&start_date=' + requestData.start_date
    dataJson += '&end_date=' + requestData.end_date
    dataJson += '&body_keyword=' + requestData.body_keyword
    dataJson += '&sort=' + requestData.sort
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.userRequestLog, dataJson)
    return await response
  }

  async getUserRpcLogData(requestData: any, page: number, pageSize: number) {
    let dataJson = 'url_keyword=' + requestData.url_keyword
    dataJson += '&db_id=' + requestData.db_id
    dataJson += '&id=' + requestData.id
    dataJson += '&start_date=' + requestData.start_date
    dataJson += '&end_date=' + requestData.end_date
    dataJson += '&body_keyword=' + requestData.body_keyword
    dataJson += '&sort=' + requestData.sort
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.userRpcLog, dataJson)
    return await response
  }

  async addTechknowledge(formData: any) {
    const response = HttpRequest.post(HttpRequest.path.addTechknowledge, formData)
    return await response
  }

  async getTechknowledge(requestData: any, page: number, pageSize: number) {
    let dataJson = 'type=' + requestData.type
    dataJson += '&start=' + requestData.start_date
    dataJson += '&end=' + requestData.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.getTechknowledge, dataJson)
    return await response
  }

  async getTripTerminalList(requestData: any, page: number, pageSize: number) {
    let dataJson = 'type=' + requestData.type
    dataJson += '&start=' + requestData.start_date
    dataJson += '&end=' + requestData.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.getTripTerminalList, dataJson)
    return await response
  }

  async addGiraTicket(formData: any) {
    const response = HttpRequest.post(HttpRequest.path.addGiraTicket, formData)
    return await response
  }

  async getGiraTicket(requestData: any, page: number, pageSize: number) {
    let dataJson = 'type=' + requestData.type
    dataJson += '&status=' + requestData.status
    dataJson += '&version=' + requestData.version
    dataJson += '&start=' + requestData.start_date
    dataJson += '&end=' + requestData.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.getGiraTicket, dataJson)
    return await response
  }

  async addFailInvoice(formData: any) {
    const response = HttpRequest.post(HttpRequest.path.addFailInvoice, formData)
    return await response
  }

  async getFailInvoice(requestData: any, page: number, pageSize: number) {
    let dataJson = 'aid=' + requestData.ar_id
    dataJson += '&oid=' + requestData.order_id
    dataJson += '&number=' + requestData.invoice_num
    dataJson += '&start=' + requestData.start_date
    dataJson += '&end=' + requestData.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.getFailInvoice, dataJson)
    return await response
  }

  async getPaymentDetail(invoiceNumber: string) {
    const dataJson = 'invoiceNum=' + invoiceNumber + '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.invoicePayment, dataJson)
    return await response
  }

  async getSummaryData() {
    const dataJson = 'token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.summary, dataJson)
    return await response
  }

  async recreateInvoice() {
    const dataJson = 'token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.recreateInvoice, dataJson)
    return await response
  }

  async getRecreateInvoiceList(page: number, limit: number) {
    let dataJson = 'page=' + page
    dataJson += '&limit=' + limit
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.recreateInvoiceList, dataJson)
    return await response
  }

  async getLocationList(page: number, limit: number) {
    let dataJson = 'page=' + page
    dataJson += '&limit=' + limit
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.locationList, dataJson)
    return await response
  }

  async syncLocation() {
    const dataJson = 'token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.syncLocation, dataJson)
    return await response
  }

  async getQuoteLogList(data: any, page: number, pageSize: number) {
    let dataJson = 'id=' + data.id
    dataJson += '&type=' + data.type
    dataJson += '&start_date=' + data.start_date
    dataJson += '&end_date=' + data.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.quoteList, dataJson)
    return await response
  }

  async getQuoteDetails(data: any) {
    let dataJson = 'id=' + data.tms_pull_bnp_data_object_id
    dataJson += '&type=' + data.tms_pull_bnp_data_type
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.quoteLogDetail, dataJson)
    return await response
  }

  async getInvoiceLogList(data: any, page: number, pageSize: number) {
    let dataJson = 'id=' + data.id
    dataJson += '&start_date=' + data.start_date
    dataJson += '&end_date=' + data.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = HttpRequest.get(HttpRequest.path.invoiceLog, dataJson)
    return await response
  }

  testCompareInvoices(params: any, page: number, limit: number) {
    const data: any = []
    for (let i = 0; i < limit; i++) {
      const amount: number = Math.round(Math.random() * 10000000)
      const balance: number = Math.min(amount - Math.round(Math.random() * 1000000), amount)
      const apply: number = amount - balance
      data.push({
        ARID: Math.round(Math.random() * 10000000),
        OrderID: Math.round(Math.random() * 100000),
        InvoiceNumber: Math.round(Math.random() * 10000000) + '-1',
        InvoiceDate: '2022-01-01',
        TMSAmount: amount,
        TMSBalance: balance,
        TotalAmount: amount,
        BNPBalance: balance,
        BNPApply: apply,
        ComposerAmount: 'true',
        ComposerBalance: 'true'
      })
    }
    return data
  }
}

export default InvoiceService
