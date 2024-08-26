import { HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { NodeType } from '@/views/pages/workFlow/type/type'

class PluginNode extends HtmlNode {
  constructor(props) {
    super(props)
  }

  setHtml(rootEl) {
    const { properties, id } = this.props.model
    const {
      src,
      place,
      nodeParams: { label },
      oldHeight
    } = properties
    const el = document.createElement('div')

    const classNames = properties.active
      ? `text-node-wrapper flow-node ${id} active`
      : `text-node-wrapper flow-node ${id}`
    el.className = classNames

    let html = `
      <div class="text-body node-body llm-body" #textNode>
        <img src="${src}" class="node-child-pic" />
    `
    if (label && label !== '') {
      html += `
          <span class="llm-label-text">${label}</span>
        </div>
      `
    } else {
      html += `
          <span class="place">${place}</span>
        </div>
      `
    }
    el.innerHTML = html
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

class PluginModel extends HtmlNodeModel {
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
  // 定义锚点. 锚点位置通过中心点和宽度算出来。
  getDefaultAnchor() {
    const { width, x, y, id } = this
    return [
      {
        x: x - width / 2 + 4,
        y,
        name: 'left',
        id: `${id}_1`
      },
      {
        x: x + width / 2 - 4,
        y,
        name: 'right',
        id: `${id}_2`
      }
    ]
  }
}

export default {
  type: NodeType.PLUGIN_NODE,
  view: PluginNode,
  model: PluginModel
}
