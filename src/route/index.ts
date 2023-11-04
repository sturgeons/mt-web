import {createRouter, createWebHashHistory} from 'vue-router'
import {RouterWrapper} from "@/utils/router-wrapper-util";
const routes = [
    {
        path: '/',
        component: () => import('../layout/ContainerLayout.vue'),
        meta: {auth: false},
        children: [
            {
                path: '/',
                component: () => import('../pages/Cutting1Status.vue'),
                meta: {title: '首页'}
            },
            {
                path: '/cutting1Status',
                component: () => import('../pages/Cutting1Status.vue'),
                meta: {title: '洗切1组设备状态'}
            },{
                path: '/cuttingMachineStatus',
                component: () => import('../pages/CuttingMachineStatus.vue'),
                meta: {title: '洗切1组设备状态趋势'}
            },{
                path: '/programManage',
                component: () => import('../pages/views/ProgramMange.vue'),
                meta: {title: '程序管理'}
            },{
                path: '/machineStatus',
                component: () => import('../pages/views/BoardMachineStatus.vue'),
                meta: {title: '设备状态'}
            },
        ]
    }
]

let router = createRouter({
    history: createWebHashHistory(),
    routes
})
router = RouterWrapper(router)

export {
    router, routes
}
