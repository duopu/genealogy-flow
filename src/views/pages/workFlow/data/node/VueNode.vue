<template>
  <div>最大的韭菜哈哈</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProgressNode',
  inject: ['getNode', 'getGraph'],
  data() {
    return {
      percentage: 80
    }
  },
  mounted() {}
})
</script>
