import type { NodeItemChildrenProps } from '@/views/pages/workFlow/data/work-flow.enum'
import { NodeType } from '@/views/pages/workFlow/type/type'
import {
  AiSetNode,
  BlockNode,
  CaptureNode,
  CodeNode,
  ConditionNode,
  GenerativeNode,
  IntentNode,
  PluginNode,
  SetNode,
  StartNode,
  TextNode
} from '@/views/pages/workFlow/data/node'
import DefaultLine from '@/views/pages/workFlow/data/edges/DefaultLine'
import LogicFlow from '@logicflow/core'
import { DndPanel, Group, Menu, SelectionSelect } from '@logicflow/extension'
import { Condition_Sel, Graph_Data, Grid_Options } from '@/views/pages/workFlow/data/work-flow.enum'
// import { bindEvent } from '@/views/pages/workFlow/data/operateEvent'

let flow: LogicFlow

export const getLogicFlow = () => {
  return flow
}

export const initGraph = async (): Promise<LogicFlow> => {
  return new Promise((resolve) => {
    LogicFlow.use(Menu)

    const graphData = Graph_Data

    flow = new LogicFlow({
      container: document.getElementById('container') as HTMLElement,
      grid: Grid_Options,
      background: { backgroundColor: '#F7F8FA' },
      snapline: false,
      // 注册组件
      plugins: [Menu, Group, DndPanel, SelectionSelect]
    })

    // this.operateService.setLogicFlow(this.lf); // 赋值给service 当前lf实例
    // this.flowOperaService.setLogicFlow(this.lf); // 赋值给service 当前lf实例
    registerNode() // 注册节点
    setMenuConfig() // 设置菜单
    flow.render(graphData)
    resolve(flow)
  })
}

export const addNode = (node: NodeItemChildrenProps) => {
  const { type, src } = node
  switch (type) {
    // 条件判断
    case NodeType.CONDITION_NODE:
      addConditionNode(src)
      break
    case NodeType.SET_NODE:
      addSetNode(src)
      break
    case NodeType.TEXT_NODE:
      addTextNode(src)
      break
    case NodeType.AI_SET_NODE:
      addAiSetNode(src)
      break
    case NodeType.GENERATIVE_NODE:
      addGenerativeNode(src)
      break
    case NodeType.CAPTURE_NODE:
      addCaptureNode(src)
      break
    case NodeType.INTENT_NODE:
      addIntentNode(src)
      break
    case NodeType.PLUGIN_NODE:
      addPluginNode(src)
      break
    case NodeType.CODE_NODE:
      addCodeNode(src)
      break
    default:
      break
  }
}

const registerNode = () => {
  const nodeList = [
    BlockNode,
    StartNode,
    ConditionNode,
    SetNode,
    TextNode,
    CaptureNode,
    AiSetNode,
    GenerativeNode,
    DefaultLine,
    CodeNode,
    IntentNode,
    PluginNode
  ]
  nodeList?.forEach((node) => {
    flow.register(node)
  })
  flow.setDefaultEdgeType('DefaultLine')
}

// 添加LLM节点
const addAiSetNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.AI_SET_NODE,
    text: '',
    properties: {
      type: NodeType.AI_SET_NODE,
      name: 'LLM', // t('flow.llm'),
      src,
      place: '大模型交互', // t('flow.llm-interaction'),
      body: '',
      oldHeight: 0,
      x: 0,
      y: 0
    }
  })
}

const addCodeNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.CODE_NODE,
    text: '',
    properties: {
      type: NodeType.CODE_NODE,
      name: '代码编辑器', // t('flow.codeEditor'),
      src,
      place: '代码编辑器', // t('flow.codeEditor'),
      body: '',
      oldHeight: 0,
      x: 0,
      y: 0
    }
  })
}

// 添加LLM回复节点
const addGenerativeNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.GENERATIVE_NODE,
    text: '',
    properties: {
      type: NodeType.GENERATIVE_NODE,
      name: 'LLM回复', // t('flow.answer-llm'),
      src,
      place: '大模型回复', // t('flow.llm-reply'),
      body: '',
      oldHeight: 0,
      x: 0,
      y: 0
    }
  })
}

// 变量赋值
const addSetNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.SET_NODE,
    text: '',
    properties: {
      type: NodeType.SET_NODE,
      src,
      name: '变量赋值', // t('flow.variable-assign'),
      place: '请输入内容', // t('node.place'),
      body: '',
      oldHeight: 0,
      x: 0,
      y: 0,
      setData: { label: '', variable: '', innerHTML: '' },
      nodeParams: {
        label: '变量赋值', // t('flow.variable-assign'),
        sets: [
          {
            variable: 'new_params',
            expression: [{ type: 'text', value: '' }]
          }
        ]
      }
    }
    // children: ['rect_2'],
  })
}

