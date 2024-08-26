import type EventEmitter from '@logicflow/core/types/event/eventEmitter'
import {
  ComplexNode,
  NodeType,
  SortTypeEnum,
  type UpdatePositionOptions
} from '@/views/pages/workFlow/type/type'
import { getLogicFlow } from '@/views/pages/workFlow/data/operateNode'
import {
  blockBottomHeight,
  blockHeaderHeight,
  nodeMarginBottom,
  totalHeightKey
} from '@/views/pages/workFlow/data/node/BlockNode'
import type { NodeData, LogicFlow, GraphModel, BaseNodeModel } from '@logicflow/core'
import {
  assemblyOnlyLinkOne,
  componentCannotInternally,
  siblingLinkCannotInternally
} from '@/views/pages/workFlow/data/flow-rules'
import task from '@/views/pages/workFlow/data/task'
import { dropAllowType } from '@/views/pages/workFlow/data/work-flow.enum'
// import { defineOverlay, renderOverlay, usePrograms } from '@overlastic/vue'

let dragGroupId = ''

export const bindEvent = (eventCenter: EventEmitter, callbacks: any) => {
  const lf = getLogicFlow()
  const graphModel = lf.graphModel
  eventCenter.on('node:dnd-add', async (data) => {
    const childEnterNode = getEnterNode(data)
    // 判断直接生成带组节点还是将子节点加入已生成的组中
    if (childEnterNode) {
      await changeDragPosition(data)
    } else {
      // 调整判断节点样式
      if (ComplexNode.includes(data.data.type)) data.data.y = data.data.y - 18
      // 添加组
      addGroup(data.data)
    }
  })

  eventCenter.on('node:dragstart', (data) => {
    const { type, id } = data.data
    if ([NodeType.BLOCK_NODE, NodeType.START_NODE].includes(type)) return false
    const group = getGroupNode(graphModel.nodes, id)
    dragGroupId = group.id
  })

  eventCenter.on('node:drag', (data) => {
    const { type } = data.data
    if (type === NodeType.BLOCK_NODE) {
      handleGroupIndex(data.data, graphModel)
      return false
    } else if (type === NodeType.START_NODE) return false
    isDragGroup(data.data, dragGroupId)
  })

  eventCenter.on('node:drop', (data) => {
    console.log('node:drop===', data)
    const { type } = data.data
    // 如果是组或者开始节点的拖拽，不做处理
    if (![NodeType.START_NODE, NodeType.BLOCK_NODE].includes(type)) {
      // 拖拽节点，组高度适应
      const params = { lf, data: data.data, dragGroupId }
      changeDragPosition(params)
      dragGroupId = ''
    }
  })

  lf.on('custom:height', (model) => {
    const params = { node: model, childId: model.id }
    isHeightChange(params)
  })

  // 单击节点
  eventCenter.on('node:click', (data) => {
    console.log('单机节点事件')
    if ([NodeType.START_NODE].includes(data.data.type)) return false
    // this.nodeDetail = data;
    // this.showDrawer(data);
    openDetail(data)
    callbacks?.afterAdd(data)
  })

  // 防止重叠 有问题直接注释掉
  monitoringNodesEvents(lf)
}

const openDetail = (data: any) => {
  console.log('openDetail', data)
}

const getEnterNode = (data: any) => {
  const { enterNode } = isDragGroup(data.data, '')
  return enterNode
}

const isDragGroup = (data: any, dragGroupId: string) => {
  const flow = getLogicFlow()
  const dataX = data.x
  const dataY = data.y
  const dragResult: any = { isSelf: true, resultGroupId: dragGroupId, enterNode: undefined }

  flow.graphModel.nodes.forEach((node) => {
    const { id, x, y, height, width, type } = node
    if (type === NodeType.BLOCK_NODE && node.children?.size && id !== dragGroupId) {
      const [y1, y2] = getBlockYById(id)
      const groupX = [x - width / 2, x + width / 2]
      const groupY = [y1 + 30 || y - height / 2, y2 + 30 || y + height / 2]
      // 拖拽到其他组内
      if (inRange(groupX, dataX) && inRange(groupY, dataY)) {
        dragResult.isSelf = false
        // 赋值新组的id
        dragResult.resultGroupId = id
        dragResult.enterNode = node
      }
    }
  })
  return dragResult
}

