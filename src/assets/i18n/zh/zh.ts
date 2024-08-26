import zhCN from 'ant-design-vue/es/locale/zh_CN'
import flow from './work-flow.json'

const messages = {
  message: {
    hello: '你好，世界'
  },
  ...flow,
  antLocale: zhCN
}

export default messages
