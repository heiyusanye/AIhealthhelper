import axios from 'axios'
import { ElMessage } from 'element-plus'


const service = axios.create({
    baseURL: '/api', //请求的基础路径
    timeout: 5000 //请求超时时间
})

service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['token'] = token
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const { data, config } = response
        // 处理响应数据
        if (data.code === '200') {
            return data.data
        }
        else if (data.code === '-1') {
            if (!config.url?.includes('/login')) {
                ElMessage.error(data.msg || '登录过期，请重新登录')

                // 清除本地存储中的token和userInfo信息
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                window.location.href = '/author/login'
            }
            return Promise.reject(data.msg || '登录过期')
        }
        else {
            ElMessage.error(data.msg || '请求失败')
            return Promise.reject(data.msg || '网络请求失败')
        }
    },
    error => {
        // 对响应错误做点什么
        ElMessage.error('网络错误，请检查网络连接')
        return Promise.reject(error)
    }
)
export default service