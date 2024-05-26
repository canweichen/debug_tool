class LoginService {
  checkUserLoginStatus(): boolean {
    // 检查本地存储或cookie中的用户登录令牌
    const token = sessionStorage.getItem('user-token')
    if (token == null || token === '' || token === undefined) return false
    const jsonToken = JSON.parse(atob(token))
    if (jsonToken === null || jsonToken === '' || jsonToken === undefined) return false
    if (jsonToken.exp < Date.now()) return false
    return jsonToken.token ? true : false
  }
  handleLogOut = () => {
    sessionStorage.removeItem('user-token')
    window.location.reload()
  }
  getToken = () => {
    const token = sessionStorage.getItem('user-token')
    if (token == null || token === '' || token === undefined) return false
    const jsonToken = JSON.parse(atob(token))
    return jsonToken.token
  }
}
export default new LoginService()
