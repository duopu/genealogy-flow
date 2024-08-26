<script setup lang="ts">
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

defineProps({
  viewModel: {
    type: String,
    default: 'view'
  }
})

const eventList = ref([
  {
    name: '事件1',
    detail: '事件详情1',
    eventTime: '',
    id: crypto.randomUUID()
  }
])

const deleteItem = (index: number) => {
  console.log(index)
  eventList.value.splice(index, 1)
}

const getColor = (index: number) => {
  const flag = (index % 4) + ''
  switch (flag) {
    case '0':
      return 'blue'
    case '1':
      return 'red'
    case '2':
      return 'gray'
    default:
      return 'green'
  }
}

const addEvent = () => {
  eventList.value.push({
    name: ``,
    detail: ``,
    eventTime: '',
    id: crypto.randomUUID()
  })
}

defineExpose({
  addEvent
})
</script>

<template>
  <div class="bio-event">
    <template v-if="viewModel === 'edit'">
      <div class="bio-row-box" v-for="(event, index) in eventList" :key="event.id">
        <div class="bio-row">
          <div class="event-item">
            <span class="bio-label">事件名称</span>
            <a-input v-model:value="event.name" allow-clear></a-input>
          </div>

          <div class="event-item">
            <span class="bio-label">事件时间</span>
            <a-date-picker class="date-picker" v-model:value="event.eventTime" allow-clear />
          </div>

          <div class="event-item">
            <span class="bio-label">事件描述</span>
            <a-textarea v-model:value="event.detail" placeholder="请输入文本内容"></a-textarea>
          </div>

          <div class="event-item">
            <span class="bio-label">相关图片</span>
            <a-upload action="/upload.do" list-type="picture-card">
              <div>
                <PlusOutlined />
                <div style="margin-top: 8px">上传图片</div>
              </div>
            </a-upload>
          </div>
        </div>
        <div class="row-operate">
          <a-tooltip color="#ff4d4f">
            <template #title>删除这一条</template>
            <DeleteOutlined class="operate-icon" @click="deleteItem(index)" />
          </a-tooltip>
        </div>
      </div>
    </template>

    <a-timeline v-else>
      <a-timeline-item
        :color="getColor(index)"
        v-for="(event, index) in eventList"
        :key="event.name"
      >
        <div class="timeline-dtl">事件名称：{{ event.name }}</div>
        <div class="timeline-dtl">事件时间：{{ event.eventTime }}</div>
        <div class="timeline-dtl">事件描述：{{ event.detail }}</div>
      </a-timeline-item>
    </a-timeline>

    <a-empty
      v-if="eventList.length === 0"
      image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
      :image-style="{
        height: '60px',
        marginTop: '50px'
      }"
    >
      <template #description>
        <span style="color: #999">暂无相关事件，请点击添加按钮进行添加 </span>
      </template>
    </a-empty>
  </div>
</template>

<style lang="less">
.bio-event {
  margin-top: 10px;

  .bio-row-box {
    display: flex;
    border-bottom: 1px solid rgba(204, 204, 204, 0.2);

    .bio-row {
      flex: 1;
      padding: 10px 8px 0 8px;

      .event-item {
        margin-bottom: 10px;
        display: grid;
        grid-template-columns: 70px 4fr;
      }
    }

    .row-operate {
      display: flex;
      flex-direction: column;
      align-content: flex-end;
      margin-left: 5px;

      .operate-icon {
        color: #ff4d4f;
        font-size: 18px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }

  .timeline-dtl {
    margin-bottom: 6px;
    color: #333333;
  }

  .ant-timeline .ant-timeline-item {
    padding-bottom: 8px;
  }

  .ant-empty-description {
    margin-bottom: 50px;
  }
}
</style>