// 获取节点大概的 顶部 和 底部 y值 区间数组
const getBlockYById = (parentId: string) => {
  const childNodes = getChildNodesById(parentId)
  if (childNodes?.length > 0) {
    const firstNode = childNodes[0]
    const { y: childY, height: childHeight } = firstNode
    const y1 = childY - childHeight / 2 - blockHeaderHeight
    let stepNum = 0
    childNodes?.forEach((node, index: number) => {
      if (index > 0) {
        stepNum = stepNum + node.height + nodeMarginBottom
      }
    })
    const y2 = childY + childHeight / 2 + nodeMarginBottom + stepNum + blockBottomHeight
    return [y1, y2]
  }
  return [0, 0]
}

const inRange = (arr: number[], data: number) => {
  return arr[0] <= data && arr[1] >= data
}

// 获取指定父节点下的所有子节点
const getChildNodesById = (id: string): NodeData[] => {
  const flow = getLogicFlow()
  const parentNode: NodeData = flow.getNodeModelById(id)
  if (parentNode?.children?.size > 0) {
    return getNodeListByIds(Array.from(parentNode.children))
  }
  return []
}

// 根据 ids 获取节点
const getNodeListByIds = (ids: string[]): NodeData[] => {
  const flow = getLogicFlow()
  const nodes: NodeData[] = flow.graphModel.nodes
  const sorted = nodes
    ?.filter((i) => ids.includes(i.id))
    ?.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
  return sorted
}

// 获取当前节点的父节点
const getParentNodeById = (id: string): any => {
  const flow = getLogicFlow()
  const nodes: NodeData[] = flow.graphModel.nodes
  return nodes?.filter((i) => i?.children?.size > 0).find((e) => [...e.children]?.includes?.(id))
}

const monitoringNodesEvents = (lf: LogicFlow) => {
  const { eventCenter } = lf.graphModel
  lf.graphModel.clearSelectElements()
  const events = [
    'element:click',
    'node:click',
    'node:dnd-add',
    'node:dragstart',
    'node:dnd-drag',
    'node:drag',
    'node:drop',
    'edge:click',
    'edge:exchange-node',
    'connection:not-allowed',
    'blank:click',
    'anchor:dragstart',
    'anchor:drop',
    'anchor:drag',
    'anchor:dragend',
    'node:contextmenu',
    'edge:contextmenu',
    'edge:add',
    'graph:rendered',
    'node:mouseenter',
    'node:mouseleave'
  ]
  for (const i in events) {
    eventCenter.on(events[i], async (e) => {
      if (events[i] === 'node:contextmenu') {
        const type = e.data.type
        const expain = ['BlockNode', 'StartNode']
        const lfMenu: any = document.querySelector('.lf-menu')
        if (expain.includes(type)) {
          lfMenu ? (lfMenu.style.display = 'none') : null
        } else {
          const flowTest = task.getParma('flowTest')
          if (flowTest) {
            lfMenu ? (lfMenu.style.display = 'none') : null
          } else {
            lfMenu ? (lfMenu.style.display = 'block') : null
          }
        }
      }
      if (events[i] === 'edge:add') {
        const { sourceNodeId, id, targetNodeId } = e.data
        // 模拟测试直接删除不允许连接
        const flowTest = task.getParma('flowTest')
        if (flowTest) {
          lf.deleteEdge(id)
        }
        // 需要做规则校验

        if (sourceNodeId === targetNodeId) {
          lf.deleteEdge(id)
        }
        // 自己只能连接一次
        assemblyOnlyLinkOne(sourceNodeId, lf, id, targetNodeId)
        // 组件内部不能连接
        componentCannotInternally(sourceNodeId, lf, id)
        // 如果兄弟节点已经有一个出去了就不能连接了
        siblingLinkCannotInternally(sourceNodeId, lf, id)

        // 如果 targetNodeId 的 sourceNodeId是开始的话就去除
        const { edges } = lf.getGraphData()
        // 从edges中找出 targetNodeId相同的，然后判断相同的targetNodeId中的 sourceNodeId 是不是开始节点并且
        const finds = edges.filter((item: any) => item.targetNodeId === targetNodeId)
        const startNodes = finds.filter((item: any) => item.sourceNodeId === 'node_id_1')
        if (startNodes.length > 1) {
          lf.deleteEdge(id)
        }
      }
      if (events[i] === 'node:mouseenter') {
        const { id, type } = e.data
        if (type === 'code') {
          // 获取父节点
          const pId = getParentNodeById(id)?.id
          lf.setProperties(pId, {
            execStatus: true
          })
        }
      }
      if (events[i] === 'node:mouseleave') {
        const { id, type } = e.data
        if (type === 'code') {
          // 获取父节点
          const pId = getParentNodeById(id).id
          lf.setProperties(pId, {
            execStatus: false
          })
        }
      }
      Promise.resolve().then((res) => {
        setNodesIndex(lf, e)
      })
    })
  }
}

