// 节点类型枚举
export enum NodeType {
  AI_SET_NODE = 'aiSet', // 大模型节点
  GENERATIVE_NODE = 'generative', // 大模型回复节点
  TEXT_NODE = 'text', // 文本节点
  CONDITION_NODE = 'condition', // 条件节点
  SET_NODE = 'set', // 变量赋值节点
  CAPTURE_NODE = 'capture', // 会话接收节点
  BLOCK_NODE = 'BlockNode', // 块节点
  START_NODE = 'StartNode', // 开始节点
  INTENT_NODE = 'intention', // 意图识别节点
  PLUGIN_NODE = 'plugin', // 插件节点
  CODE_NODE = 'code' // 代码节点
}

export type NodeTypeText = (typeof NodeType)[keyof typeof NodeType] // keyof typeof InputItemType

// 复杂节点类型
export const ComplexNode = [
  'condition', // 条件节点
  'intention' // 意图识别节点
]

export interface VariableItem {
  id: string
  flowId: string
  name: string
  createTime: string
  createId: string
  createName: string
  type: string
}

export enum SortTypeEnum {
  yPosition = 'yPosition', // 默认根据Y轴排序
  childOrder = 'childOrder' // 根据子节点数组顺序排序
}

export type SortByTypes = (typeof SortTypeEnum)[keyof typeof SortTypeEnum]

export interface UpdatePositionOptions {
  sortBy: SortByTypes
}

export interface DataProps {
  x?: number
  y?: number
  id?: string
  type?: string
}
