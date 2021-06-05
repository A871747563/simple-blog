// 直接与数据库对接层
const { QueryMethod } = require("../db/mysql");
const { formatDate } = require("../utils/formatDate");
// 查询所有博客的部分结果
const getAlldata = async (req, res) => {
  try {
    const offset = req.body.offset;
    const limit = req.body.limit;
    const sql = `SELECT
                    t_blog.blog_id, 
                    t_blog.userid, 
                    t_user.username, 
                    t_blog.blog_title, 
                    t_blog.blog_info, 
                    t_blog.blog_tag, 
                    blog_type.type_name, 
                    t_blog.create_time, 
                    t_blog.update_time, 
                    t_blog.cover_image
                  FROM
                    t_blog
                    INNER JOIN
                    blog_type
                    ON 
                      t_blog.type_id = blog_type.type_id
                    INNER JOIN
                    t_user
                    ON 
                      t_blog.userid = t_user.userid
                  ORDER BY
                    t_blog.blog_id
                  LIMIT ${offset}, ${limit};
                  SELECT COUNT(*) as 'allCount' FROM t_blog`;
    const result = await QueryMethod(sql);
    // 数据格式处理
    const handleresult = { data: {}, allCount: "" };
    for (let item in result[0]) {
      handleresult.data[item] = result[0][item];
    }
    handleresult.allCount = result[1][0]["allCount"];
    return handleresult;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 根据博客id查询完整结果
const getdataByID = async (req, res) => {
  try {
    if (req.body.bid) {
      const bid = req.body.bid;
      const sql = `SELECT
                      t_blog.blog_id, 
                      t_blog.blog_title, 
                      t_blog.blog_info, 
                      t_blog.userid, 
                      t_user.username, 
                      blog_tag,
                      t_blog.blog_content, 
                      t_blog.type_id ,
                      blog_type.type_name, 
                      t_blog.create_time, 
                      t_blog.update_time, 
                      t_blog.cover_image
                    FROM
                      t_blog
                      INNER JOIN
                      t_user
                      ON 
                        t_blog.userid = t_user.userid
                      INNER JOIN
                      blog_type
                      ON 
                        t_blog.type_id = blog_type.type_id
                    WHERE
                      t_blog.blog_id = ${bid}`;
      const result = await QueryMethod(sql);
      // 正则替换存储时转义的双单引号
      result[0].blog_content = result[0].blog_content.replace(/''/g, "'");
      return result;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
//根据useid获取个人所有的博客(不含内容)
const UgetAlldata = async (req, res) => {
  try {
    if (req.body.uid) {
      const uid = req.body.uid;
      const offset = req.body.offset;
      const limit = req.body.limit;
      const sql = `SELECT
                      t_blog.blog_id, 
                      t_blog.blog_title, 
                      t_blog.create_time, 
                      t_blog.cover_image
                    FROM
                      t_blog
                      INNER JOIN
                      t_user
                      ON 
                        t_blog.userid = t_user.userid
                    WHERE
                      t_user.userid = ${uid}
                    ORDER BY
                      t_blog.blog_id ASC
                    LIMIT ${offset}, ${limit}; 
                    SELECT
                      COUNT(*) AS 'allCount' 
                    FROM
                      t_blog 
                    WHERE
                      t_blog.userid =${uid}`;
      const result = await QueryMethod(sql);
      // 数据格式处理
      const handleresult = { data: {}, allCount: "" };
      for (let item in result[0]) {
        handleresult.data[item] = result[0][item];
      }
      handleresult.allCount = result[1][0]["allCount"];
      return handleresult;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 删除一条博客
const deleteblogdata = async (req, res) => {
  try {
    const bid = req.body.bid;
    const sql = `DELETE 
                  FROM
                    t_blog 
                  WHERE
                    t_blog.blog_id = ${bid};`;
    // 提交更新数据
    const result = await QueryMethod(sql);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 获得博客分类信息
const Classifydata = async (req, res) => {
  try {
    // 先获得所有博客分类信息
    const tempSql = `SELECT
                        blog_type.type_id, 
                        blog_type.type_name
                      FROM
                        blog_type`;
    const tempResult = await QueryMethod(tempSql);
    const Allresult = [];
    // 根据分类信息的id去查询每个分类下博客数量
    for (let item of tempResult) {
      const sql = `SELECT
                      t_blog.blog_id,
                      t_blog.blog_title
                    FROM
                      t_blog
                    WHERE
                      t_blog.type_id = ${item.type_id}
                    ORDER BY
                      t_blog.blog_id
                      LIMIT 0, 10;

                    SELECT
                      COUNT(*) AS 'typeCount'
                    FROM
                      t_blog
                    WHERE
                    t_blog.type_id = ${item.type_id} ;

                    SELECT
                      blog_type.type_name
                    FROM
                      blog_type
                    WHERE
                      blog_type.type_id = ${item.type_id} `;
      const result = await QueryMethod(sql);
      // 数据格式处理
      const handleresult = { data: {}, typeCount: "", type: "" };
      for (let item in result[0]) {
        handleresult.data[item] = result[0][item];
      }
      handleresult.typeCount = result[1][0]["typeCount"];
      handleresult.type = result[2][0].type_name;
      Allresult.push(handleresult);
    }
    return Allresult;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 登录用户编辑自己的博客(根据blogid修改一条博客)
const editblogdata = async (req, res) => {
  try {
    const bid = req.body.bid;
    const title = req.body.title;
    const info = req.body.info;
    const img = req.body.img;
    const uid = req.body.uid;
    const tag = req.body.tag;
    const tid = req.body.tid;
    const time = req.body.time;
    // 后端进行字符串正则替换防止插入出错，因为sql不允许插入单数的单引号，我们只要将单引号都替换成双引号就行了！
    const content = req.body.content.replace(/'/g, "''");
    const sql = `UPDATE t_blog 
                SET blog_title = "${title}",
                blog_info = "${info}",
                blog_content = '${content}',
                blog_tag = "${tag}",
                userid = ${uid},
                type_id = ${tid},
                create_time = "${time}",
                cover_image = "${img}" 
                WHERE
                  blog_id = ${bid};`;
    // 提交更新数据
    const result = await QueryMethod(sql);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 用户写一篇全新的博客
const newblogdata = async (req, res) => {
  try {
    const title = req.body.title;
    const info = req.body.info;
    const img = req.body.img;
    const uid = req.body.uid;
    const tag = req.body.tag;
    const tid = req.body.tid;
    // 后端进行字符串正则替换防止插入出错，因为sql不允许插入单数的单引号，我们只要将单引号都替换成双引号就行了！
    const content = req.body.content.replace(/'/g, "''");
    const time = formatDate(new Date());
    let sql = `
              INSERT INTO t_blog ( blog_title, blog_info, blog_content, blog_tag, userid, type_id, create_time, update_time, cover_image )
              VALUES
                ( '${title}', '${info}', '${content}', '${tag}', ${uid}, ${tid}, '${time}', '${time}', '${img}' );`;
    // 提交更新数据
    const result = await QueryMethod(sql);
    return {
      insertId: result.insertId,
    };
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 添加新的博客文章类型
const NewblogType = async (req, res) => {
  try {
    const typeName = req.body.typeName;
    let sql = `INSERT INTO blog_type ( type_name )
              VALUES
                ( '${typeName}' );`;
    const result = await QueryMethod(sql);
    return {
      affectedRows: result.affectedRows,
    };
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports = {
  getAlldata,
  getdataByID,
  UgetAlldata,
  deleteblogdata,
  editblogdata,
  newblogdata,
  Classifydata,
  NewblogType,
};
