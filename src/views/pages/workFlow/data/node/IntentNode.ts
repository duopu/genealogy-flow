import { type ConnectRule, HtmlNode, HtmlNodeModel, h } from '@logicflow/core'
import { edgesValidate, nodeValidate } from '@/views/pages/workFlow/data/flow-rules'
import { NodeType } from '@/views/pages/workFlow/type/type'

class IntentNode extends HtmlNode {
  setHtml(rootEl) {
    rootEl.innerHTML = ''
    const {
      properties: { intention, name, src, active, place },
      id
    } = this.props.model
    rootEl.setAttribute('class', 'condition-container flow-node')
    const container = document.createElement('div')

    const classNames = active
      ? `condition-node node-body active ${id}`
      : `condition-node node-body ${id}`
    container.className = classNames

    const tableNameElement = document.createElement('div')
    const html = `
      <div class="">
        <img src="${src}" class="node-child-pic" />
        <span>${name}</span>
      </div>
    `
    tableNameElement.innerHTML = html
    tableNameElement.className = 'condition-name'
    container.appendChild(tableNameElement)

    const fragment = document.createDocumentFragment()
    for (let i = 0; i < intention?.length; i++) {
      const item = intention[i]
      const itemElement = document.createElement('div')
      itemElement.classList.add('condition-field')
      const itemKey = document.createElement('span')
      itemKey.innerText = item.name === '' ? place : item.name
      itemKey.className = item.name === '' ? 'field-type tip-color' : 'field-type'
      itemElement.appendChild(itemKey)
      fragment.appendChild(itemElement)
    }
    container.appendChild(fragment)
    rootEl.appendChild(container)
  }
}

class IntentModel extends HtmlNodeModel {
  // 自定义添加字段方法
  changeField(data) {
    const { type } = data?.data || data

    if (type !== 'add') {
      this.move(0, -15, true)
    } else {
      this.move(0, 15, true)
    }
    this.setAttributes()
    this.incoming.edges.forEach((edge) => {
      // 调用自定义的更新方案
      edge.updatePathByAnchor()
    })
    this.outgoing.edges.forEach((edge) => {
      // 调用自定义的更新方案
      edge.updatePathByAnchor()
    })
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
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

  setAttributes() {
    this.width = 316
    const {
      properties: { intention }
    } = this
    this.height = 62 + intention?.length * 45
    this.text.editable = false
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      isHovered,
      isSelected,
      properties: { intention }
    } = this
    const anchors = []
    intention.forEach((item, index) => {
      if (index === 0) {
        anchors.push({
          x: x - width / 2 + 12,
          y: y - height / 2 + 70 + index * 45,
          id: `${id}_${index}_left`,
          index: index,
          edgeAddable: false,
          type: 'left'
        })
      }
      anchors.push({
        x: x + width / 2 - 12,
        y: y - height / 2 + 70 + index * 45,
        id: `${id}_${item.key}_right`,
        index: index,
        type: 'right'
      })
    })
    return anchors
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
  type: NodeType.INTENT_NODE,
  model: IntentModel,
  view: IntentNode
}
