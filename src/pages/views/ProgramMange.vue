<template lang="pug">
.container(v-if="data")
  .program-mange
    .title
      a-space
        span 程序分类
        a-button(size="small" type="primary" @click="handleAddNewProgramView")
          i.ri-add-line
    .program-list
      .list-context
        .row-item(v-for="i in data.customer" @click="handleViewProgramByCustomer(i)")
          a-space
            i.ri-checkbox-circle-line(v-if="data.selectCustomer==i" )
            i.ri-checkbox-blank-circle-line(v-else)
            .name {{i}}
    .title 当前发布程序清单 {{data.runCnList.length}}个
    .program-run-cn
      .run-cn-context
        .row-item(v-for="item in data.runCnList")
          .name {{item}}
          .operate
            a-button(type="primary" size="small" @click="handleViewRunProgram(item)").btn
              i.ri-eye-2-line
            a-button(type="danger" size="small" @click="handleReject(item)").btn
              i.ri-delete-back-2-line
  .program-mange
    .title 程序列表
    .program-list-context
      .row-item(v-for="i in data.programList" @click="handleProgram(i)")
        a-space
          i.ri-checkbox-circle-line(v-if="data.programCode.instant.id==i.id" )
          i.ri-checkbox-blank-circle-line(v-else)
          .name MES号:{{i.code}}  工位:{{i.cnStation}}
      a-pagination.page(:total="data.page.total"
        v-model:current="data.page.current"
        @change="handleGetProgram"
        :size="data.page.size" size="small" )
  .program-context
    .title 当前程序名
    .program-info
      a-descriptions(bordered :column="2" )
        a-descriptions-item(label="MES号码:") {{data.programCode.instant.code}}
        a-descriptions-item(label="工序信息:") {{data.programCode.instant.cnStation}}
        a-descriptions-item(label="创建时间:") {{data.programCode.instant.createTime}}
      .program-version
        a-timeline
          a-timeline-item(v-for="item in data.version.programList" )
            .item
              a-space
                .version-item {{item.createTime}} 版本：{{item.cnVersion}}
                a-button(size="small" @click="handleViewProgram(item.ftName)")
                  i.ri-eye-2-line
                a-button(size="small" @click="handlePublish(item.id)")
                  i.ri-share-box-line
          a-timeline-item
            .item
              a-space
                .version-item 新建
                a-button(size="small" @click="handleShowNewProgram")
                  i.ri-file-2-line
      .program-text
        a-textarea(:row="10"
          :value="data.version.fileInfo.context"
          style="min-height:calc(100vh - 400px)")
  a-modal(:visible="data.show" title="新程序" @ok="handleSubmit" @cancel="data.show=false")
    a-form(:model="data.programForm"
      :rules="data.rules"
      :label-col="{span:4}"
      ref="newProgramForm")
      a-form-item(label="项目：" name="code")
        a-input(v-model:value="data.programForm.code")
      a-form-item(label="工序：" name="cnStation")
        a-input(v-model:value="data.programForm.cnStation")
      a-form-item(label="分类：" name="customer")
        a-input(v-model:value="data.programForm.customer")
      a-form-item(label="描述：")
        a-input(v-model:value="data.programForm.dsc")
  a-modal(:visible="data.viewProgram.show"
    @cancel="data.viewProgram.show=false"
    :title="data.viewProgram.title"
    width="800%"
    style="top:20px" )
    a-textarea(:row="10" :value="data.viewProgram.text" style="min-height:80vh")
  a-modal(:visible="data.version.show" @cancel="data.version.show=false")
    a-upload-dragger(:action="`http://${location.hostname}/fileList/upload`"
      :max-count="1"
      @change="handleViewNewProgram"
      :multiple="false")
      i.ri-upload-2-line
      .upload-text 拖入新程序

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {ProgramModel} from "@/module/ProgramModel";
import {FILE_LIST, PROGRAM_LIST} from "@/api";
import type {FormInstance} from "ant-design-vue";

const data = reactive({
  programList: [] as ProgramModel[],
  runCnList: [] as String[],
  customer: [] as String[],
  selectCustomer: "",
  programForm: {} as ProgramModel,
  show: false,
  loading: false,
  rules: {
    code: [{required: true, message: '请填写项目名'}],
    cnStation: [{required: true, message: '请填写工序名'}],
    customer: [{required: true, message: '请填写分类名'}],
  },
  viewProgram: {
    show: false,
    text: '',
    title: ''
  },
  page: {
    size: 10,
    current: 1,
    total: 10
  },
  programCode: {
    selectId: '',
    instant: {} as ProgramModel
  },
  version: {
    show: false,
    form: {},
    fileInfo: {} as { id: string, context: string },
    programList: [] as ProgramModel[]
  }
})

