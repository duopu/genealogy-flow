import enUS from 'ant-design-vue/es/locale/en_US'
import flow from './work-flow.json'

const messages = {
  message: {
    hello: 'hello world'
  },
  ...flow,
  antLocale: enUS
}

export default messages
