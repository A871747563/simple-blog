
// 判断时间是否为个位数，如果时间为个位数就在时间之前补上一个“0”
function check(val) {
  if (val < 10) {
    return ('0' + val)
  } else {
    return (val)
  }
}
export const displayTime = () => {
  // 获取系统当前的小时、分钟、毫秒
  var date = new Date()
  var hour = date.getHours()
  var minutes = date.getMinutes()
  var second = date.getSeconds()
  return {
    hour: check(hour),
    minutes: check(minutes),
    second: check(second)
  }
}

