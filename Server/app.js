// 主入口
const { LoginServer } = require("./src/routes/login");
const { BlogInfoServer } = require("./src/routes/bloginfo");
const { CommentServer } = require("./src/routes/comment");
const { EditInfoServer } = require("./src/routes/editInfo");
const { EditUserServer } = require("./src/routes/editUser");
const { ComponentServer } = require("./src/routes/components");
const { ErrorModel } = require("./src/model/responseModel");
function appEntry(app) {
  // 拦截设置响应头----------------------------------------------
  app.all("*", (req, res, next) => {
    res.setHeader("Content-Type", "application/json;charset=utf-8"); // 设置下响应头内容，告诉浏览器我们以什么方式渲染返回的数据
    next();
  });
  // 登录路由入口(不需要携带token)-----------------------------------------------------------------------------------
  LoginServer(app);
  // 判断token
  app.all("*", (req, res, next) => {
    // 伪造token检验
    // 真实项目要用算法
    if (req.headers.token && req.headers.token === "232132123123132132") {
      next();
    } else {
      res.send(new ErrorModel("缺乏权限"));
    }
  });
  // 业务处理入口(需要携带token)-----------------------------------------------------------------------------------
  // 启动 博客信息路由
  BlogInfoServer(app);
  CommentServer(app);
  EditInfoServer(app);
  EditUserServer(app);
  ComponentServer(app);
  // 上面为真正的业务处理入口-----------------------------------------------------------------------------------
  // 错误路由
  app.all("*", (req, res) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  });
}
module.exports = { appEntry };
