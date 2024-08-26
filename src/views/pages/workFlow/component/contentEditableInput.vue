<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddVariableSelect from '@/views/pages/workFlow/component/addVariableSelect.vue'
import _ from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'

const editableDivRef = ref<HTMLDivElement | null>(null)
const props = withDefaults(
  defineProps<{
    inputClass: any
    contentId: string
    placeholder: string
  }>(),
  {
    inputClass: {},
    contentId: 'contentId',
    placeholder: '请输入'
  }
)

const showSelection = ref<boolean>(false)
const inputVal = ref<string>('')
const selData = ref<string>('')
const textVariableArray = ref<any[]>([])
const savedSelection = ref<any>(undefined)

const emit = defineEmits(['infoChange', 'action'])

// 监听输入框显示选择框
const onInput = (event: Event, isInit: boolean = false) => {
  onSelectionChange()
  const text = (isInit ? event : (event.target as HTMLDivElement).innerText) as string
  inputVal.value = text
  selData.value = ''

  handleSet()
  updateVariable()

  if (!text.length) {
    textVariableArray.value = []
    return false
  }
}

// 当用户粘贴文本时，只保留无格式的纯文本
const pasteInput = (event: ClipboardEvent) => {
  event.preventDefault()
  const clipboardData = event.clipboardData || (window as any).clipboardData
  const plainText = clipboardData.getData('text/plain')
  document.execCommand('insertText', false, plainText)
}

// 可编辑 div 失焦记录位置
const editDivBlur = () => {
  savedSelection.value = (window as any).getSelection().getRangeAt(0)
}

// 光标前两个字符是 {& 就唤起下拉框
const onSelectionChange = () => {
  const selection: any = window.getSelection()

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const cursorPosition = range.startOffset
    const contentBeforeCursor = range.startContainer.textContent?.slice(0, cursorPosition) || ''

    editDivBlur()

    const lastTwoChars = contentBeforeCursor.slice(-2)
    showSelection.value = lastTwoChars === '{&'
  }
}

const handleSet = (change?: boolean) => {
  const editableDiv = document.getElementById(props.contentId)
  const innerHTML = editableDiv?.innerHTML as string
  if (change) {
    editableDiv!.innerHTML = replaceStr(innerHTML)
  }
  // 处理输入文本和变量的数组
  textVariableArray.value = handleVariableInput(editableDiv!.innerHTML)
}

// 替换 {& 为空
const replaceStr = (str: string, replaceVal: string = '') => {
  let data = _.replace(str, '{&', replaceVal)
  data = _.replace(str, '{&amp;', replaceVal)
  return data
}

// 值更新传给父组件
const updateVariable = () => {
  const editableDiv = document.getElementById(props.contentId)
  const innerHTML = editableDiv?.innerHTML
  const params = {
    innerHTML, // 输入框的值
    textVariableArray: textVariableArray.value // 输入文本和变量的数组
  }
  emit('infoChange', params)
}

const log = () => {
  console.log('log11111 inputVal:', inputVal.value)
}

// 可编辑div内部插件span元素占位符
const insertTag = (text: string) => {
  const spanId = uuidv4()
  const tagName = 'span'
  const range = savedSelection.value
  const newNode = document.createElement(tagName)

  newNode.textContent = `{${text}}`
  newNode.className = 'insert-span-box'
  newNode.contentEditable = 'false'
  newNode.id = spanId

  range.deleteContents()
  range.insertNode(newNode)

  // 替换 {& 为空
  inputVal.value = replaceStr(inputVal.value, text)

  showSelection.value = false // 隐藏 select选择框

  // 变量参数处理
  handleSet(true)

  // 更新值给父组件
  updateVariable()

  setTimeout(() => {
    setCursorAfterSpan(spanId) // 将光标移入到span之后
    asyncExecuteInput()
  })
}

// 可编辑div根据指定的id重新设置光标位置
const setCursorAfterSpan = (spanId: string) => {
  const spanElement = document.getElementById(spanId)
  if (spanElement) {
    const range = document.createRange()
    const selection = window.getSelection()
    range.setStartAfter(spanElement) // 设置 Range 的起始位置在 span 元素之后
    range.setEndAfter(spanElement) // 设置 Range 的结束位置在 span 元素之后
    selection!.removeAllRanges()
    selection!.addRange(range)
  }
}

// 异步 手动触发 可编辑 div 的input 事件，规避 粘贴文本和 inputVal 值不同步的问题
const asyncExecuteInput = () => {
  setTimeout(() => {
    const div = editableDivRef.value as HTMLDivElement
    const inputEvent = new Event('input', { bubbles: true, cancelable: true })
    div.dispatchEvent(inputEvent)
  }, 0)
}

