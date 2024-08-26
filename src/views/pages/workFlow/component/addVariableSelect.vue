<script setup lang="ts">
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { queryVariable, saveVariable } from '@/api/apiSave'
import CenterBtn from '@/views/pages/workFlow/component/center-btn.vue'

defineProps<{ value: string }>()

const emit = defineEmits(['update:value'])

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true
    }
  },
  render() {
    return this.vnodes
  }
})

const items = ref<{ label: string; value: string }[]>([])

const handleOk = () => {
  let list = [...toRaw(items.value), { label: formValue.variable, value: formValue.variable }]
  okLoading.value = true
  saveVariable({ apiName: 'save_variable', apiData: { saveData: { list } } })
    .then((res) => {
      open.value = false
    })
    .catch((err) => {
      console.log('save_variable err:', err)
    })
    .finally(() => {
      okLoading.value = false
      testQuery()
    })
}

const testQuery = () => {
  queryVariable({ apiName: 'save_variable' }).then((res) => {
    items.value = res.data?.list || []
  })
}
testQuery()

const open = ref<boolean>(false)
const okLoading = ref<boolean>(false)

const formValue = reactive<{ variable: string }>({ variable: '' })
</script>

<template>
  <a-select
    class="add-variable-select"
    :value="value"
    :options="items.map((item) => ({ ...item }))"
    @change="(val: string) => $emit('update:value', val)"
    :field-names="{ label: 'label', value: 'value' }"
  >
    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0" />
      <a-button type="link" @click="open = true">
        <PlusOutlined />
        新增
      </a-button>
    </template>
  </a-select>

  <a-modal
    wrapClassName="add-variable-modal"
    v-model:open="open"
    centered
    :closable="false"
    z-index="1500"
  >
    <template #title>
      <div class="modal-title">
        <div class="title">新增变量</div>
        <CloseOutlined class="modal-close" />
      </div>
    </template>
    <a-form ref="formRef" :model="formValue">
      <a-form-item
        name="variable"
        :rules="[
          { required: true, message: '请输入变量名称' },
          {
            pattern: /^[A-Za-z][A-Za-z0-9_]*$/,
            message: '只能输入30位以内，变量名称只能包含字母、数字和下划线'
          }
        ]"
      >
        <a-input v-model:value="formValue.variable" maxlength="30" />
      </a-form-item>
    </a-form>
    <template #footer>
      <center-btn @ok="handleOk" :okLoading="okLoading" @cancel="open = false"></center-btn>
    </template>
  </a-modal>
</template>

<style lang="less">
.add-variable-select {
  width: 100%;
}

.add-variable-modal {
  .ant-modal-content {
    padding: 0 0 22px 0;
  }

  .ant-modal-body {
    padding: 20px 40px 0 40px;
  }

  .modal-title {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f9f9fe;
    border-radius: 8px 8px 0 0;

    .title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .modal-close {
      cursor: pointer;
      color: #a9acba;
      font-size: 16px;
    }
  }
}
</style>
