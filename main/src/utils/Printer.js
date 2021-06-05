// 文本参数，dom ID节点 ，速度
export const printer = (value, dom, speed) => {
  // 节点位置
  const divTyping = document.getElementById(dom)
  const str = value
  let index = true
  // 打印
  const start = () => {
    // 基本参数
    let i = 0
    let timer = 0
    return new Promise((resolve, reject) => {
      timer = setInterval(() => {
        if (i <= str.length) {
          // 字符串拼接
          divTyping.innerHTML = str.slice(0, i++)
        } else {
          // 停止 定时执行器
          clearInterval(timer)
          resolve()
        }
      }, speed)
    })
  }
  // 反打印
  const unstart = () => {
    // 基本参数
    let i = str.length
    let timer = 0
    return new Promise((resolve, reject) => {
      timer = setInterval(() => {
        if (i >= 0) {
          // 字符串拼接
          divTyping.innerHTML = str.slice(0, i--)
        } else {
          // 停止 定时执行器
          clearInterval(timer)
          resolve()
        }
      }, speed)
    })
  }

  // 重复循环定时器
  // 每隔1秒询问一次
  return setInterval(() => {
    if (index) {
      // 重置，并且关闭入口
      index = false
      // divTyping.innerHTML = '_'
      // 打印(延时打印)(等待0.3秒再打印)
      setTimeout(() => {
        start().then(() => {
          // 反打印(延迟执行)(等待0.3秒再反打印)
          setTimeout(() => {
            unstart().then((res) => {
              // 执行完毕，开启入口
              index = true
            })
          }, 1000)
        })
      }, 300)
    }
  }, 1000)
}
