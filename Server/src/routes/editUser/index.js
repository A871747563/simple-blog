// 中间层对数据做处理
const { getAllUser, editUser } = require("../../controller/editUser");
const { SuccessModel, ErrorModel } = require("../../model/responseModel");
const EditUserServer = (app) => {
  // 获取所有用户信息
  app.post("/api/editUser/getAllUser", (req, res) => {
    getAllUser(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取所有用户信息成功"));
      } else {
        res.send(new ErrorModel("获取所有用户失败"));
      }
    });
  });
  // 修改指定用户信息
  app.post("/api/editUser/editUser", (req, res) => {
    editUser(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "修改指定用户信息成功"));
      } else {
        res.send(new ErrorModel("修改指定用户信息失败"));
      }
    });
  });
};
module.exports = {
  EditUserServer,
};
