import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission' // router身份拦截处理
import store from './store'
import 'styles/init.scss' // 全局样式初始化
import Particles from 'particles.vue3' // 粒子背景
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css' // elementui样式配置
import 'dayjs/locale/zh-cn' // 国际化
import locale from 'element-plus/lib/locale/lang/zh-cn' // elementui国际化
import animated from 'animate.css' // 动画库
import VueLazyloadNext from 'vue-lazyload-next' // 图片懒加载
import SvgIcon from 'components/Svgicon' // 设置全局的iconfont

// v-md-editor编辑器----------------------------------------------------------------------------------
import VMdEditor from '@kangc/v-md-editor' // 主要配置
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js' // vuepress 主题
// 必要的css
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
// 插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index' // 快速复制代码
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index' // 代码前的序号
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index' // 高亮代码
// 使用
VMdEditor.use(vuepressTheme, {
  codeHighlightExtensionMap: {
    vue: 'html'
  }
})
VMdEditor.use(createLineNumbertPlugin())
VMdEditor.use(createHighlightLinesPlugin())
VMdEditor.use(createCopyCodePlugin())
// v-md-editor编辑器----------------------------------------------------------------------------------
// 懒加载图片配置
const loadimage = require('assets/image/loading.gif')
const errorimage = require('assets/image/error.gif')
// 创建一个app应用
const app = createApp(App)
app
  .use(VMdEditor)
  .use(store)
  .use(router)
  .use(Particles)
  .use(VueLazyloadNext, {
    preLoad: 1.3,
    error: errorimage,
    loading: loadimage,
    attempt: 1
  })
  .component('svg-icon', SvgIcon)
  .use(animated)
  .use(ElementPlus, { locale })
  .mount('#app')
