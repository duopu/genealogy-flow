<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import GptPicker from '@/views/pages/workFlow/component/gpt-picker.vue'
import CollapseTitle from '@/views/pages/workFlow/component/collapse-title.vue'
import AddVariableSelect from '@/views/pages/workFlow/component/addVariableSelect.vue'
import ContentEditableInput from '@/views/pages/workFlow/component/contentEditableInput.vue'
import SliderInput from '@/views/pages/workFlow/component/sliderInput.vue'

withDefaults(defineProps<{ data: any }>(), {
  data: {}
})

const promptList = ref([
  { label: 'Prompt&上下文（5轮）', value: 'memoryPrompt' },
  { label: 'Prompt', value: 'prompt' },
  { label: '上下文（5轮）', value: 'memory' }
])

const form = reactive({
  label: '',
  name: '',
  url: '',
  owner: '',
  type: '',
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
</script>

<template>
  <div class="set-node">
    <!--    <content-editable-input></content-editable-input>-->
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-form-item name="label">
        <a-textarea v-model:value="form.label" :rows="4" placeholder="请输入文本内容" />
      </a-form-item>

      <a-form-item name="approve">
        <gpt-picker v-model:value="form.approve"></gpt-picker>
      </a-form-item>

      <a-form-item name="name">
        <collapse-title title="交互方式：" :show-arrow="false">
          <a-radio-group v-model:value="form.name">
            <a-radio v-for="i in promptList" class="ai-radio" :value="i.value" :key="i.value">
              {{ i.label }}
            </a-radio>
          </a-radio-group>
        </collapse-title>
      </a-form-item>

      <a-form-item name="url">
        <collapse-title title="赋值到：" :show-arrow="false">
          <add-variable-select v-model:value="form.url"></add-variable-select>
        </collapse-title>
      </a-form-item>

      <collapse-title title="模型设置：">
        <a-form-item name="url">
          <!--  <a-input
            v-model:value="form.url"
            style="width: 100%"
            addon-before="http://"
            addon-after=".com"
            placeholder="please enter url"
          />-->
          <div class="inline-title">
            <div class="title-text">温度</div>
            <slider-input></slider-input>
          </div>
        </a-form-item>
      </collapse-title>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Owner" name="owner">
            <a-select v-model:value="form.owner" placeholder="Please a-s an owner">
              <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
              <a-select-option value="mao">Maomao Zhou</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Type" name="type">
            <a-select v-model:value="form.type" placeholder="Please choose the type">
              <a-select-option value="private">Private</a-select-option>
              <a-select-option value="public">Public</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="DateTime" name="dateTime">
            <a-date-picker
              v-model:value="form.dateTime"
              style="width: 100%"
              :get-popup-container="(trigger) => trigger.parentElement"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="please enter url description"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<style scoped lang="less">
.llm-textarea {
  height: 104px;
  border-radius: 4px;
  padding: 5px 12px;
  resize: none;
}

.ai-radio {
  display: flex;
  height: 30px;
  line-height: 30px;
}

.inline-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;

  .title-text {
  }
}
</style>
