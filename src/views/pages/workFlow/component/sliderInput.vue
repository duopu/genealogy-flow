<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const inputValue = ref<number>(1)

withDefaults(defineProps<{ sliderWidth: number; inputWidth: number; textValue: string }>(), {
  sliderWidth: 90,
  inputWidth: 90,
  textValue: ''
})

const emit = defineEmits<{
  (e: 'update:textValue', value: number): void
}>()

watchEffect(() => {
  emit('update:textValue', inputValue.value)
})
</script>

<template>
  <div class="slider-input">
    <a-slider
      v-model:value="inputValue"
      :min="1"
      :max="20"
      class="s-slider"
      :style="{ width: sliderWidth + 'px' }"
    />
    <a-input-number
      v-model:value="inputValue"
      :min="1"
      :max="20"
      class="s-input"
      :style="{ width: inputWidth + 'px' }"
    />
  </div>
</template>

<style lang="less">
.slider-input {
  display: flex;
  align-items: center;
  gap: 10px;

  .ant-slider-track {
    background: #4e6fff;
  }
}
</style>
