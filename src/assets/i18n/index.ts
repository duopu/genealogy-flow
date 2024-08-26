import { createI18n } from 'vue-i18n'
import messages from './messages' // 引入语言文件

const i18n = createI18n({
  locale: 'zh', // 设置默认语言
  messages
})

export default i18n
