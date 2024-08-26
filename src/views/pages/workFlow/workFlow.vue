<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type NodeItemProps, Nodes_List } from '@/views/pages/workFlow/data/work-flow.enum'
import { addNode, initGraph } from '@/views/pages/workFlow/data/operateNode'
import { bindEvent } from '@/views/pages/workFlow/data/operateEvent'
import NodeDetail from './component/nodeDetail.vue'

const nodeDetail = ref<any>()
const nodeInfo = ref<any>({})

const nodesList = ref<NodeItemProps[]>([...Nodes_List])

onMounted(() => {
  initGraph().then((flow) => {
    bindEvent(flow.graphModel.eventCenter, {
      afterAdd: (node: any) => {
        nodeInfo.value = node.data
        console.log('afterAdd', node, nodeDetail.value.open())
      }
    })
  })
})
</script>

<template>
  <!--  <a-button type="primary">Primary Button</a-button>-->

  <div class="work-flow-manage">
    <div class="le">
      <div class="flow-drag-content point">
        <div class="content-node" v-for="item in nodesList" :key="item.id">
          <div class="title">
            {{ $t(item.name) }}
          </div>
          <div v-for="ele in item.children" class="item" @mousedown="addNode(ele)" :key="ele.id">
            <img :src="`${ele.src}`" alt="" class="menu-pic" />
            <span>{{ $t(ele.name) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div id="container" class="container"></div>
  </div>
  <!--  {{ $t('message.hello') }}-->
  <!--  {{ $t('flow.add') }}-->
  <NodeDetail ref="nodeDetail" :data="nodeInfo"></NodeDetail>
</template>

<style lang="less">
@import '@logicflow/core/dist/style/index.css';
@import '@logicflow/extension/lib/style/index.css';
@import './workFlow.less';
</style>
