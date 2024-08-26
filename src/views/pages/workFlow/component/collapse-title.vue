<script setup lang="ts">
withDefaults(defineProps<{ title: string; showArrow: boolean }>(), { showArrow: true })

const getTemplate = (title: string) => {
  return `
    <div class="title-header">
      <span class="blue-border"></span>
      <span class="title-header-title">${title}</span>
    </div>
  `
}
</script>

<template>
  <a-collapse v-if="showArrow" class="collapse-title" ghost expand-icon-position="end">
    <a-collapse-panel>
      <template #header>
        <div v-html="getTemplate(title)"></div>
      </template>
      <slot></slot>
    </a-collapse-panel>
  </a-collapse>

  <template v-else>
    <div v-html="getTemplate(title)"></div>
    <slot></slot>
  </template>
</template>

<style lang="less">
.collapse-title {
  border-radius: 0;

  .ant-collapse-header {
    border-radius: 0 !important;
    padding: 0 !important;
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }
}

.title-header {
  min-height: 32px;

  .blue-border {
    display: inline-block;
    margin-right: 6px;
    width: 4px;
    height: 8px;
    margin-bottom: 1px;
    background: #718cff;
    border-radius: 4px;
  }

  .title-header-title {
    display: inline-block;
    font-family:
      Alibaba PuHuiTi,
      Alibaba PuHuiTi;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: 14px;
  }
}
</style>
