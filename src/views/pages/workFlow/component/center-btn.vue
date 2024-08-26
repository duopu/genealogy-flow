<script setup lang="ts">
const emit = defineEmits(['ok', 'cancel'])
withDefaults(defineProps<{ okLoading: boolean }>(), {
  okLoading: false
})
</script>

<template>
  <div class="center-btn">
    <a-button class="btn-item" @click="emit('cancel', $event)">取消</a-button>
    <a-button type="primary" class="btn-item" @click="emit('ok', $event)" :loading="okLoading">
      确定
    </a-button>
  </div>
</template>

<style scoped lang="less">
.center-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  .btn-item {
    margin-left: 8px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    padding: 0 26px;
    font-weight: 400;
    font-size: 14px;
    border-radius: 4px;
    transition:
      color 0.3s ease-out,
      background 0.3s linear,
      border 0.3s ease-out;
  }
}
</style>