// 文本回复
const addTextNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.TEXT_NODE,
    text: '',
    properties: {
      type: NodeType.TEXT_NODE,
      name: '文本回复', // t('flow.answer-text'),
      src,
      place: '请输入内容', // t('node.place'),
      oldHeight: 0,
      x: 0,
      y: 0,
      textList: [{ info: '' }],
      nodeParams: {
        texts: [{ text: [{ type: 'text', value: '' }] }]
      }
    }
  })
}

// 条件判断
const addConditionNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.CONDITION_NODE,
    text: '',
    properties: {
      type: NodeType.CONDITION_NODE,
      name: '条件判断', // t('flow.condition-judge'),
      place: '请输入', //  t('tips.p-enter'),
      src,
      height: 80,
      fields: [{ name: '', key: Math.random().toString(36).substring(2, 7) }],
      conditionList: [
        {
          id: '1',
          name: '',
          relation: 'AND',
          child: [
            {
              name: '',
              type: 'variable',
              value: '',
              operation: Condition_Sel[0].value,
              innerHTML: ''
            }
          ],
          reqArr: [
            {
              type: 'variable',
              value: '',
              operation: Condition_Sel[0].value,
              operationValue: [
                {
                  type: 'text',
                  value: ''
                }
              ]
            }
          ]
        }
      ],
      nodeParams: {
        expressions: [
          {
            id: '1',
            name: '',
            relation: 'AND',
            value: [
              {
                type: 'variable',
                value: '',
                operation: Condition_Sel[0].value,
                operationValue: [
                  {
                    type: 'text',
                    value: ''
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  })
}

const addCaptureNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.CAPTURE_NODE,
    text: '',
    properties: {
      type: NodeType.CAPTURE_NODE,
      name: '收集用户回复内容并赋值到{{variable}}变量', // t('node.capture-place', { variable: '{last_user_response}' }),
      src,
      place: '请输入内容', // t('node.place'),
      oldHeight: 0,
      x: 0,
      y: 0,
      variable: 'last_user_response',
      nodeParams: {
        capture: {
          variable: 'last_user_response'
        }
      }
    }
  })
}

const addIntentNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.INTENT_NODE,
    text: '',
    properties: {
      type: NodeType.INTENT_NODE,
      name: '意图识别器', // t('flow.intent'),
      place: '请输入内容', // t('node.place'),
      src,
      height: 80,
      intention: [
        {
          id: '1',
          name: '',
          key: Math.random().toString(36).substring(2, 7),
          showDes: false,
          innerHtmlVal: '',
          description: [
            {
              type: 'text',
              value: ''
            }
          ]
        }
      ],
      nodeParams: {
        label: '',
        capture: {
          variable: 'last_user_response'
        },
        aiParamSetting: {
          model: '',
          topP: 0.95,
          temperature: 0.7,
          maxTokens: 500
        },
        intention: [
          {
            id: '1',
            name: '',
            description: [
              {
                type: 'text',
                value: ''
              }
            ]
          }
        ]
      }
    }
  })
}

const addPluginNode = (src: string) => {
  flow.dnd.startDrag({
    type: NodeType.PLUGIN_NODE,
    text: '',
    properties: {
      type: NodeType.PLUGIN_NODE,
      name: '插件', // t('flow.plugins'),
      src,
      place: '请输入内容', // t('node.place'),
      oldHeight: 0,
      x: 0,
      y: 0,
      nodeParams: {
        label: '',
        pluginSetting: {
          toolsId: '',
          requestParams: [],
          responseParams: []
        }
      }
    }
  })
}

const setMenuConfig = () => {
  // const that = this
  flow.extension.menu.setMenuConfig({
    nodeMenu: [],
    edgeMenu: [],
    graphMenu: []
  })
  const explains = ['BlockNode', 'StartNode'] // 不需要右键删除的组件
  const nodeTypes = Object.values(NodeType)
  for (const i in nodeTypes) {
    if (explains.includes(nodeTypes[i])) continue
    flow.extension.menu.setMenuByType({
      type: nodeTypes[i],
      menu: [
        {
          text: '删除',
          callback() {
            // that.rightMenu(node);
          }
        }
      ]
    })
  }
}
