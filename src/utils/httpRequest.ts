class HttpRequest {
  static host: string = 'http://localhost:3000/'
  static path = {
    login: 'api/login',
    logout: 'api/logout',
    syncInvoiceToBnp: 'api/invoices',
    invoiceLog: 'api/invoiceLog',
    BNPLogDetail: 'api/transfer/detail',
    driverList: 'api/driver/list',
    compareBalance: 'api/compareInvoices',
    userRequestLog: 'api/userRequest/list',
    userRpcLog: 'api/userRpcLog/list',
    invoicePayment: 'api/payment/detail',
    summary: 'api/summary/list',
    recreateInvoice: 'api/recreateInvoice',
    recreateInvoiceList: 'api/recreateInvoice/list',
    locationList: 'api/location/list',
    quoteList: 'api/quoteList',
    quoteLogDetail: 'api/logDetail',
    accList: 'api/bnp/acc/List'
  }
  constructor() {}
  public static async post(url: string, data: any) {
    const fullUrl = this.host + url
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  }

  public static async get(url: string, dataJson: string) {
    const fullUrl = this.host + url + '?' + dataJson
    const response = await fetch(fullUrl)
    return await response.json()
  }
}

export default HttpRequest
