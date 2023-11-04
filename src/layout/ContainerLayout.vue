<template lang="pug">
.left-nav-bar
  img.logo(src="@/assets/logo.png"  alt="")
  .nav-item(@click="$router.push('/cutting1Status')")
    i.ri-settings-2-line
    .nav-item-text 洗切1组设备状态
  .nav-item(@click="$router.push('/programManage')")
    i.ri-upload-2-line
    .nav-item-text 程序管理
  .nav-item.about
    i.ri-information-line
    .nav-item-text 关于

.layout-body.beauty-scroll
  .content
    div(style="position: relative")
      router-view/

</template>

<script lang="ts" setup>
import {createVNode, onMounted, reactive} from "vue";

import {Modal} from "ant-design-vue";

const data = reactive({
  menus: [{
    name: '首页',
    path: 'index',
    icon: ''
  }]
})

//监听路由参数更新菜单

onMounted(() => {

})

</script>

<style scoped lang="stylus">
primary-color = #0747A6
.left-sub-nav-slide
  position fixed
  left 55px
  z-index 60
  height 100vh
  overflow-x: hidden;
  overflow-y: auto;
  background-color #F4F5F7
  width 180px
  @media (max-width: 999px) {
    display: none;
  }
  padding: 0 16px 24px;

.path-info
  display: flex;
  margin: 20px 4px;
  padding 6px
  background-color #fff
  font #5E6C84
  justify-content center
  border-radius 6px
  font-weight bold

  i
    margin-right 4px

.divider
  margin-top: 5px;
  padding-top: 15px;
  border-top: 1px solid #C1C7D0;

.active
  color primary-color
  font-weight bold
  background-color #7ec1ff55

.sub-item
  position: relative;
  display: flex;
  padding: 8px 12px;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;

  &:hover
    background-color #ebecf0
    font-weight bold

  i
    margin-right: 10px


.left-nav-bar
  z-index 100
  position fixed
  height 100vh
  top 0
  left 0
  background-color primary-color
  width 60px
  transition all 0.2s
  overflow-x hidden
  overflow-y hidden
  transform translateZ(0)
  border-top-right-radius 6px
  border-bottom-right-radius 6px

  &:hover
    width 255px
    box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.6);

  .logo
    display: inline-block;
    margin-left: 5px;
    width 50px
    padding: 20px 5px;

  .logout
    position absolute !important
    bottom 57px

  .about
    position absolute !important
    bottom 15px

  .nav-item
    position: relative;
    width: 100%;
    height: 42px;
    line-height: 42px;
    padding-left: 60px;
    color: #deebff;
    transition: color 0.1s
    cursor: pointer;
    user-select: none;
    overflow-x hidden
    overflow-y hidden

    &:hover
      background: rgba(255, 255, 255, 0.1);

    i
      position: absolute;
      left: 17px;
      margin-right 3px
      font-size 26px

    .nav-item-text
      position: relative;
      font-size 20px
      right: 10px;
      visibility: hidden
      opacity: 0;
      text-transform: uppercase;
      transition: all 0.1s;
      transition-property: right, visibility, opacity;
      font-weight bold

      /:hover &
        right: 0;
        visibility: visible;
        opacity: 1;

.beauty-scroll
  -ms-overflow-style: none;
  position: relative;

  &::-webkit-scrollbar
    width: 0;
    height: 0;

  &::-webkit-scrollbar-thumb
    border-radius: 0;
    background: #111;

  &::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
    border-radius: 0;
    background: #111;

.layout-body
  margin-left 60px
  width calc(100vw - 60px)
  padding 8px
  @media (max-width: 999px) {
    margin-left 60px
    width calc(100vw)
  }

  .header
    padding 4px
    border-bottom 1px solid #ccc

    .title
      font-size 17px
      font-weight bolder



</style>