const setNodesIndex = (lf: LogicFlow, event: any) => {
  if (event.data && dropAllowType.includes(event.data.type)) {
    const selfId = event.data.id
    lf.graphModel.setElementZIndex(selfId, 1000) // 自己的子节点在最上面，自己在子节点的下面
    const cChildren = event.data.children
    if (cChildren) {
      cChildren.forEach((ccId: any, i: any) => {
        lf.graphModel.setElementZIndex(ccId, 1000 + i + 1) // 自己的子节点在最上面，自己在子节点的下面
      })
    }
  }
  const graphData = lf.getGraphData()
  const { nodes, edges } = graphData
  const edgesLength = edges.length
  edges.forEach((eItem: any, index: any) => {
    const { id } = eItem
    lf.graphModel.setElementZIndex(id, index + 1)
  })
  nodes.forEach((item: any, index: any) => {
    const { id, children } = item
    const selfId = event.data && event.data.id
    if (item.children && item.type === 'BlockNode' && selfId !== id) {
      const count = edgesLength + index + 1 + 1
      lf.graphModel.setElementZIndex(id, count)
      children.forEach((cId: any, cIndex: any) => {
        if (selfId !== cId) {
          const coconut = count + cIndex + 1
          lf.graphModel.setElementZIndex(cId, coconut)
        }
      })
    }
  })
}

