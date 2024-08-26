import { RectNode, RectNodeModel, h } from '@logicflow/core'
import { NodeType } from '@/views/pages/workFlow/type/type'

// 提供节点 svg dom
class CustomCircleNode extends RectNode {
  getLabelShape() {
    const { model } = this.props
    const { x, y, width, height } = model
    const style = model.getNodeStyle()
    return h(
      'svg',
      {
        x: x - width / 2 + 12,
        y: y - height / 2 + 8.5,
        width: 24,
        height: 24,
        viewBox: '0 0 24 24'
      },
      [
        h('path', {
          fill: '#748EFB',
          d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM10.6219 8.41459C10.5562 8.37078 10.479 8.34741 10.4 8.34741C10.1791 8.34741 10 8.52649 10 8.74741V15.2526C10 15.3316 10.0234 15.4088 10.0672 15.4745C10.1897 15.6583 10.4381 15.708 10.6219 15.5854L15.5008 12.3328C15.5447 12.3035 15.5824 12.2658 15.6117 12.2219C15.7343 12.0381 15.6846 11.7897 15.5008 11.6672L10.6219 8.41459Z'
        })
      ]
    )
  }

  getShape() {
    const { model } = this.props
    const { x, y, r, width, height, radius, properties } = model
    const style = model.getNodeStyle()
    return h('g', {}, [
      h('rect', {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height,
        // stroke: properties.active ? '4E6FFF' : '#879DFF',
        stroke: '#879DFF',
        fill: '#F1F3FF'
      }),
      this.getLabelShape(),
      h(
        'text',
        {
          x: x - width / 2 + 43,
          y: y - height / 2 + 25,
          fill: '#333',
          fontSize: 14,
          fontWeight: 400,
          fontFamily: 'Alibaba PuHuiTi, Alibaba PuHuiTi'
        },
        ['开始']
      )
    ])
  }
}

// 提供节点的样式
class CustomCircleModel extends RectNodeModel {
  getOutlineStyle() {
    const style: any = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
  }

  initNodeData(data: any) {
    super.initNodeData(data)
    this.r = 20
    this.text.editable = false
    this.height = 40
    this.width = 84
    this.radius = 25
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    // style.stroke = 'none';
    // if (this.properties.isSelected) {
    //   style.fill = 'red';
    // }
    // if (this.isHovered) {
    //   style.stroke = 'red';
    // }
    // 如果此节点不允许被连接，节点变红
    if (this.state === 5) {
      style.fill = 'red'
    }
    if (this.state === 4) {
      style.fill = 'green'
    }
    return style
  }

  getConnectedTargetRules() {
    const rules = super.getConnectedTargetRules()
    const notAsTarget = {
      message: '起始节点不能作为边的终点',
      validate: () => {
        return false
      }
    }
    rules.push(notAsTarget)
    return rules
  }

  // getConnectedSourceRules() {
  //   const rules = super.getConnectedSourceRules();
  //   const geteWayOnlyAsTarget = {
  //     message: '下一个节点只能是circle',
  //     validate: (source, target, sourceAnchor, targetAnchor) => {
  //       console.log('sourceAnchor, targetAnchor', sourceAnchor, targetAnchor);
  //       return target.type === 'circle';
  //     },
  //   };
  //   rules.push(geteWayOnlyAsTarget);
  //   return rules;
  // }

  // 定义锚点. 锚点位置通过中心点和宽度算出来。
  getDefaultAnchor() {
    const { width, height, x, y, id } = this
    return [
      {
        x: x + width / 2,
        y,
        name: 'right',
        id: `${id}_1`
        // edgeAddable: false,
      }
    ]
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
}

export default {
  type: NodeType.START_NODE,
  view: CustomCircleNode,
  model: CustomCircleModel
}
