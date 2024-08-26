import { NodeType } from '../type/type'

// 网格样式
export const Grid_Options = {
  size: 24,
  visible: true,
  type: 'dot',
  config: {
    color: '#EBECF0',
    thickness: 4
  }
}

export interface NodeItemProps {
  id: string
  name: string
  children: NodeItemChildrenProps[]
}

export interface NodeItemChildrenProps {
  id: string
  name: string
  type: `${NodeType}` | string
  src: string
}

// 左侧面板
export const Nodes_List: NodeItemProps[] = [
  {
    id: '1',
    name: 'flow.service-node',
    children: [
      {
        id: '1-1',
        name: 'flow.llm',
        type: NodeType.AI_SET_NODE,
        src: '../../../src/assets/img/flow/aiSet.png'
      },
      {
        id: '1-2',
        name: 'flow.intent',
        type: NodeType.INTENT_NODE,
        src: '../../../src/assets/img/flow/intent.png'
      },
      {
        id: '1-3',
        name: 'flow.plugins',
        type: NodeType.PLUGIN_NODE,
        src: '../../../src/assets/img/flow/plugins.png'
      },
      {
        id: '1-4',
        name: 'flow.codeEditor',
        type: NodeType.CODE_NODE,
        src: '../../../src/assets/img/flow/codeIcon.svg'
      }
    ]
  },
  {
    id: '2',
    name: 'flow.branch-node',
    children: [
      {
        id: '2-1',
        name: 'flow.condition-judge',
        type: NodeType.CONDITION_NODE,
        src: '../../../src/assets/img/flow/condition.png'
      }
    ]
  },
  {
    id: '3',
    name: 'flow.handle-node',
    children: [
      {
        id: '3-1',
        name: 'flow.variable-assign',
        type: NodeType.SET_NODE,
        src: '../../../src/assets/img/flow/set.png'
      }
    ]
  },
  {
    id: '4',
    name: 'flow.answer-node',
    children: [
      {
        id: '4-1',
        name: 'flow.answer-text',
        type: NodeType.TEXT_NODE,
        src: '../../../src/assets/img/flow/text.png'
      },
      {
        id: '4-2',
        name: 'flow.answer-session',
        type: NodeType.CAPTURE_NODE,
        src: '../../../src/assets/img/flow/capture.png'
      },
      {
        id: '4-3',
        name: 'flow.answer-llm',
        type: NodeType.GENERATIVE_NODE,
        src: '../../../src/assets/img/flow/generative.png'
      }
    ]
  }
]

// 开始节点的id
export const StartId = 'node_id_1'

// 初始节点
export const Graph_Data = {
  nodes: [
    {
      id: StartId,
      type: 'StartNode',
      x: 280,
      y: 250,
      width: 84,
      height: 40,
      properties: {}
    }
  ]
}

export const Menu_List = [
  {
    label: '选区',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAOVJREFUOBGtVMENwzAIjKP++2026ETdpv10iy7WFbqFyyW6GBywLCv5gI+Dw2Bluj1znuSjhb99Gkn6QILDY2imo60p8nsnc9bEo3+QJ+AKHfMdZHnl78wyTnyHZD53Zzx73MRSgYvnqgCUHj6gwdck7Zsp1VOrz0Uz8NbKunzAW+Gu4fYW28bUYutYlzSa7B84Fh7d1kjLwhcSdYAYrdkMQVpsBr5XgDGuXwQfQr0y9zwLda+DUYXLaGKdd2ZTtvbolaO87pdo24hP7ov16N0zArH1ur3iwJpXxm+v7oAJNR4JEP8DoAuSFEkYH7cAAAAASUVORK5CYII='
  }
]

export const Condition_Sel = [
  {
    label: 'node.equal',
    value: 'EQUAL'
  },
  {
    label: 'node.no-equal',
    value: 'NOT_EQUAL'
  },
  {
    label: 'node.less',
    value: 'LESS'
  },

  {
    label: 'node.great',
    value: 'GREAT'
  },
  {
    label: 'node.less-equal',
    value: 'LESS_EQUAL'
  },
  {
    label: 'node.great-equal',
    value: 'GREAT_EQUAL'
  },
  {
    label: 'node.in',
    value: 'IN'
  },
  {
    label: 'node.not-in',
    value: 'NOT_IN'
  },
  {
    label: 'node.include',
    value: 'INCLUDE'
  },
  {
    label: 'node.not-include',
    value: 'NOT_INCLUDE'
  },
  {
    label: 'node.is-blank',
    value: 'IS_BLANK'
  },
  {
    label: 'node.not-blank',
    value: 'NOT_BLANK'
  }
]

export const Condition_Item = {
  name: '',
  type: 'variable',
  value: '',
  operation: Condition_Sel[0].value,
  innerHTML: ''
}

/**
 * kind —— 1：普通输入框，2：普通选择框 3：唤起变量输入框 4下拉选择变量
 * noLabel: true: 不展示表单的label
 */
export const Flow_Detail = {
  set: [
    {
      label: 'node.variables-des',
      key: 'label',
      kind: 1,
      place: 'node.variables-des-place'
    },
    {
      label: 'node.variables-replace',
      key: 'expression',
      kind: 3,
      place: 'node.variables-replace-place'
    },
    {
      label: 'node.variables-replace-to',
      key: 'variable',
      kind: 4
    }
  ],

  text: {
    label: 'flow.answer-text',
    key: 'label',
    kind: 1,
    place: 'flow.answer-text-place'
  },

  // 会话接收
  capture: [
    {
      kind: 1,
      disabled: true,
      noLabel: true,
      place: 'node.capture-place-1'
    },
    {
      label: 'node.variables-replace-to',
      key: 'expression',
      kind: 4
    }
  ],

  // 条件节点
  condition: [
    {
      label: 'node.variables',
      key: 'value',
      kind: 4
    },
    {
      label: 'node.judge1',
      key: 'operation',
      kind: 2
    },
    {
      label: 'node.variables-value',
      key: 'innerHTML',
      kind: 3
    }
  ]
}

export const dropAllowType = [
  'set',
  'text',
  'aiSet',
  'generative',
  'condition',
  'capture',
  'BlockNode',
  NodeType.INTENT_NODE,
  NodeType.PLUGIN_NODE,
  NodeType.CODE_NODE
]
