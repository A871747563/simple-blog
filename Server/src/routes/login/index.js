// 中间层对数据做处理
const { adminRegister, adminLogin } = require("../../controller/login");
const { SuccessModel, ErrorModel } = require("../../model/responseModel");
const LoginServer = (app) => {
  app.post("/api/register", (req, res) => {
    adminRegister(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel("注册成功"));
      } else {
        res.send(new ErrorModel("注册失败"));
      }
    });
  });

  app.post("/api/login", (req, res) => {
    adminLogin(req, res).then((result) => {
      if (result && result.length !== 0) {
        // 给登录添加一个key，前端的身份验证cookie
        result[0]["token"] = "232132123123132132";
        res.send(new SuccessModel(result[0], "登录成功"));
      } else {
        res.send(new ErrorModel("登录失败"));
      }
    });
  });
};

module.exports = {
  LoginServer,
};
