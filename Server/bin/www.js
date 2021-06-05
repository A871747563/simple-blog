const express = require("express");
let cors = require("cors");
// var bodyParser = require("body-parser");
const { appEntry } = require("../app");
const app = express();
// 设置允许跨域
app.use(cors());
// 使用 urlencoded 中间件处理post参数
// 19年express自带 urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(4399, () => {
  console.log("服务器成功启动，位置：http://localhost:4399");
});
// 启动路由
appEntry(app);
