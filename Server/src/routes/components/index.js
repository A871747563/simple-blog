// 中间层对数据做处理
const {
  getUserinfo,
  wordCloud,
  getblogTypes,
} = require("../../controller/components");
const { SuccessModel, ErrorModel } = require("../../model/responseModel");
const ComponentServer = (app) => {
  // 用户信息页
  app.post("/api/user/userinfo", (req, res) => {
    getUserinfo(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取用户信息成功"));
      } else {
        res.send(new ErrorModel("获取用户信息失败"));
      }
    });
  });
  //   构建词云图
  app.post("/api/user/wordCloud", (req, res) => {
    wordCloud(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取词云信息成功"));
      } else {
        res.send(new ErrorModel("获取词云信息失败"));
      }
    });
  });
  // 获取博客类型种类
  app.get("/api/user/blogTypes", (req, res) => {
    getblogTypes(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取博客类型种类成功"));
      } else {
        res.send(new ErrorModel("获取博客类型种类失败"));
      }
    });
  });
};
module.exports = {
  ComponentServer,
};
