import loginService from './loginService'
class InvoiceService {
  private token: string = ''
  constructor() {
    this.token = loginService.getToken()
  }

  async getTransferData(data: string, page: number, pageSize: number) {
    const response = await fetch(
      'http://localhost:3000/invoices?sql_=' +
        data +
        '&page=' +
        page +
        '&limit=' +
        pageSize +
        '&token=' +
        this.token
    )
    return await response.json()
  }

  async getTransferDetail(id: number) {
    const response = await fetch(
      'http://localhost:3000/transfer/detail?id=' + id + '&token=' + this.token
    )
    return await response.json()
  }

  async getDriverList(id: string) {
    const response = await fetch(
      'http://localhost:3000/driver/list?id=' + id + '&token=' + this.token
    )
    return await response.json()
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
    const response = await fetch('http://localhost:3000/compareInvoices?' + dataJson)
    return await response.json()
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
    const response = await fetch('http://localhost:3000/userRequest/list?' + dataJson)
    return await response.json()
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
    const response = await fetch('http://localhost:3000/userRpcLog/list?' + dataJson)
    return await response.json()
  }

  async getPaymentDetail(invoiceNumber: string) {
    const response = await fetch(
      'http://localhost:3000/payment/detail?invoiceNum=' + invoiceNumber + '&token=' + this.token
    )
    return await response.json()
  }

  async getSummaryData() {
    const response = await fetch('http://localhost:3000/summary/list?token=' + this.token)
    return await response.json()
  }

  async recreateInvoice() {
    const response = await fetch('http://localhost:3000/recreateInvoice?token=' + this.token)
    return await response.json()
  }

  async getRecreateInvoiceList(page: number, limit: number) {
    let dataJson = 'page=' + page
    dataJson += '&limit=' + limit
    dataJson += '&token=' + this.token
    const response = await fetch('http://localhost:3000/recreateInvoice/list?' + dataJson)
    return await response.json()
  }

  async getLocationList(page: number, limit: number) {
    let dataJson = 'page=' + page
    dataJson += '&limit=' + limit
    dataJson += '&token=' + this.token
    const response = await fetch('http://localhost:3000/location/list?' + dataJson)
    return await response.json()
  }

  async getQuoteLogList(data: any, page: number, pageSize: number) {
    let dataJson = 'id=' + data.id
    dataJson += '&type=' + data.type
    dataJson += '&start_date=' + data.start_date
    dataJson += '&end_date=' + data.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = await fetch('http://localhost:3000/quoteList?' + dataJson)
    return await response.json()
  }

  async getQuoteDetails(data: any) {
    let dataJson = 'id=' + data.tms_pull_bnp_data_object_id
    dataJson += '&type=' + data.tms_pull_bnp_data_type
    dataJson += '&token=' + this.token
    const response = await fetch('http://localhost:3000/logDetail?' + dataJson)
    return await response.json()
  }

  async getInvoiceLogList(data: any, page: number, pageSize: number) {
    let dataJson = 'id=' + data.id
    dataJson += '&start_date=' + data.start_date
    dataJson += '&end_date=' + data.end_date
    dataJson += '&page=' + page
    dataJson += '&limit=' + pageSize
    dataJson += '&token=' + this.token
    const response = await fetch('http://localhost:3000/invoiceLog?' + dataJson)
    return await response.json()
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
