// 直接与数据库对接层
const { QueryMethod } = require("../db/mysql");
const { cloudhandle } = require("../utils/Cloudhandle");
const { countNum } = require("../utils/CountNum");
// 获取用户的所有信息
const getUserinfo = async (req, res) => {
  if (req.body.uid) {
    const uid = req.body.uid;
    try {
      const sql = `SELECT
                      t_user.username,
                      t_user.sex,
                      t_user.email,
                      t_user.phone,
                      t_user.avatar,
                      t_user.is_superuser 
                    FROM
                      t_user 
                    WHERE
                      t_user.userid = ${uid};
                    SELECT
                      COUNT(*) AS 'blogNum' 
                    FROM
                      t_blog 
                    WHERE
                      t_blog.userid = ${uid};`;
      const result = await QueryMethod(sql);
      const handleresult = { data: {}, blogNum: "" };
      handleresult.data = result[0][0];
      handleresult.blogNum = result[1][0]["blogNum"];
      return handleresult;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else {
    return false;
  }
};
// 博客词云云图
const wordCloud = async (req, res) => {
  try {
    const sql = `SELECT
                      t_blog.blog_tag
                    FROM
                      t_blog`;
    const result = await QueryMethod(sql);
    const handleResult = cloudhandle(result);
    const finallyResult = countNum(handleResult);
    return finallyResult;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 获取博客类型种类
const getblogTypes = async (req, res) => {
  try {
    const sql = `SELECT
                    blog_type.type_id, 
                    blog_type.type_name
                  FROM
                    blog_type`;
    const result = await QueryMethod(sql);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports = {
  getUserinfo,
  wordCloud,
  getblogTypes,
};