// 拖拽结束改变位置
const changeDragPosition = async (event: any): Promise<void> => {
  // dragGroupId：原始组的id
  const { data, dragGroupId: oldGroupId } = event
  const lf = getLogicFlow()
  const { x, y, id } = data
  // isSelf：false表示拖拽到其他组内 newGroupId：则为新组id，否则为原来组id
  const { isSelf, resultGroupId: newGroupId } = isDragGroup(data, oldGroupId)

  const oldGroupModel = oldGroupId ? lf.getNodeModelById(oldGroupId) : undefined
  const newGroupModel = lf.getNodeModelById(newGroupId)
  const h = getNodeHeight(id) || 0

  const childArr = [...(oldGroupModel?.children || [])]
  const length = childArr.length

  // 原始组是否只有一个子
  const onlyOneChild = length === 0 || (length === 1 && childArr[0] === id)

  // 没有拖到其他组 (自己组内 或者画布空白区域)
  if (isSelf) {
    // isMovedOut：true 否移出自己的组 (拖到画布空白区域)
    const isMoveOutSelfGroup = isRemovedGroup(newGroupId, data)

    if (isMoveOutSelfGroup) {
      // 原来的组，只有一个子节点
      if (onlyOneChild) {
        // 从组拖出到画布，移动组
        newGroupModel.addChild(id)
        console.log('1-1')
        lf.graphModel.moveNode2Coordinate(oldGroupId, x, y - h / 2, true)
      } else if (isMoveOutSelfGroup) {
        // 从组拖出到画布，添加组 删除老组中的当前子节点
        oldGroupModel?.removeChild(id)
        addGroup(data)
        console.log('1-2')
      } else {
        console.log('1-3')
      }
    } else {
      const isContainsChild = groupIsContainsChild(oldGroupModel, id)
      if (isContainsChild) {
        console.log('2-2')
        addAndChangeYPositionInGroup(oldGroupModel, { childId: id, entryFlag: 2 })
      } else {
        // 没有拖到其他组 (自己组内 或者画布空白区域)  尺寸判断没有拖出当前组， 但是 logicFlow 给处理移出组了
        console.log('2-1')
        addAndChangeYPositionInGroup(oldGroupModel, { childId: id, entryFlag: 1 })
      }
    }
  } else {
    // 拖到其他组内添加子节点
    addAndChangeYPositionInGroup(newGroupModel, { childId: id, entryFlag: 3 })
    // 更新新组的高度
    const result = newGroupModel.properties
    lf.setProperties(newGroupId, result)
    oldGroupModel && oldGroupModel?.removeChild?.(id) // 老的组删除老的子节点

    // 原来的组只有一个子节点 且当前被拖出组，则 删除原来的组
    if (onlyOneChild && oldGroupId) {
      lf.graphModel.deleteNode(oldGroupId)
      console.log('3-1')
    } else {
      console.log('3-2')
    }
  }
  await updateBlockNodeHeight(newGroupModel)
  oldGroupModel && (await updateBlockNodeHeight(oldGroupModel))
  updatePosition(data, { sortBy: SortTypeEnum.childOrder })

  const oldChild = oldGroupModel?.children
  if (oldChild?.size > 0) {
    // 老组存在节点更新子节点位置
    const oldInfoChild = lf.getNodeModelById([...oldChild][0])
    updatePosition(oldInfoChild, { sortBy: SortTypeEnum.childOrder })
  }
}

// 获取节点高度
const getNodeHeight = (id: string): number => {
  const groupModel = getLogicFlow().getNodeModelById(id)
  return groupModel.height
}

/**
 * 是否移出组
 * @param groupId 组的id
 * @param childNode 子节点
 */
const isRemovedGroup = (groupId: string, childNode: BaseNodeModel): boolean => {
  let isChange = true
  const childX = childNode.x
  const childY = childNode.y

  const flow = getLogicFlow()

  const groupModel = flow.getNodeModelById(groupId)
  const { x, y, width, height, properties } = groupModel
  const halfHeight = height / 2
  const actualHeight = properties[totalHeightKey]
  const groupX = [x - width / 2, x + width / 2]
  const groupY = [y - halfHeight, y - halfHeight + actualHeight] // y - 高度的一半 是上边的y值， y - 高度的一半 + 实际高度 是下边的y值
  if (inRange(groupX, childX) && inRange(groupY, childY)) {
    isChange = false
  }
  return isChange
}

// 添加组
const addGroup = (data: any) => {
  const length = getAllBlockSize() + 1
  const obj = {
    type: NodeType.BLOCK_NODE,
    text: `节点${length}`
  }
  getLogicFlow().graphModel.addNode(handleNodeAdd(data, obj))
}

// 获取当前分组数量
const getAllBlockSize = () => {
  return (
    getLogicFlow().graphModel.nodes?.filter((node: any) =>
      [NodeType.BLOCK_NODE].includes(node.type)
    )?.length || 0
  )
}

