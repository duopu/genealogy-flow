import { type ConnectRule, HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { edgesValidate, nodeValidate } from '@/views/pages/workFlow/data/flow-rules'
import { NodeType } from '@/views/pages/workFlow/type/type'

class CodeNode extends HtmlNode {
  constructor(props) {
    super(props)
  }

  setHtml(rootEl: HTMLElement): void {
    const { properties, id } = this.props.model
    const { src, place, body, oldHeight, nodeParams } = properties
    const label = nodeParams?.label

    const el = document.createElement('div')

    const classNames = properties.active
      ? `text-node-wrapper flow-node ${id} active`
      : `text-node-wrapper flow-node ${id}`
    el.className = classNames

    el.innerHTML = `
      <div class="text-body node-body llm-body" #codeNode>
        <img src="${src}" class="node-child-pic" alt="" />
        <span class="${label ? 'llm-label-text' : ''}">${label || place}</span>
      </div>
    `

    rootEl.innerHTML = ''
    rootEl.appendChild(el)

    const dlDiv = document.getElementsByClassName(id)
    const newVal = dlDiv[0]?.clientHeight

    if (oldHeight) {
      if (newVal !== oldHeight) {
        const { graphModel, model } = this.props
        graphModel.eventCenter.emit('custom:height', model)
      }
    }
  }
}

class CodeTextModel extends HtmlNodeModel {
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
  }

  changeField(data) {
    this.setAttributes()
  }

  setAttributes() {
    // console.log(this, this.properties.oldHeight, 'properties');
    const { oldHeight } = this.properties
    const { y } = this
    const hi = oldHeight ? oldHeight : 50
    const dlDiv = document.getElementsByClassName(this.id)
    const newVal = dlDiv[0]?.clientHeight

    if (oldHeight && newVal && newVal !== oldHeight) {
      this.y = y + (newVal - oldHeight) / 2
    }
    this.width = 300
    this.height = hi
    this.text.editable = false
  }

  getAnchorStyle(anchorInfo) {
    const { isHovered, isSelected } = this
    const style = super.getAnchorStyle(anchorInfo)
    if (isHovered) {
      style.r = 6
      style.stroke = '#4E6FFF'
      style.strokeWidth = 2
    } else if (isSelected) {
      style.stroke = '#4E6FFF'
    } else {
      style.stroke = '#A9ACBA'
    }
    return style
  }

  getDefaultAnchor() {
    const { width, height, x, y, id } = this
    return [
      { x: x - width / 2 + 4, y, name: 'left', id: `${id}_1`, edgeAddable: false },
      { x: x + width / 2 - 4, y, name: 'right', id: `${id}_2` }
    ]
  }
  getConnectedSourceRules(): ConnectRule[] {
    const rules = super.getConnectedSourceRules()
    nodeValidate(rules)
    return rules
  }
  getConnectedTargetRules(): ConnectRule[] {
    const rules = super.getConnectedTargetRules()
    edgesValidate(rules)
    return rules
  }
}

export default {
  type: NodeType.CODE_NODE,
  view: CodeNode,
  model: CodeTextModel
}

export interface InputItemProps {
  field?: string
  rightInfo?: RightInfoItem
  defaultValue?: string
}

export interface RightInfoItem {
  type?: string
  defaultValue?: string
  paramType?: keyof typeof InputItemType
}

export enum InputItemType {
  text = 'text',
  variable = 'variable'
}
