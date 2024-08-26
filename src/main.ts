import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import 'ant-design-vue/dist/reset.css'

import i18n from '@/assets/i18n'
import useAntd from '@/utils/useAntd'

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(useAntd)

app.mount('#app')
