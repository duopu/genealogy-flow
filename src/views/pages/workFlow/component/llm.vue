<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import CollapseTitle from '@/views/pages/workFlow/component/collapse-title.vue'
import { sexList, zodiacList } from '@/views/pages/workFlow/data/llmData'
import BiographicalEvents from '@/views/pages/workFlow/component/BiographicalEvents.vue'
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'

defineOptions({ name: 'llmNode' })

withDefaults(defineProps<{ data: any }>(), { data: {} })

const form = reactive({
  label: '',
  name: '',
  url: '',
  owner: '',
  sex: '',
  type: '',
  zodiac: '',
  approve: '',
  dateTime: null,
  description: ''
})

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please enter user name' }],
  url: [{ required: true, message: 'please enter url' }],
  owner: [{ required: true, message: 'Please select an owner' }],
  type: [{ required: true, message: 'Please choose the type' }],
  approve: [{ required: true, message: 'Please choose the approve' }],
  dateTime: [{ required: true, message: 'Please choose the dateTime', type: 'object' }],
  description: [{ required: true, message: 'Please enter url description' }]
}

const viewModel = ref('view')
const biographical = ref()
</script>

<template>
  <div class="people-dtl">
    <a-form :model="form" :rules="rules" layout="vertical">
      <collapse-title title="姓名">
        <a-form-item name="name">
          <a-input v-model:value="form.name" style="width: 100%" placeholder="请输入姓名" />
        </a-form-item>
      </collapse-title>

      <collapse-title title="性别">
        <a-form-item name="sex">
          <a-select v-model:value="form.sex" placeholder="选择性别">
            <a-select-option v-for="(zo, index) in sexList" :value="zo.value" :key="index">
              {{ zo.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </collapse-title>

      <collapse-title title="出生日期">
        <a-row :gutter="6">
          <a-col :span="12">
            <a-form-item label="公历" name="birthWithCalendar">
              <a-date-picker class="date-picker" v-model:value="form.dateTime" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="农历" name="birthWithLunar">
              <a-date-picker class="date-picker" v-model:value="form.dateTime" />
            </a-form-item>
          </a-col>
        </a-row>
      </collapse-title>

      <collapse-title title="生肖">
        <a-form-item name="zodiac">
          <a-select v-model:value="form.zodiac" placeholder="选择生肖">
            <a-select-option v-for="(zo, index) in zodiacList" :value="zo.value" :key="index">
              {{ zo.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </collapse-title>

      <collapse-title title="头像">
        <a-form-item>
          <a-upload action="/upload.do" list-type="picture-card" :show-upload-list="false">
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传头像</div>
            </div>
          </a-upload>
        </a-form-item>
      </collapse-title>

      <collapse-title title="生平重要事件">
        <template v-slot:title>
          <a-radio-group v-model:value="viewModel" button-style="solid" class="view-radio">
            <a-radio-button value="view">观看模式</a-radio-button>
            <a-radio-button value="edit">编辑模式</a-radio-button>
          </a-radio-group>
          <a-tooltip title="添加事件" v-if="viewModel === 'edit'">
            <PlusCircleOutlined class="add-icon" @click="biographical.addEvent()" />
          </a-tooltip>
        </template>
        <biographical-events ref="biographical" v-model:viewModel="viewModel"></biographical-events>
      </collapse-title>

      <a-form-item name="label" label="生平简介" style="padding-bottom: 40px">
        <a-textarea v-model:value="form.label" :rows="4" placeholder="请输入文本内容" />
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="less">
.people-dtl {
  .date-picker {
    width: 100%;
  }

  .view-radio {
    margin-left: auto;
  }

  .add-icon {
    font-size: 18px;
    margin-left: 16px;
    cursor: pointer;
    color: #1677ff;
  }
}
</style>
