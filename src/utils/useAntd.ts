import { Button, message, Drawer, Input } from 'ant-design-vue'
import type { App } from 'vue'

export default {
  install: (app: App, options?: object) => {
    app.use(Button)
    app.use(Drawer)
    app.use(Input)

    app.config.globalProperties.$message = message
  }
}
