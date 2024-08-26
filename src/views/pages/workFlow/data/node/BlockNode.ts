import { GroupNode } from '@logicflow/extension'
import { h } from '@logicflow/core'
import task from '@/views/pages/workFlow/data/task'
import { NodeType } from '@/views/pages/workFlow/type/type'

export const blockHeaderHeight = 54
export const blockBottomHeight = 12
export const nodeMarginBottom = 6

export const totalHeightKey = '__total_height'
const timer = null

// 提供节点 svg dom
class BlockNode extends GroupNode.view {
  getLabelShape() {
    const { model } = this.props
    const { x, y, width, height } = model
    const style = model.getNodeStyle()
  }

  // 顶部删除icon
  getShape() {
    const { model, graphModel } = this.props
    // console.log(model, 'model2222');
    const { x, y, width, height, isHovered, id, isSelected, properties } = model
    const style = model.getNodeStyle()
    const totalHeight = model?.properties?.[totalHeightKey]
    const testing = task.getParma('flowTest')

    return h('g', {}, [
      h('rect', {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        rx: 12,
        ry: 12,
        width,
        // height: hi + dragH,
        height: totalHeight,
        strokeWidth: 2
      }),
      h('rect', {
        ...style,
        x: x - width / 2 + 12,
        y: y - height / 2 + 30,
        // 296
        width: width - 24,
        // 40
        // height: hi + dragH - blockHeaderHeight,
        height: totalHeight - blockHeaderHeight /* - blockBottomHeight*/,
        rx: 8,
        ry: 8,
        strokeWidth: 0
        // fill: 'yellow',
      }),
      h(
        'foreignObject',
        {
          x: x - 155,
          y: y - 85,
          width: '310px',
          className: 'foreignObject',
          style: `overflow:unset ;display:${
            !testing && (isHovered || isSelected || properties.execStatus) ? 'flex' : 'none'
          } ;position:relative`
        },
        [
          h(
            'div',
            {
              className: `node-operation ${!testing && (isHovered || isSelected || properties.execStatus) ? 'open' : 'close'}`
            },
            [
              h(
                'div',
                {
                  className: 'node-operation-item'
                },
                [
                  h('div', {
                    className: 'node-operation-item_icon item_del',
                    onClick: () => {
                      graphModel.deleteNode(id)
                    },
                    onMouseEnter: (e: any) => {
                      e.target.className = `node-operation-item_icon item_del_active`
                      const nextSiblings = e.target.nextSibling

                      if (nextSiblings) {
                        nextSiblings.style.display = 'block'
                      }
                    },
                    onMouseLeave: (e: any) => {
                      e.target.className = `node-operation-item_icon item_del`
                      const nextSiblings = e.target.nextSibling
                      if (nextSiblings) {
                        nextSiblings.style.display = 'none'
                      }
                    }
                  }),
                  h('div', {
                    className: 'node-operation-item_title',
                    innerText: '删除'
                  })
                ]
              )
            ]
          )
        ]
      ),
      this.getLabelShape()
    ])
  }
}

// 提供节点的样式
class BlockModel extends GroupNode.model {
  initNodeData(data: any) {
    const { x, y, text } = data
    if (!text || typeof text === 'string') {
      data.text = {
        value: text || '',
        x: x + 20,
        y: y - 104 / 2 + 30
      }
    }
    super.initNodeData(data)
    this.width = 320
    this.height = 110
    this.text.editable = true
  }

  getNodeStyle() {
    const { properties, isHovered, isSelected } = this
    const style = super.getNodeStyle()
    style.stroke = properties.active || isHovered || isSelected ? '#4E6FFF' : 'rgba(36,47,96,0.06)'
    style.fill = '#fff'
    return style
  }

  getTextStyle() {
    const style = super.getTextStyle()
    style.fontSize = 14
    style.fontWeight = 600
    style.color = '#333'
    style.overflowMode = 'ellipsis'
    return style
  }

  getDefaultAnchor() {
    return []
  }

  getAnchorStyle(anchorInfo: any) {
    const style = super.getAnchorStyle(anchorInfo)
    style.r = 3
    return style
  }

  // 设置拖动节点到分组上时，分组高亮的提示效果样式
  getAddableOutlineStyle() {
    const style = super.getAddableOutlineStyle()
    style.stroke = '#FF0000'
    style.strokeDasharray = '3 3'
    return style
  }

  isAllowAppendIn(nodeData: any): boolean {
    // 设置不允许开始节点被添加到此分组中
    return nodeData.type !== 'start'
  }
}

export default {
  type: NodeType.BLOCK_NODE,
  view: BlockNode,
  model: BlockModel
}
