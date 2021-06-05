const { MYSQL_CONFIG } = require("../config/config");
const mysql = require("mysql");

let SQLserver = mysql.createConnection(MYSQL_CONFIG);
SQLserver.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("连接数据库成功");
  }
});

// mysql 查询模型
const QueryMethod = (sql, callback) => {
  return new Promise((resolve, reject) => {
    SQLserver.query(sql, (err, result) => {
      if (err) {
        console.log("出错了");
        reject(err);
        return;
      } else {
        console.log("成功与数据库交互");
        resolve(result);
      }
    });
  });
};

module.exports = { QueryMethod };
