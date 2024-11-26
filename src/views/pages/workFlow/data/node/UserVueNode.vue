<template>
  <div class="user-node">
    <div class="user-header">
      <div class="user-pic">
        <img :src="src" alt="" />
        <div v-if="tag" class="triangle"></div>
      </div>
      <div class="user-info">
        <div class="name">
          {{ label }}
        </div>
        <div class="desc">年龄： {{ getAge(date) }} &nbsp;&nbsp;生肖：{{ getZodiac(date) }}</div>
        <div class="desc">{{ desc }}</div>
      </div>
    </div>
    <div class="user-content">
      <div class="content-item">
        <div class="content-item-title">
          <span>姓名</span>
          <span>张三</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { zodiacList } from '../llmData'

defineProps<{
  properties: any
  text: any
  tag?: boolean
}>()

import userImg from '@/assets/img/flow/user.png'

const src = ref(userImg)

const date = ref('1990-01-01')

const label = ref('韭菜根')
const desc = ref('韭菜年韭菜月韭菜日出生的大韭菜')

const getAge = (str: string) => {
  const date = new Date(str)
  const now = new Date()
  const age = now.getFullYear() - date.getFullYear()
  return age
}

const getZodiac = (str: string) => {
  const date = new Date(str)
  const year = date.getFullYear()
  // 使用 (年份 - 1900) % 12 来计算正确的生肖索引
  return zodiacList[(year - 1900) % 12].name
}
</script>

<style scoped lang="less">
.user-node {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
}

.user-header {
  display: flex;
  margin-bottom: 8px;

  .user-pic {
    position: relative;
    width: 70px;
    height: 90px;
    border-radius: 8px;
    margin-right: 12px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .triangle {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 20px 20px 0 0;
      border-color: transparent #1f0606 transparent transparent;
    }
  }

  .user-info {
    .name {
      font-size: 14px;
    }
    .desc {
      font-size: 12px;
      line-height: 16px;
      color: #999;
    }
  }
}
</style>
