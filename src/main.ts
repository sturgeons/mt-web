import {createApp} from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'remixicon/fonts/remixicon.css'
import {router} from "@/route";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import * as buffer from 'buffer/index';
if (typeof (window as any).global === "undefined"){
    (window as any).global = window;
}
if (typeof (window as any).Buffer === "undefined") {
    (window as any).Buffer = buffer.Buffer;
}
createApp(App)
    .use(Antd)
    .use(router)
    .use(pinia)


    .mount('#app')

