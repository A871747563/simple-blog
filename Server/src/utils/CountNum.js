function countNum(arr) {
  var arr = arr.sort();
  len = arr.length;
  obj = {};
  for (var i = 0; i < len; i++) {
    if (obj[arr[i]]) {
      obj[arr[i]]++;
    } else {
      obj[arr[i]] = 1;
    }
  }
  return obj;
}

module.exports = {
  countNum,
};
