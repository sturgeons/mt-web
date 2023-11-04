import {api, generatorRest, TypePage, TypePageRes} from '../rest';
import {DeviceStatusModel} from "@/module/DeviceStatusModel";
import {ProgramModel} from "@/module/ProgramModel";
import {FileListModel} from "@/module/FileList";


export function DEVICE_STATUS() {
    let path = 'deviceStatus'
    return {
        ...generatorRest<DeviceStatusModel>(path),
        getLastStatus(params: { lastTime: string; id: string | undefined }) {
            return api().get({params,url: `${path}/getLastStatusByTime`})
        }
    }
}

export function PROGRAM_LIST() {
    let path = 'programList'
    return {
        ...generatorRest<ProgramModel>(path),
        runCN: (): Promise<String[]> => {
            return api().get({url: `${path}/runCN`})
        },
        customer: (): Promise<String[]> => {
            return api().get({url: `${path}/customer`})
        },
        code: (params: TypePage & ProgramModel): TypePageRes<ProgramModel> => {
            return api().get({params, url: `${path}/code`})
        },
        viewProgramView(params: { title: string }) {
            return api().get({params, url: `${path}/viewProgramView`})
        },
        verison(params: { code: string }) {
            return api().get({params, url: `${path}/version`})
        },

        add(data: ProgramModel): Promise<String> {
            return api().post({data, url: `${path}/add`})
        },
        reject(params: { fileName: string }) {
            return api().get({params, url: `${path}/reject`})
        },
        publish(params: { id: string }) {
            return api().get({params, url: `${path}/publish`})
        }
    }
}

export function FILE_LIST() {
    let path = 'fileList'
    return {
        ...generatorRest<FileListModel>(path),
    }
}



