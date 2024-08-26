import { type ConnectRule, HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { edgesValidate, nodeValidate } from '@/views/pages/workFlow/data/flow-rules'
import { NodeType } from '@/views/pages/workFlow/type/type'

class ConditionNode extends HtmlNode {
  setHtml(rootEl: any) {
    // console.log(rootEl, 'rootEl');

    rootEl.innerHTML = ''
    const {
      properties: { fields, name, src, active, place },
      id
    } = this.props.model

    rootEl.setAttribute('class', 'condition-container flow-node')
    const container = document.createElement('div')

    container.className = active
      ? `condition-node node-body active ${id}`
      : `condition-node node-body ${id}`

    const tableNameElement = document.createElement('div')
    tableNameElement.innerHTML = `
      <div class="">
        <img src="${src}" class="node-child-pic" alt=""/>
        <span>${name}</span>
      </div>
    `
    tableNameElement.className = 'condition-name'
    container.appendChild(tableNameElement)

    const fragment = document.createDocumentFragment()
    for (let i = 0; i < fields?.length; i++) {
      const item = fields[i]
      const itemElement = document.createElement('div')
      itemElement.classList.add('condition-field')
      // itemElement.classList.add('condition-field' + this.props.model.id);
      const itemKey = document.createElement('span')
      itemKey.innerText = item.name === '' ? place : item.name
      itemKey.className = item.name === '' ? 'field-type tip-color' : 'field-type'
      itemElement.appendChild(itemKey)
      // itemElement.appendChild(itemType);
      fragment.appendChild(itemElement)
    }
    container.appendChild(fragment)
    rootEl.appendChild(container)
  }
}

class ConditionModel extends HtmlNodeModel {
  /**
   * 给model自定义添加字段方法
   */
  changeField(data: any) {
    const { type } = data?.data || data

    if (type !== 'add') {
      this.move(0, -15, true)
    } else {
      this.move(0, 15, true)
    }
    this.setAttributes()
    // 更新节点连接边的path
    // console.log(this.incoming, this.outgoing, 'this.incoming');
    this.incoming.edges.forEach((edge) => {
      // 调用自定义的更新方案
      // console.log(edge, edge.targetAnchorId, 'edge');
      edge.updatePathByAnchor()
    })
    this.outgoing.edges.forEach((edge) => {
      // 调用自定义的更新方案
      edge.updatePathByAnchor()
    })
  }

  getOutlineStyle() {
    const style: any = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
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

  setAttributes() {
    this.width = 316
    const {
      properties: { fields }
    } = this
    this.height = 62 + fields?.length * 45

    // const circleOnlyAsTarget = {
    //   message: '只允许从右边的锚点连出',
    //   validate: (sourceNode, targetNode, sourceAnchor) => {
    //     return sourceAnchor.type === 'right';
    //   },
    // };
    // this.sourceRules.push(circleOnlyAsTarget);
    // this.targetRules.push({
    //   message: '只允许连接左边的锚点',
    //   validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
    //     return targetAnchor.type === 'left';
    //   },
    // });
    this.text.editable = false
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      properties: { fields }
    } = this
    const anchors: any = []
    fields.forEach((item: any, index: any) => {
      // if (isConnection || !(isHovered || isSelected)) {
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
        // id: `${id}_${index + 1}_right`,
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
  type: NodeType.CONDITION_NODE,
  model: ConditionModel,
  view: ConditionNode
}
