import { type ConnectRule, HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { edgesValidate, nodeValidate } from '@/views/pages/workFlow/data/flow-rules'
import { NodeType } from '@/views/pages/workFlow/type/type'

class SetNode extends HtmlNode {
  constructor(props) {
    super(props)
  }

  setHtml(rootEl) {
    const _window = window as any
    const { properties, id } = this.props.model
    const { src, place, body, oldHeight } = properties
    // console.log(this.props.model, '');
    const el = document.createElement('div')

    const classNames = properties.active
      ? `set-node-wrapper flow-node ${id} active`
      : `set-node-wrapper flow-node ${id}`
    el.className = classNames

    let html = `
      <div class="set-body node-body llm-body" #textNode>
        <img src="${src}" class="node-child-pic" />
    `
    if (body && body !== '') {
      html += `
          <span class="llm-label-text">${body}</span>
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
        // _window.move(0, newVal - oldHeight, true);
      }
    }

    // console.log(properties.oldHeight, newVal, 'oldHeight');

    // _window.stop = (ev: any) => {
    //   ev.stopPropagation();
    // };
    // _window.setData = () => {
    //   const { graphModel, model } = this.props;
    //   // graphModel.eventCenter.emit('custom:button-click', model);
    //   graphModel.eventCenter.emit('custom:onclick', model);
    // };
  }
}

class SetModel extends HtmlNodeModel {
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
    // console.log(this.incoming, 'this.incoming');
    // console.log(this, this.properties.oldHeight, 'properties');
    const { oldHeight } = this.properties
    const { y } = this
    // const h = oldHeight ? Math.ceil(oldHeight/ 55) * 48 : 48;
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
  type: NodeType.SET_NODE,
  view: SetNode,
  model: SetModel
}
