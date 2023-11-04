<template lang="pug">
transition(enter-active-class="animate__animated animate__shakeX" leave-active-class="animate__animated animate__fadeOutUp" )
  div.message-container(v-show="visible")
    div.message-content
      i.ri-alert-line
      span(v-text="config.content")
</template>

<script lang="ts" setup>
import {ref} from "vue";

const visible = ref(false)
const props = defineProps<{
  config: Object, // 消息配置项
  remove: any// 取消挂载回调
}>()

// 打开消息
const onOpen = (config: any) => {
  setTimeout(() => {
    visible.value = true;
  }, 10)

  // 指定时间后移除消息
  if (config.duration !== 0) {
    setTimeout(() => {
      onClose();
    }, config.duration);
  }
}

onOpen(props.config)

// 消息关闭
const onClose = () => {
  visible.value = false;
  setTimeout(() => {
    props.remove()
  }, 200)
};

</script>

<style lang="stylus">

.message
  position: fixed;
  top: 0;
  width: 100vw;
  text-align: center;
  box-sizing: border-box;
  z-index: 9999;
  transform: translateZ(9999px);
  padding-top: 8px;
  transition: top .4s ease;
  background-color: #fd4f4d;

  .message-container
    margin-bottom: 6px;
    color: #fff;
    height: 0.6rem;

    .message-content
      height: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;

      i
        vertical-align: middle;
        font-size: 0.3rem;
        margin-right: 2px;


      span
        vertical-align: middle;
        font-size: 14px;

</style>
