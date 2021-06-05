function formatDate(d) {
  var yy = d.getFullYear(); // 年
  var mm = d.getMonth() + 1; // 月。
  var dd = d.getDate(); // 日
  var hh = d.getHours(); // 小时
  var min = d.getMinutes(); // 分钟
  var ss = d.getSeconds(); // 秒
  var qq = Math.floor((d.getMonth() + 3) / 3); // 季度
  var sss = d.getMilliseconds(); // 毫秒
  return yy + "-" + mm + "-" + dd + " " + hh + ":" + min + ":" + ss;
}
module.exports = {
  formatDate,
};
