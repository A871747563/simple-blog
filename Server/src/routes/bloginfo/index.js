// 中间层对数据做处理
const {
  getAlldata,
  getdataByID,
  UgetAlldata,
  deleteblogdata,
  editblogdata,
  newblogdata,
  Classifydata,
  NewblogType,
} = require("../../controller/bloginfo");
const { SuccessModel, ErrorModel } = require("../../model/responseModel");
const BlogInfoServer = (app) => {
  // 博客进入首页渲染
  app.post("/api/blog/alldata", (req, res) => {
    getAlldata(req, res).then((result) => {
      if (result && result.length !== 0) {
        res.send(new SuccessModel(result, "获取首页数据成功"));
      } else {
        res.send(new ErrorModel("获取首页数据失败"));
      }
    });
  });
  // 点击进入博客内容页渲染(查看一篇博客)
  app.post("/api/blog/databyID", (req, res) => {
    getdataByID(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "根据id获取数据成功"));
      } else {
        res.send(new ErrorModel("根据id获取数据失败"));
      }
    });
  });
  // 登录用户的个人所有博客(我的博客)
  app.post("/api/blog/Ualldata", (req, res) => {
    UgetAlldata(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "根据用户id获取数据成功"));
      } else {
        res.send(new ErrorModel("根据用户id获取数据失败"));
      }
    });
  });
  // 删除一条博客
  app.post("/api/blog/deleteblog", (req, res) => {
    deleteblogdata(req, res).then((result) => {
      if (result && result.length !== 0) {
        res.send(new SuccessModel("删除数据成功"));
      } else {
        res.send(new ErrorModel("删除数据失败"));
      }
    });
  });
  // 获得博客分类信息
  app.post("/api/blog/Classifydata", (req, res) => {
    Classifydata(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "获取分类数据成功"));
      } else {
        res.send(new ErrorModel("获取分类数据失败"));
      }
    });
  });
  // 登录用户编辑自己的博客;
  app.post("/api/blog/editblog", (req, res) => {
    editblogdata(req, res).then((result) => {
      if (result && result.length !== 0) {
        res.send(new SuccessModel("修改数据成功"));
      } else {
        res.send(new ErrorModel("修改数据失败"));
      }
    });
  });
  // 用户写一篇全新的博客
  app.post("/api/blog/newblog", (req, res) => {
    newblogdata(req, res).then((result) => {
      if (result && result.length !== 0) {
        res.send(new SuccessModel(result, "添加博客成功"));
      } else {
        res.send(new ErrorModel("添加博客失败"));
      }
    });
  });
  // 添加新的博客文章类型
  app.post("/api/blog/NewblogType", (req, res) => {
    NewblogType(req, res).then((result) => {
      if (result) {
        res.send(new SuccessModel(result, "添加博客文章类型成功"));
      } else {
        res.send(new ErrorModel("添加博客文章类型失败"));
      }
    });
  });
};

module.exports = {
  BlogInfoServer,
};
