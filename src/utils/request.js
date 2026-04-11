import { ElMessage } from 'element-plus'
import mockResponse from '@/api/mock'

// 模拟 axios 实例
const service = {
  get: (url, config = {}) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        const response = mockResponse(url, 'GET', config.params)
        if (response.code === '200') {
          resolve(response.data)
        } else {
          ElMessage.error(response.msg || '请求失败')
          reject(response.msg || '网络请求失败')
        }
      }, 300)
    })
  },
  post: (url, data = {}) => {
    // 处理AI咨询流式回复
    if (url === '/psychological-chat/stream') {
      // 直接返回，由fetchEventSource处理
      return null
    }
    
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        const response = mockResponse(url, 'POST', data)
        if (response.code === '200') {
          resolve(response.data)
        } else {
          ElMessage.error(response.msg || '请求失败')
          reject(response.msg || '网络请求失败')
        }
      }, 300)
    })
  },
  put: (url, data = {}) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        const response = mockResponse(url, 'PUT', data)
        if (response.code === '200') {
          resolve(response.data)
        } else {
          ElMessage.error(response.msg || '请求失败')
          reject(response.msg || '网络请求失败')
        }
      }, 300)
    })
  },
  delete: (url) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        const response = mockResponse(url, 'DELETE')
        if (response.code === '200') {
          resolve(response.data)
        } else {
          ElMessage.error(response.msg || '请求失败')
          reject(response.msg || '网络请求失败')
        }
      }, 300)
    })
  }
}

export default service