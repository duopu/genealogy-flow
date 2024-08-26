import { PolylineEdge, PolylineEdgeModel, h } from '@logicflow/core'
import task from '@/views/pages/workFlow/data/task'

const DEFAULT_WIDTH = 52
const DEFAULT_HEIGHT = 30

export const pointFilter = (points: any) => {
  const allPoints = points
  let i = 1
  while (i < allPoints.length - 1) {
    const pre = allPoints[i - 1]
    const current = allPoints[i]
    const next = allPoints[i + 1]
    if (
      (pre.x === current.x && current.x === next.x) ||
      (pre.y === current.y && current.y === next.y)
    ) {
      allPoints.splice(i, 1)
    } else {
      i++
    }
  }
  return allPoints
}

class Connection extends PolylineEdge {
  lineCenter(points: any) {
    let total = 0,
      lens = []
    for (let i = 1; i < points.length; i++) {
      const len = Math.sqrt(
        Math.pow(parseInt(points[i][0]) - parseInt(points[i - 1][0]), 2) +
          Math.pow(parseInt(points[i][1]) - parseInt(points[i - 1][1]), 2)
      )
      lens.push(len)
      total += len
    }
    let half = total / 2
    for (let i = 1; i < points.length; i++) {
      if (half > lens[i - 1]) {
        half -= lens[i - 1]
      } else {
        const t = half / lens[i - 1],
          x =
            parseInt(points[i - 1][0]) + (parseInt(points[i][0]) - parseInt(points[i - 1][0])) * t,
          y = parseInt(points[i - 1][1]) + (parseInt(points[i][1]) - parseInt(points[i - 1][1])) * t
        return [x, y]
      }
    }
  }
  getText() {
    const { model, graphModel } = this.props
    const { id, isSelected, isHovered, points } = model
    const { customWidth = DEFAULT_WIDTH, customHeight = DEFAULT_HEIGHT } = model.getProperties()
    const pointsSplit = points.split(' ')
    const result = []
    for (const i in pointsSplit) {
      result.push(pointsSplit[i].split(','))
    }
    const lines: any = this.lineCenter(result)
    const positionData = {
      x: lines[0] - customWidth / 2,
      y: lines[1] - customHeight / 2,
      width: customWidth,
      height: customHeight
    }
    return h(
      'foreignObject',
      {
        ...positionData,
        id: 'line_' + id,
        style: `z-index: 20; width: ${positionData.width}px; height: ${positionData.height}`
      },
      [
        h(
          'div',
          {
            className: 'delete-wrapper'
          },
          [
            h('div', {
              className: 'delete-wrapper_icon',
              style: `display:${!task.getParma('flowTest') && isSelected ? 'block' : 'none'}`,
              onClick: () => {
                graphModel.deleteEdgeById(id)
              }
            })
          ]
        )
      ]
    )
  }
  getEndArrow() {
    const { stroke } = this.props.model.getArrowStyle()
    return h('g', {}, [
      h('path', {
        stroke,
        // fill: '#222754',
        fill: '#A9ACBA',
        d: 'M 0 0 -8 -3 -8 3 z'
      }),
      h('rect', {
        stroke,
        fill: '#A9ACBA',
        width: 3,
        height: 11,
        y: -5
      })
    ])
  }

  getStartArrow() {
    return h('g', {}, [
      h('circle', {
        stroke: '#A9ACBA',
        fill: '#fff',
        width: 10,
        height: 10,
        r: 5,
        x: -2
      })
    ])
  }
}
// draggable false
class DefaultLineModel extends PolylineEdgeModel {
  initEdgeData(data: any) {
    super.initEdgeData(data)
    const { startPoint, endPoint, sourceAnchorId, pointsList, points } = this
    const { x: x1, y: y1 } = startPoint
    const { x: x2, y: y2 } = endPoint
    const list = [],
      pointsArray = []
    for (let i = 0; i < pointsList.length; i++) {
      if (i === 0) {
        list.push({
          x: sourceAnchorId === 'node_id_1_1' ? x1 : x1 + 15,
          y: pointsList[i].y
        })
        pointsArray.push([sourceAnchorId === 'node_id_1_1' ? x1 : x1 + 15, pointsList[i].y])
      } else if (i === pointsList.length - 1) {
        list.push({
          x: x2 - 15,
          y: pointsList[i].y
        })
        pointsArray.push([x2 - 15, pointsList[i].y])
      } else {
        list.push({
          x: pointsList[i].x,
          y: pointsList[i].y
        })
        pointsArray.push([pointsList[i].x, pointsList[i].y])
      }
    }
    this.pointsList = list
    this.points = pointsArray.join(' ')
    this.startPoint = {
      x: sourceAnchorId === 'node_id_1_1' ? x1 : x1 + 15,
      y: y1
    }
    this.endPoint = {
      x: x2 - 15,
      y: y2
    }
  }
  getOutlineStyle() {
    const style: any = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
  }

  setAttributes() {
    this.draggable = false
    this.text.editable = false
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle()
    style.stroke = '#A9ACBA'
    style.strokeWidth = 1
    return style
  }

  getData() {
    const data = super.getData()
    data.sourceAnchorId = this.sourceAnchorId
    data.targetAnchorId = this.targetAnchorId
    return data
  }

  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle()
    style.stroke = 'blue'
    style.strokeDasharray = '3 3'
    style.animationDuration = '50s'
    return style
  }

  updatePathByAnchor() {
    const sourceNodeModel = this.graphModel.getNodeModelById(this.sourceNodeId)
    const sourceAnchor = sourceNodeModel
      .getDefaultAnchor()
      .find((anchor) => anchor.id === this.sourceAnchorId)
    const targetNodeModel = this.graphModel.getNodeModelById(this.targetNodeId)
    const targetAnchor = targetNodeModel
      .getDefaultAnchor()
      .find((anchor) => anchor.id === this.targetAnchorId)

    if (!sourceAnchor || !targetAnchor) {
      return false
    }
    const startPoint = {
      x: sourceAnchor.x,
      y: sourceAnchor.y
    }
    this.updateStartPoint(startPoint)
    const endPoint = {
      x: targetAnchor.x,
      y: targetAnchor.y
    }
    this.updateEndPoint(endPoint)
    // 这里需要将原有的pointsList设置为空，才能触发bezier的自动计算control点。
    this.pointsList = []
    this.initPoints()
  }
  setHovered(flag: boolean) {
    if (task.getParma('flowTest')) {
      super.setHovered(false)
    } else {
      super.setHovered(flag)
    }

    this.setZIndex(flag ? 9999999 : 0)
  }
  setZIndex(index: number) {
    if (task.getParma('flowTest')) return
    if (this.isHovered || this.isSelected || this.properties.executeStatus) {
      super.setZIndex(9999999)
      this.openEdgeAnimation()
    } else {
      this.closeEdgeAnimation()
      super.setZIndex(index)
    }
  }
}

export default {
  type: 'DefaultLine',
  view: Connection,
  model: DefaultLineModel
}
