import axios from 'axios'
import {get, assignIn, assign} from 'lodash-es'
import {text} from '@/lib/Message'
import cookieUtil from "@/utils/cookie-util";


function createService() {
    // 创建一个axios 实例
    const service = axios.create()
    service.interceptors.request.use(
        (config) => config,
        (error) => {
            // 发送错误
            return Promise.reject(error)
        }
    )
    // 响应拦截
    service.interceptors.response.use(
        (response: any) => {
            // 根据 code 进行判断
            if (response.data.code === undefined) {
                return response.data
            } else {
                // 0代表没有错误
                switch (response.data.code) {
                    case 0:
                        return response.data.data
                    case -1:
                        text(response.data.msg.slice(0, 36))
                        return Promise.reject(`错误:\n${response.data.msg.slice(0, 36)}...`)
                    case -2:
                        return Promise.reject(response.data.msg)
                    case 403:
                        return Promise.reject(response.data.msg)
                }
            }
        },
        (error) => {
            const status = get(error, 'response.status')
            switch (status) {
                case 400:
                    error.message = '请求错误'
                    break
                case 401:
                    error.message = '未授权，请登录'
                    break
                case 403:
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器内部错误'
                    break
                case 501:
                    error.message = '服务未实现'
                    break
                case 502:
                    error.message = '网关错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网关超时'
                    break
                case 505:
                    error.message = 'HTTP版本不受支持'
                    break
                case undefined:
                    error.message = '网络连接失败！请检查网络。'
                    break
                default:
                    break
            }
            text(error.message)
            throw error
        }
    )
    return service
}

function createRequestFunction(service: any) {
    return function (config: any) {
        const configDefaults = {
            headers: {
                'Content-Type': get(config, 'headers.Content-Type', 'application/json'),
            },
            timeout: 10000,
            baseURL: location.protocol + '//' + location.hostname,
            data: {},
        }

        let finalConfig = assign(configDefaults, config)
        finalConfig.headers['Authorization'] = cookieUtil.get('token') || ''
        return service(finalConfig)
    }
}

export const service = createService()
export const request = createRequestFunction(service)

