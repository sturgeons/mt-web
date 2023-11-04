import {useCookies} from "@vueuse/integrations/useCookies";

const config={
    appName:"mt"
}
const cookie = useCookies()

const cookieUtil = {
    set: function (name = 'default', value = ''): void {
        cookie.set(config.appName + '-' + name, value, {expires: new Date(2099, 2, 1)})
    },
    get: function (name = 'default') {
        return cookie.get(config.appName + '-' + name)
    },
    remove: function (name = 'default') {
        cookie.remove(config.appName + '-' + name)
    }
}
export default cookieUtil