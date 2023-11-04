<script setup lang="ts">
import * as mqtt from "mqtt/dist/mqtt.min";
const client = mqtt.connect('mqtt://192.168.81.20:9001')

// 成功连接后触发的回调
client.on('connect', () => {
  console.log('已经连接成功');
  // 订阅主题，这里可以订阅多个主题
  client.subscribe(['/test'])
  // client.subscribe([topic, topic1], () => {
  //   console.log(`订阅了主题 ${[topic, topic1].join('和')}`)
  // })
});

client.on('message',(res,payload)=>{
  console.log(res)
  console.log(payload.toString())
})

</script>

<template lang="pug">
span 设备状态
</template>

<style scoped lang="stylus">

</style>