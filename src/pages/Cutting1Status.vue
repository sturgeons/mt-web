<template lang="pug">
.main-body
  .header
  .container
    a-row(:gutter="[8,8]")
      a-col(v-for="item in data.deviceList" span="8")
        .device-card
          .code {{item.code}}
          a-row.card-body
            a-col.card-left(:span="12")
              .status(:class="getStatusClass(item.mcnstatus)") {{getStatus(item.mcnstatus)}}
              .item-row 设备型号：{{item.cnctype}}-{{item.cnctype1}}-{{item.cncspec}}
              //.item-row 版本型号：{{item.cncspec}}
              .item-row 工作模式：{{item.cncworktype}}
              .item-row 当前程序：{{item.progname}}
              .item-row 客户代码：{{item.customer}}
              .item-row 材料牌号：{{item.materialCode}}
              .item-row 生产批次：{{item.specifications}}
              .item-row 产品图号：{{item.drawerCode}}
              .item-row 本次计数：{{getCurrentCount(item)}}
              //.item-row 合计计数：{{item.countpertime}}
              .item-row 运行时长：{{item.cuttingtime-item.lastCuttingTime}}
              .item-row 当前信息：{{item.txtalarmmsg}}
            a-col.card-right(:span="12")
              .oee
                .label 设备稼动率
                .value {{getCurrOee(item)}}%
          .view
            .view-button(@click="$router.push('cuttingMachineStatus')") 查看设备信息
          a-avatar(src="./assets/machine.jpg").machine-pic
</template>

<script setup lang="ts">
import {DEVICE_STATUS, PROGRAM_LIST} from "@/api";
import {reactive} from "vue";
import type {DeviceStatusModel} from "@/module/DeviceStatusModel";
import {random} from "lodash-es";
import dayjs from "dayjs";


const data = reactive({
  deviceList: [] as DeviceModel[]
})
const socket = new WebSocket(`ws://${location.hostname}:1880/hhh`)
socket.onopen = (err) => {
  console.log(err)
};
socket.onmessage = msg => {
  let res = JSON.parse(msg.data)
  data.deviceList.forEach(t => {
    if (t.code == res['code']) {
      t[res['params']] = res['value2']
      //如果改变的是型号就刷新信息
      if (res['params']==='progname'){
        getProgramInfo(res['value2']).then(res=>{
          if (res.records.length>0){
            let info=res.records[0]
            t.drawerCode=info.drawerCode||''
            t.customer=info.customer||''
            t.materialCode=info.materialCode||''
            t.specifications=info.specifications||''
          }
        })
      }
    }
  })
}

interface DeviceModel extends DeviceStatusModel {
  lastCuttingTime: number,
  lastCount: number,
  lastCountPerTime: number,
  drawerCode:string,
  customer:string,
  materialCode:string,
  specifications:string
}

function getCurrentCount(item: DeviceModel) {
  if (item.lastCountPerTime !== 0&& item.countpertime) {
   return  item.countpertime-item.lastCountPerTime
  }
  return 0
}

function getOee(workTime, allTiem) {
  if (workTime && allTiem) {
    return ((workTime / allTiem) * 100).toFixed(2)
  }
  return '0.00'
}

function getCurrOee(t: DeviceStatusModel & { lastCuttingTime?: number }) {
  if ((t.lastCuttingTime && t.lastCuttingTime !== 0) && t.cuttingtime) {
    //距离上一次8点的时间
    // console.log( dayjs().format("YYYY-MM-DD HH:mm:ss"))
    // console.log(lastTime.format("YYYY-MM-DD HH:mm:ss"))
    let latsec = dayjs().diff(lastTime.subtract(1, 'day'), 's')
    // console.log(latsec)
    return (((t.cuttingtime - t.lastCuttingTime) / latsec) * 100).toFixed(2)
  }
  return '0.00'
}

function getStatus(status) {
  switch (status) {
    case "3":
      return "正常运行"
    case "5":
      return "设备异常"
    case "10":
      return "设备离线"
  }
  return "停机等待"
}

function getStatusClass(status) {
  switch (status) {
    case "3":
      return "status-running"
    case "5":
      return "status-downtime"
    case "10":
      return "status-offline"
  }
  return "status-waiting"
}


DEVICE_STATUS().selectAll({size: 10}).then(res => {
  res.records.forEach(item=>{
    if (item.progname){
      getProgramInfo(item.progname).then(res=>{

        let pushObj:DeviceModel={
          ...item,
          lastCuttingTime: 0,
          lastCount: 0,
          lastCountPerTime: 0,
          customer: '',
          drawerCode: "",
          materialCode: '',
          specifications: '',
        }
        if (res.records.length>0){
          let info=res.records[0]
          pushObj.drawerCode=info.drawerCode||''
          pushObj.customer=info.customer||''
          pushObj.materialCode=info.materialCode||''
          pushObj.specifications=info.specifications||''
        }
        data.deviceList.push(pushObj)
      })
    }
  })

  getLastData()
})

let now = dayjs()
let lastTime = dayjs(`${dayjs().format("YYYY-MM-DD")} 08:00:00`).add(1, 'day')
console.log(`${dayjs().format("YYYY-MM-DD")}`)

//获取当前程序运行的相关信息
function  getProgramInfo(programName:string){
 return  PROGRAM_LIST().selectAll({code:programName})
}


function getLastData() {
  data.deviceList.forEach(t => {
    if ((t.lastCount === 0 || t.lastCuttingTime === 0) || t.lastCountPerTime === 0) {
      DEVICE_STATUS().getLastStatus({
        id: t.code,
        lastTime: dayjs().subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }).then((res: DeviceStatusModel) => {
        data.deviceList.forEach(t => {
          if (t.code === res.code) {
            t.lastCuttingTime = res.cuttingtime || 0
            t.lastCount = res.counttotal || 0
            t.lastCountPerTime = res.countpertime || 0
          }
        })
      })
    }
  })
}


setInterval(() => {
  console.log(lastTime.diff(dayjs(), 'second'))
  getLastData()
  //如果超过每天8点 重置时间
  // console.log(dayjs())
  console.log(lastTime.date())
  if (dayjs() > lastTime) {
    let now = dayjs()
    lastTime = dayjs(`${dayjs().format("YYYY-MM-DD")} 08:00:00`).add(1, 'day')
    data.deviceList.forEach(t => {
      t.lastCuttingTime = 0
    })
  }


}, 30000)

</script>

<style scoped lang="stylus">
.device-card
  padding 8px 16px
  height calc(50vh - 12px)
  background-color #2f7bec
  border-radius 16px
  position relative
  font-size 20px

  .code
    font-size 31px
    color #fff
    font-weight bolder

  .item-row
    color #ffffff
    height 31px

  .machine-pic
    position absolute
    right 10px
    top 50px
    height 200px
    border-radius 50%
    width 200px

  .view-button
    background-color #fff
    text-align center
    border-radius 4px
    height 35px
    margin-top 10px
    line-height 38px

  .status
    margin-bottom 6px
    background-color #fff
    height 35px
    border-radius 4px
    text-align center
    line-height 38px

  .status-running
    background-color green

  .status-offline
    background-color gray

  .status-downtime
    background-color red

  .status-waiting
    background-color yellow

  .card-right
    margin-top 250px

    .oee
      background-color #fff
      border-radius 4px
      padding 8px
      position relative
      height 60px

      .label
        position absolute
        bottom 5px
        left 8px

      .value
        position absolute
        right 8px
        top 0
        color #535bf2
        font-weight 900
        font-size 42px


</style>