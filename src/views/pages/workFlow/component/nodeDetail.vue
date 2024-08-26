<template>
  <!--  <a-button type="primary" @click="showDrawer">Open</a-button>-->
  <a-drawer
    v-model:open="visible"
    class="custom-class"
    :width="config.width"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    :maskStyle="{ background: 'transparent' }"
    :bodyStyle="{ padding: '0px' }"
    :headerStyle="{ padding: '0px' }"
    :closable="config.closable"
    placement="right"
    @after-open-change="afterOpenChange"
    @close="close()"
  >
    <template #title>
      <div class="draw-title">
        <img class="draw-logo" :src="data?.properties?.src" alt="" />
        <div class="draw-title-text">{{ data?.properties?.name || data?.properties?.place }}</div>
        <CloseOutlined class="draw-close" @click="close()" />
      </div>
    </template>
    <div class="draw-body">
      <!-- <n-ai-set :data="data" /> -->
      <LlmNode :data="data" />
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
// import NAiSet from '@/views/pages/workFlow/component/nAiSet.vue'
import LlmNode from '@/views/pages/workFlow/component/llm.vue'

defineOptions({
  name: 'NodeDetail'
})

interface IProps {
  config?: any
  data?: any
}

withDefaults(defineProps<IProps>(), {
  config: {
    width: 500,
    mask: true,
    closable: false
  },
  data: {}
})

const afterOpenChange = (bool: boolean) => {
  console.warn('afterOpenChange', bool)
}

const visible = ref(false)

onMounted(() => {
  // console.warn('onMounted', props)
})

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

defineExpose({ open, close })
</script>
<style lang="less">
@import './nodeDetail.less';

::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #f0f2f5;
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #bfc3c6;
}
::-webkit-scrollbar-track {
  border-radius: 4px;
  background-color: #f0f2f5;
}
</style>
