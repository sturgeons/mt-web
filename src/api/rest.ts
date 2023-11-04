import {request} from './service'

export const api=()=> {
    return {
        request(config){
            return request(config)
        },
        // get请求
        get({params, url}: { params?: any, url: string }) {
            return request({
                url: url,
                method: 'get',
                params: params
            })
        },
        // post请求
        post({data, url}: { data?: any, url: string }) {
            return request({
                url: url,
                method: 'post',
                data
            })
        },
        // put请求
        put({data, url}: { data?: any, url: string }) {
            return request({
                url: url,
                method: 'put',
                data
            })
        },
        // delete请求
        // 删除 idsList
        delete({params, url}: { params?: any, url: string }) {
            return request({
                url: url,
                method: 'delete',
                params: params,
                paramsSerializer: (params) => params.map(i => `idList=${i}`).join('&')
            })
        },
        // delete请求
        // 删除 idsList
        deleteOne({id, url}: { id: string, url: string }) {
            return request({
                url: url,
                method: 'delete',
                params: id,
                paramsSerializer: (params) => `idList=${params}`
            })
        }
    }
}

export const generatorRest=<T>(url: string)=> {
    return {
        selectAll(params: T & TypePage): TypePageRes<T> {
            return api().get({url: `${url}/list`, params})
        },
        selectOne( id: any,params: T | null=null): Promise<T> {
            return api().get({
                params, url: `${url}/id/${id}`
            })
        },
        insert(data: T | null): Promise<String> {
            return api().post({
                data, url: `${url}/insert`
            })
        },
        update(data: T | null) {
            return api().put({
                data, url: `${url}/update`
            })
        },
        delete(params: { idList?: string[] } | null) {
            return api().delete({
                params, url: `${url}/delete`
            })
        },
        deleteOne(id: string) {
            return api().deleteOne({
                id,
                url: `${url}/delete`
            })
        },
    }
}


export type TypePageRes<T> = Promise<{
    records: T[];
    total: number;
    size: number;
    current: number;
    searchCount: boolean;
    pages: number;
}>
export type TypePage = {
    size?: number,
    total?: number,
    current?:number
}