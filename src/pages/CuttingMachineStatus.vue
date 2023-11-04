<script setup lang="ts">
import {reactive} from "vue";

const data=reactive({
  // url:`http://${location.hostname}:3000/d/a19fc047-be1e-4d00-9cd1-99fa9ef2ee50/j101?orgId=1&refresh=5s&kiosk&theme=light`
  url:`http://192.168.6.1:3000/d/a19fc047-be1e-4d00-9cd1-99fa9ef2ee50/j101?orgId=1&refresh=5s&kiosk&theme=light`
})
</script>
<template>
<iframe :src="data.url" frameborder="0" style="width:calc(100vw - 90px);height: 700px"></iframe>
</template>

<style scoped>

</style>