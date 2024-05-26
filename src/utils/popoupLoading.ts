import { ElLoading } from 'element-plus'

const useLoading = () => {
  let loadinginstance: any = null
  const openLoading = () => {
    loadinginstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return loadinginstance
  }
  const closeLoading = () => {
    if (loadinginstance) {
      loadinginstance.close()
    }
  }
  return {
    openLoading,
    closeLoading
  }
}

export default useLoading
