import { HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { createApp, h } from 'vue'
import VueNode from './UserVueNode.vue'
import { NodeType } from '../../type/type'

class UserNode extends HtmlNode {
  private isMounted: boolean
  private r: any
  private app: any

  constructor(props: { model: { getProperties: () => any; inputData: any } }) {
    super(props)
    this.isMounted = false
    this.r = h(VueNode, {
      properties: props.model.getProperties(),
      text: props.model.inputData
    })
    this.app = createApp({
      render: () => this.r
    })
  }

  setHtml(rootEl: HTMLElement) {
    if (!this.isMounted) {
      this.isMounted = true
      const node = document.createElement('div')
      rootEl.appendChild(node)
      this.app.mount(node)

      // 添加一个延时来确保 Vue 组件已经渲染完成
      setTimeout(() => {
        const height = node.offsetHeight
        // 更新节点模型的高度
        this.props.model.height = height
        // 通知画布重新渲染
        this.props.model?.resize()
      }, 0)
    } else {
      this.r.component.props.properties = this.props.model.getProperties()
      // 当属性更新时也需要重新计算高度
      const node = rootEl.firstChild as HTMLElement
      const height = node.offsetHeight
      this.props.model.height = height
      this.props.model?.resize()
    }
  }
}

class UserNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.width = 300
    this.height = 100
    this.text.editable = false
    this.inputData = this.text.value
  }

  getOutlineStyle() {
    const style: any = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
  }

  // 添加 resize 方法
  resize() {
    // 触发节点更新
    this.graphModel.eventCenter.emit('node:resize', {
      node: this
    })
  }
}

export default {
  type: NodeType.USER_NODE,
  model: UserNodeModel,
  view: UserNode
}
