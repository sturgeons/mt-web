import {title} from "./dom-utils";
import cookieUtil from "./cookie-util";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function RouterWrapper(router: any) {
    router.beforeEach(async (to, from, next) => {
        // 开始进度条
        NProgress.start()
        // 验证当前路由所有的匹配中是否需要有登录验证的
        if (to.matched.some((r) => r.meta.auth)) {
            // 这是否存有token作为验证是否登录的条件
            const token = cookieUtil.get('uuid')
            if (token && token !== 'undefined') {
                next()
            } else {
                // 没有登录的时候跳转到登录界面
                // 携带上登陆成功之后需要跳转的页面完整路径
                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath,
                    },
                })
                NProgress.done()
            }
        } else {
            // 不需要身份校验 直接通过
            next()
        }
    })

    router.afterEach((to) => {
        // 进度条
        NProgress.done()
        // 更改标题
        title(to.meta.title as string)
    })
    return router;
}
