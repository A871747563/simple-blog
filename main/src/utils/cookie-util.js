import Cookies from 'js-cookie'
// 设置cookie
const settingCK = (name, value) => {
  Cookies.set(name, value, { expires: 7 })
}
// 获取cookie
const gettingCK = (name) => {
  return Cookies.get(name)
}
// 删除指定cookie
const DeleteCkByname = (name) => {
  Cookies.remove(name)
}

// 删除所有cookie
const DeleteCkAll = () => {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    /* eslint-disable*/
    for (var i = keys.length; i--; ) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
  }
}
// const settingCK = (name, value, date) => {
//   document.cookie = name + '=' + escape(value) + ';expires=7'
// }
// // 获取cookie
// const gettingCK = (name) => {
//   var arr
//   var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
//   if ((arr = document.cookie.match(reg))) {
//     return unescape(arr[2])
//   } else {
//     return null
//   }
// }
// // 删除指定cookie
// const DeleteCkByname = (name) => {
//   settingCK(name, ' ', -1)
// }

// // 删除所有cookie
// const DeleteCkAll = () => {
//   var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
//   if (keys) {
//     /* eslint-disable*/
//     for (var i = keys.length; i--; ) {
//       document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
//     }
//   }
// }
export { settingCK, gettingCK, DeleteCkByname, DeleteCkAll }
