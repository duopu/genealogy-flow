import { type ConnectRule, HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { edgesValidate, nodeValidate } from '@/views/pages/workFlow/data/flow-rules'
import { NodeType } from '@/views/pages/workFlow/type/type'

class AiSetNode extends HtmlNode {
  constructor(props: any) {
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

    /*
    let html = `
      <div class="text-body node-body" #aiSetNode>
        <img src="${src}" class="node-child-pic" alt="" />
    `;
    if (body && body !== '') {
      html += `
          <span>${body}</span>
        </div>
      `;
    } else {
      html += `
          <span class="place">${place}</span>
        </div>
      `;
    }
    el.innerHTML = html;
    */

    el.innerHTML = `
      <div class="text-body node-body llm-body" #aiSetNode>
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

class AiSetTextModel extends HtmlNodeModel {
  getOutlineStyle() {
    const style: any = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
  }

  changeField() {
    this.setAttributes()
  }

  setAttributes() {
    // console.log(this, this.properties.oldHeight, 'properties');
    const { oldHeight } = this.properties
    const { y } = this
    const hi = oldHeight ? oldHeight : 50
    const dlDiv = document.getElementsByClassName(this.id)
    const newVal = dlDiv[0]?.clientHeight

    // if (!newVal && oldHeight === 0) {
    // console.warn('初始判断条件', this.properties, this);
    // }

    if (oldHeight && newVal && newVal !== oldHeight) {
      this.y = y + (newVal - oldHeight) / 2
      // console.warn('之后每次更新执行', this.properties, this);
    }
    this.width = 300
    this.height = hi
    this.text.editable = false
  }

  getAnchorStyle(anchorInfo: any) {
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
      {
        x: x - width / 2 + 4,
        y,
        name: 'left',
        id: `${id}_1`,
        edgeAddable: false
      },
      {
        x: x + width / 2 - 4,
        y,
        name: 'right',
        id: `${id}_2`
      }
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
  type: NodeType.AI_SET_NODE,
  view: AiSetNode,
  model: AiSetTextModel
}