//打开上传新程序窗口
function handleShowNewProgram() {
  data.version.show = true
  data.version.form = {}
}

//上传成功后代码
function handleViewNewProgram(e) {
  if (e.file.status === 'done') {
    data.version.fileInfo.id = e.file.response.data.id
    data.version.fileInfo.context = e.file.response.data.context
    data.version.show = false
    PROGRAM_LIST().add({
      code: data.programCode.instant.code,
      pid: data.programCode.instant.id,
      cnStation: data.programCode.instant.cnStation,
      customer: data.programCode.instant.customer,
      ftName: data.version.fileInfo.id
    })
        .then(() => {
          handleProgram(data.programCode.instant)
        })
  }
}

//选择版本
function handleProgram(e) {
  data.programCode.instant = e
  //获取历史版本
  PROGRAM_LIST().verison({code: e.code}).then(res => {
    data.version.programList = res
  })
}

function handleViewProgramByCustomer(customer) {
  data.selectCustomer = customer
  data.page.current = 1
  handleGetProgram()
}

function handleGetProgram() {
  PROGRAM_LIST().code({
    size: data.page.size
    , current: data.page.current
    , customer: data.selectCustomer
  }).then(res => {
    data.programList = res.records
    data.page.total = res.total
  })
}

function handleAddNewProgramView() {
  data.programForm = {}
  data.show = true
}

const newProgramForm = ref({} as FormInstance)

function handleSubmit() {
  newProgramForm.value.validate().then(() => {
    data.loading = true
    data.programForm.pid = "0"
    PROGRAM_LIST().add(data.programForm).then(() => {
    }).finally(() => {
      data.loading = false
      data.show = false
      init()
    })
  })
}

function init() {
  PROGRAM_LIST().runCN().then(res => {
    data.runCnList = res
  })
  PROGRAM_LIST().customer().then(res => {
    data.customer = res
  })
}

init()

//选择分类
function handleViewRunProgram(title) {
  PROGRAM_LIST().viewProgramView({title})
      .then(res => {
        data.viewProgram.title = title
        data.viewProgram.text = res
        data.viewProgram.show = true
      })
}

//获取查看文件
function handleViewProgram(fileId) {
  FILE_LIST().selectOne(fileId).then(res => {
    data.version.fileInfo.context = res.context || ""
  })
}

//删除发布的文件清单
function handleReject(fileName) {
  PROGRAM_LIST().reject({fileName}).then(() => {
    PROGRAM_LIST().runCN().then(res => {
      data.runCnList = res
    })
  })
}

function handlePublish(id) {
  PROGRAM_LIST().publish({id}).then(() => {
    PROGRAM_LIST().runCN().then(res => {
      data.runCnList = res
    })
  })
}
</script>

<style scoped lang="stylus">

.container
  background-color #eee
  height calc(100vh - 16px)
  width 100%
  border-radius 8px
  display flex
  align-content center
  justify-content center
  padding 8px

.program-list-context
  flex 1
  background-color #ffffff
  position relative

  .page
    position absolute
    bottom 10px
    right 10px


.program-mange
  margin 2px
  width 330px
  display flex
  flex-direction column

.row-item
  display flex
  width calc(100% - 8px)
  background-color #fafafafa
  margin 2px 4px
  padding 4px 8px
  align-items center
  border-radius 4px
  border 1px #535bf266 solid
  box-shadow #eee 2px 2px 10px

  &:hover
    background-color rgba(170, 172, 246, 0.22)

  .name
    flex 1
    line-height 20px

  .operate
    width 60px

.program-run-cn
  background-color #ffffff
  height 500px

  .run-cn-context
    height 496px
    overflow auto


.program-list
  flex 1
  background-color #ffffff
  position relative
  overflow auto
  margin-bottom 4px

  .program-page
    bottom 10px
    right 10px
    position absolute

  .search
    margin 0 4px
    width 322px

.program-context
  margin 2px
  flex 1
  background-color #ffffff
  overflow auto

  .program-info
    padding 8px

    .program-version
      margin-top 8px

    .program-text
      calc(100vh -16px)

.title
  background-color #fff
  font-weight 600
  padding 4px 8px
  border-bottom #ddd solid 1px

</style>