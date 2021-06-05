// 中间层对数据做处理
const {
  getComment,
  getReply,
  newComment,
  newReply,
} = require("../../controller/comment");
const { SuccessModel, ErrorModel } = require("../../model/responseModel");
const CommentServer = (app) => {
  // 获取博客评论
  app.post("/api/comment", (req, res) => {
    getComment(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取博客评论成功"));
      } else {
        res.send(new ErrorModel("获取博客评论失败"));
      }
    });
  });
  // 获取评论回复
  app.get("/api/reply", (req, res) => {
    getReply(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取评论回复成功"));
      } else {
        res.send(new ErrorModel("获取评论回复失败"));
      }
    });
  });
  // 新增一条博客评论
  app.post("/api/newComment", (req, res) => {
    newComment(req, res).then((result) => {
      if (result && result.length !== 0) {
        res.send(new SuccessModel("新增博客评论成功"));
      } else {
        res.send(new ErrorModel("新增博客评论失败"));
      }
    });
  });
  // 新增一条评论回复
  app.post("/api/newReply", (req, res) => {
    newReply(req, res).then((result) => {
      if (result && result.length !== 0) {
        res.send(new SuccessModel("新增评论回复成功"));
      } else {
        res.send(new ErrorModel("新增评论回复失败"));
      }
    });
  });
};
module.exports = {
  CommentServer,
};