// 处理节点添加
const handleNodeAdd = (node: BaseNodeModel, data: any): BaseNodeModel => {
  const { id, x, y } = node
  const { type, text } = data
  let obj = {}
  switch (type) {
    case NodeType.BLOCK_NODE: {
      const childHeight = getNodeHeight(id) || 0
      const initialHeight = childHeight + blockHeaderHeight + blockBottomHeight
      obj = {
        type: NodeType.BLOCK_NODE,
        text,
        x: x - 10,
        y: y - 20,
        height: initialHeight,
        properties: { type: 'block', name: '', [totalHeightKey]: initialHeight },
        children: [id]
      }
      break
    }
    default:
      break
  }
  return obj as BaseNodeModel
}

/**
 * 检查特定父组是否包含指定的子元素
 */
const groupIsContainsChild = (oldGroupModel: any, childId: string): boolean => {
  return oldGroupModel?.children?.has(childId)
}

/**
 * 根据子节点 id 更新 当前组内节点坐标
 * @param childData
 * @param options { sortBy: 'yPosition' 默认根据Y轴排序 | 'childOrder' 根据子节点数组顺序排序 }
 */
const updatePosition = (childData: any, options?: UpdatePositionOptions) => {
  if (![NodeType.BLOCK_NODE, NodeType.START_NODE].includes(childData.type)) {
    const parentNode = getParentNodeById(childData?.id) // 获取当前子节点的 父节点
    let sortedChildNodes = []
    if (options?.sortBy === 'childOrder') {
      sortedChildNodes = getChildNodes(childData?.id) // 获取 父节点下所有的子节点 子节点按照 父节点的children顺序排序
    } else {
      sortedChildNodes = getChildNodes(childData?.id)?.sort((a, b) => a.y - b.y) // 获取 父节点下所有的子节点 子节点按照y坐标排序
    }
    if (parentNode) {
      const { x: parentX, y: parentY, height: parentHeight } = parentNode
      const baseY = parentY - parentHeight / 2 + blockHeaderHeight // 父节点y - 父节点高度一半 + 头部高度
      // 根据排序后的子节点id，遍历子节点，根据子节点id获取子节点，然后移动子节点
      for (let i = 0; i < sortedChildNodes.length; i++) {
        const { height: childHeight, id } = sortedChildNodes[i]
        const preInfo: any = i > 0 ? sortedChildNodes[i - 1] : {} // 上一个节点信息
        let moveY = baseY + childHeight / 2 // 第一个子节点y位置
        if (i > 0) {
          // 第二个及以后子节点y位置
          moveY = preInfo.y + preInfo.height / 2 + nodeMarginBottom + childHeight / 2
        }
        getLogicFlow().graphModel.moveNode2Coordinate(id, parentX, moveY, false)
      }
    }
  }
}

// 获取当前节点的所有子节点
const getChildNodes = (id: string): NodeData[] => {
  const nodes: NodeData[] = getLogicFlow().graphModel.nodes
  const children = nodes
    ?.filter((i) => i?.children?.size > 0)
    .find((e) => [...e.children]?.includes?.(id))?.children
  let childNodes: NodeData[] = []
  if (children?.size > 0) {
    childNodes = getNodeListByIds(Array.from(children))
  }
  return childNodes
}

// 拖拽后更新block节点高度
const updateBlockNodeHeight = (info: GraphModel | string | BaseNodeModel) => {
  return new Promise((resolve) => {
    const flow = getLogicFlow()
    let groupModel = undefined
    if (typeof info === 'string') {
      groupModel = flow.getNodeModelById(info)
    } else {
      groupModel = info
    }
    const { id, properties } = groupModel
    const childNodes = getChildNodesById(id)
    const childTotalHeight = childNodes.reduce((pre, cur) => {
      const h = cur.height
      return pre + h
    }, 0)

    const resultHeight =
      childTotalHeight +
      childNodes?.length * nodeMarginBottom +
      blockHeaderHeight +
      blockBottomHeight
    properties[totalHeightKey] = resultHeight
    flow.setProperties(id, properties)
    resolve([])
  })
}

