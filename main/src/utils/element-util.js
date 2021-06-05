import { ElMessage } from 'element-plus'
import { ElNotification } from 'element-plus'
import store from 'store'
export const message = (text, type, isHtml, time) => {
  ElMessage({
    message: text,
    type: type,
    center: true,
    offset: -10,
    duration: time || 1000,
    // 是否将 message 属性作为 HTML 片段处理
    dangerouslyUseHTMLString: isHtml || false
  })
}
export const notify = (text, type) => {
  ElNotification({
    title: '通知',
    message: text,
    type: type,
    position: 'top-left',
    offset: 40,
    customClass: store.getters['header/getTheme'],
    duration: 1500
  })
}