/*
// 监听删除事件 删除整个span元素
// @HostListener('keydown', ['$event'])
const onKeyDown = (event: KeyboardEvent) => {
  const range = window.getSelection().getRangeAt(0)
  const currentNode = range.commonAncestorContainer

  let trimVal = this.editableDivRef.nativeElement?.innerHTML?.trim?.()
  if (trimVal === '<br>' || trimVal === '<br/>' || trimVal === '<br />') {
    this.editableDivRef.nativeElement.innerHTML = ''
    this.asyncExecuteInput()
  }

  if (currentNode.nodeType === Node.TEXT_NODE) {
    const parentElement = currentNode.parentElement
    if (parentElement.nodeName === 'SPAN') {
      if (event.key === 'Backspace' && range.collapsed) {
        const parentNode = parentElement.parentNode
        const prevSibling = parentElement.previousSibling
        const nextSibling = parentElement.nextSibling
        parentNode.removeChild(parentElement)
        // 将光标设置在删除的元素前面
        range.selectNodeContents(prevSibling || nextSibling)
        range.collapse(!prevSibling)
        event.preventDefault()
      }
    }
  }
}
*/

//将变量输入框的值处理成后台需要的格式
const handleVariableInput = (str: string) => {
  const arr: any[] = str.split('<span class="insert-span-box"')
  const copyArr: any = []
  arr.forEach((item) => {
    if (!item.type) {
      if (item.includes('}</span>')) {
        // mixArr 变量存在的文本， 1：文本（不一定存在）
        const mixArr = item.split('}</span>')
        // variableArr：1变量值，
        const variableArr = mixArr[0].split('>{')
        copyArr.push({ type: 'variable', value: variableArr[1] })
        if (mixArr[1] !== '') {
          const newItem = { type: 'text', value: mixArr[1] }
          copyArr.push({ ...newItem })
        }
      } else {
        if (!item.includes('<span>')) {
          copyArr.push({ type: 'text', value: item })
        }
      }
    }
  })

  copyArr.forEach((item: any, i: number) => {
    if (item.type === 'text') {
      copyArr[i].value = handleInnerHTML(item.value)
    }
  })

  return copyArr
}

// 去除标签
const handleInnerHTML = (innerHTML: string) => {
  const el = document.createElement('div')
  el.innerHTML = innerHTML
  return el.innerText
}
</script>

<template>
  <!--  <a-button @click="log">log</a-button>-->
  <div class="edit-flow-input">
    <div
      ref="editableDivRef"
      contentEditable="true"
      @input="onInput($event)"
      @paste="pasteInput($event)"
      @blur="editDivBlur()"
      @click="onSelectionChange()"
      @keyup="onSelectionChange()"
      class="edit-box"
      :id="contentId"
      :class="inputClass"
    ></div>

    <div class="placeholder" v-if="!inputVal">
      {{ placeholder }}
    </div>

    <!-- 下拉框 -->
    <div v-if="showSelection" class="edit-select-box">
      <add-variable-select v-model:value="selData" @update:value="insertTag"></add-variable-select>
    </div>
  </div>
</template>

<style scoped lang="less">
.edit-flow-input::-webkit-scrollbar {
  width: 0;
}

.edit-flow-input {
  position: relative;

  .edit-box {
    padding: 5px 12px;
    border: 1px solid #ebecf0;
    border-radius: 4px;
    height: 90px;
    font-size: 14px;
    overflow-y: scroll;
    word-break: break-all;
    color: #333333;

    ::v-deep .insert-span-box {
      background-color: rgb(230, 240, 255);
      color: rgb(36, 104, 242);
      pointer-events: none;
      margin: 0 3px;
      padding: 0 2px;
    }

    &:empty::before {
      //content: attr(placeholder);
      color: #c2c4d1;
    }
  }

  .placeholder {
    position: absolute;
    top: 6px;
    left: 13px;
    font-family:
      Source Han Sans CN,
      Source Han Sans CN;
    font-weight: 400;
    font-size: 14px;
    color: #c2c4d1;
  }

  [contentEditable]:hover,
  [contentEditable]:focus {
    border: 1px solid #4e6fff;
    outline: none;
  }

  [contenteditable]:focus {
    box-shadow: 0 0 0 2px #dce2ff;
  }

  .edit-select-box {
    position: absolute;
    top: 38px;
    left: 0;
    min-width: 160px;
    background: white;
    z-index: 1;
    width: 100%;
    padding: 8px;
    box-shadow:
      0 5px 20px 0 rgba(36, 47, 96, 0.08),
      0 2px 8px 0 rgba(36, 47, 96, 0.04);
    border-radius: 4px;
  }

  .edit-flow-sel {
    width: 100%;
  }
}

.flow-add-container {
  padding: 0 12px;
}
</style>