// 将拖拽元素和组内元素对比 且 移动到对比元素的下面位置
const addAndChangeYPositionInGroup = (parent: any, { childId = '', entryFlag = 0 }) => {
  const flow = getLogicFlow()
  if (typeof parent === 'string') {
    parent = flow.getNodeModelById(parent) as BaseNodeModel
  }

  let childIds = Array.from(parent?.children)
  // eslint-disable-next-line prefer-const
  let { x: childrenX, y: childrenY, type: childrenType } = flow.getNodeModelById(childId)

  // 条件节点中心位置有偏移 对比值微调 拖拽更灵敏点
  if (ComplexNode.includes(childrenType)) childrenY = childrenY + 18
  const currentCompareNodeInfo: any = { underCompareYPoint: false, nodeId: undefined } // aboveCompareY

  const childArr = getNodeListByIds(Array.from([...parent.children]))
  let index = childArr.findIndex((item) => {
    const {
      x: compareX,
      y: compareY,
      height: compareHeight,
      width: compareWidth,
      id: compareId
    } = item
    const groupX = [compareX - compareWidth / 2, compareX + compareWidth / 2]
    const groupY = [compareY - compareHeight / 2, compareY + compareHeight / 2 + nodeMarginBottom]
    // 获取 拖到哪个元素的位置 对应元素的下标
    if (inRange(groupX, childrenX) && inRange(groupY, childrenY) && compareId !== childId) {
      if (entryFlag === 3 && compareY < childrenY) {
        currentCompareNodeInfo.underCompareYPoint = true // 拖拽元素y坐标处于 被对比元素y之上还是之下
        currentCompareNodeInfo.nodeId = compareId
      }
      return true
    }
    return false
  })
  // console.log('index::', index);
  if (entryFlag === 1) {
    parent.addChild(childId)
  }
  if (entryFlag === 2 && index !== -1) {
    childIds = childIds.filter((item) => item !== childId)
  }
  if (entryFlag === 3) {
    if (index === -1) {
      index = childArr?.length || -1
    }
    if (currentCompareNodeInfo.underCompareYPoint) {
      index = index + 1
    }
  }
  childIds.splice(index, 0, childId)
  flow.updateAttributes(parent.id, { children: new Set(Array.from(childIds)) })
}

// 计算节点高度是否改变
const isHeightChange = (data: any) => {
  const flow = getLogicFlow()
  const { node, oldVal, childId } = data
  const { properties } = node
  const result = properties

  const el = document.getElementsByClassName(childId)
  const newVal = el[0]?.clientHeight

  const changeH = newVal - properties.oldHeight
  flow.getNodeModelById(childId).changeField({ newVal: changeH, type: 'add' })
  result.oldHeight = newVal

  result.x = node.x
  result.y = node.y
  flow.setProperties(childId, result)
  // console.log('result newVal===', result, newVal);
  if (properties.oldHeight) {
    if (newVal !== oldVal) {
      const params = { childId, height: newVal }
      changeGroupHeight(params)
      updatePosition(node)
    }
  }
}

const changeGroupHeight = (params: any) => {
  const newGroupModel = getParentNodeById(params.childId)
  updateBlockNodeHeight(newGroupModel.id)
}

// 获取子节点的父
const getGroupNode = (nodes: BaseNodeModel[], childId: string) => {
  let result: any = false
  nodes.forEach((node) => {
    if (node.type === NodeType.BLOCK_NODE) {
      const child = [...node.children]
      if (child.length && child.includes(childId)) {
        result = node
      }
    }
  })
  return result
}

// 将整个组的层级提高
const handleGroupIndex = (data: any, graphModel: GraphModel) => {
  const { id, children } = data
  const childArr = [...children] || []
  childArr.forEach((node) => {
    graphModel.toFront(node.id)
  })
}
