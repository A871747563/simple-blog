// 启动滚动（做一些初始的处理）
const startEvent = (startValue, endValue) => {
  // 初始化（我们重置页面赋予一个初始的top）---------
  data.startValue = startValue
  data.endValue = endValue
  const scrollvalue = window.pageYOffset
  // const scrollvalue = 0
  if (scrollvalue < data.endValue) {
    document.getElementsByClassName('content')[0].style.marginTop = `-${scrollvalue + data.startValue}px`
  } else {
    document.getElementsByClassName('content')[0].style.marginTop = `-${data.startValue + data.endValue}px`
  }
  // 添加事件监听滚动条的变化----------------
  window.addEventListener('scroll', rollingheight, true)
}
// 结束滚动（事件移除）
const endEvent = () => {
  window.removeEventListener('scroll', rollingheight, true)
}
export { startEvent, endEvent }

// -------------------------------------------------------------------------------------
// 一些初始化变量(全局共享)
const data = {
  // 从endValue偏移到startValue
  endValue: 0, // 事件偏移量
  startValue: 0 // 初始偏移量
}
// 真正的滚动事件
const rollingheight = () => {
  if (window.pageYOffset < 10) {
    document.getElementsByClassName('content')[0].style.marginTop = `-${data.startValue}px`
  } else if (window.pageYOffset <= data.endValue) {
    // 顺滑优化，都来整数
    const temp = Math.ceil(window.pageYOffset) + data.startValue
    document.getElementsByClassName('content')[0].style.marginTop = `-${temp}px`
  }
}
