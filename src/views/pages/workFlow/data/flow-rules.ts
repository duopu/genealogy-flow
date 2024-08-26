export const nodeValidate = (rules: any) => {
  const rule = {
    message: '只允许从右边的锚点连出',
    validate: (_sourceNode: any, _targetNode: any, sourceAnchor: any) => {
      const type = sourceAnchor.type || sourceAnchor.name
      return type === 'right'
    }
  }
  rules.push(rule)
  return rules
}

export const edgesValidate = (rules: any) => {
  const rule = {
    message: '只允许连接左边的锚点',
    validate: (_sourceNode: any, _targetNode: any, sourceAnchor: any, targetAnchor: any) => {
      const type = targetAnchor.type || targetAnchor.name
      return type === 'left'
    }
  }
  rules.push(rule)
  return rules
}

// 获取兄弟节点
export const getSibling = (id: string, nodes: any, father: any) => {
  const parentItem = nodes.find((item: any) => {
    let data = item
    if (item.height) {
      data = item.getData()
    }
    return data.children && data.children.includes(id)
  })

  if (parentItem) {
    let backData = parentItem
    if (parentItem.height) {
      backData = backData.getData()
      if (father) {
        return {
          pId: backData.id,
          children: backData ? backData.children.filter((item: any) => item !== id) : null
        }
      }
      return backData ? backData.children.filter((item: any) => item !== id) : null
    }
  } else {
    return null
  }
}

export const getChildren = (id: string, array: any) => {
  const chItem = array.find((item: any) => item.id === id)
  return chItem ? chItem.children : null
}

export const getNodeType = (data: any, id: string) => {
  const item = data.find((item: any) => item.id === id)
  return item ? item.type : null
}

// 同一个组件只能连接出去一次 除非条件判断节点
export const assemblyOnlyLinkOne = (sourceNodeId: any, lf: any, id: any, targetNodeId: any) => {
  const eliminate = ['condition', 'intention'] // 派排除的节点 可以连接其他节点多次
  const graphData = lf.getGraphData()
  const { edges, nodes } = graphData
  const type = getNodeType(nodes, sourceNodeId)
  //条件判断可以连接多个但是不能连接同一个多次
  if (eliminate.includes(type)) {
    const counts = edges.filter(
      (item: any) => item.sourceNodeId === sourceNodeId && item.targetNodeId === targetNodeId
    )
    if (counts && counts.length > 1) {
      lf.deleteEdge(id)
    }
  } else {
    // 判断id在edges中出现的次数
    const counts = edges.filter((item: any) => item.sourceNodeId === sourceNodeId)
    if (counts && counts.length > 1) {
      lf.deleteEdge(id)
    }
  }
}

// 组件内部不能连接
export const componentCannotInternally = (sourceNodeId: any, lf: any, id: any) => {
  const graphData = lf.getGraphData()
  const { edges, nodes } = graphData
  const siblingIds = getSibling(sourceNodeId, nodes, null)
  if (siblingIds) {
    const existence = edges.find(
      (item: any) => item.sourceNodeId === sourceNodeId && siblingIds.includes(item.targetNodeId)
    )
    if (existence) {
      lf.deleteEdge(id)
    }
  }
}

// 如果兄弟节点已经有一个出去了就不能连接了
export const siblingLinkCannotInternally = (sourceNodeId: any, lf: any, id: any) => {
  const graphData = lf.getGraphData()
  const { edges, nodes } = graphData
  const siblingIds = getSibling(sourceNodeId, nodes, null)
  if (siblingIds) {
    const existence = edges.find((item: any) => siblingIds.includes(item.sourceNodeId))
    if (existence) {
      lf.deleteEdge(id)
    }
  }
}
