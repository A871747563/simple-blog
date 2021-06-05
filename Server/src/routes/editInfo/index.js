// 中间层对数据做处理
const { editGeneral, editPassword } = require("../../controller/editInfo");
const { SuccessModel, ErrorModel } = require("../../model/responseModel");
const EditInfoServer = (app) => {
  // 修改用户一般信息
  app.post("/api/editInfo/editGeneral", (req, res) => {
    editGeneral(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "修改一般信息成功"));
      } else {
        res.send(new ErrorModel("修改一般信息失败"));
      }
    });
  });
  // 修改用户密码
  app.post("/api/editInfo/editPassword", (req, res) => {
    editPassword(req, res).then((result) => {
      if (result.status === "success") {
        res.send(new SuccessModel(result, "修改密码成功"));
      } else {
        res.send(new ErrorModel(result, "修改密码失败"));
      }
    });
  });
};
module.exports = {
  EditInfoServer,
};
