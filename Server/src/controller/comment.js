// 直接与数据库对接层
const { QueryMethod } = require("../db/mysql");
const { formatDate } = require("../utils/formatDate");
// 根据博客id获取所有的评论
const getComment = async (req, res) => {
  const bid = req.body.bid;
  const offset = req.body.offset;
  const limit = req.body.limit;
  try {
    const sql = `SELECT
                      t_comment.comment_id, 
                      t_comment.comment_content, 
                      t_comment.createtime, 
                      t_comment.user_id, 
                      t_user.username, 
                      t_user.avatar
                    FROM
                      t_comment
                      INNER JOIN
                      t_user
                      ON 
                        t_comment.user_id = t_user.userid
                    WHERE
                      t_comment.blog_id = ${bid}
                    ORDER BY
                      t_comment.createtime DESC
                    LIMIT ${offset}, ${limit};
                    SELECT COUNT(*) as 'allCount' FROM t_comment WHERE blog_id = ${bid}
                    `;
    const result = await QueryMethod(sql);
    // 数据格式处理
    const handleresult = { data: {}, allCount: "" };
    for (let item in result[0]) {
      handleresult.data[item] = result[0][item];
    }
    handleresult.allCount = result[1][0]["allCount"];
    // 获得各评论的回复数总数
    for (i in handleresult["data"]) {
      const item = handleresult["data"][i];
      const tempSql = `SELECT
                          COUNT(*) AS 'allCount'
                        FROM
                          t_reply
                        WHERE
                          comment_id=${item["comment_id"]}`;
      const tempResult = await QueryMethod(tempSql);
      item["replyCount"] = tempResult[0]["allCount"];
    }
    return handleresult;
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 根据评论id获取所有的评论
const getReply = async (req, res) => {
  if (req.query.cid) {
    const cid = req.query.cid;
    try {
      const sql = `SELECT
                    t_reply.target_id,
                    t_reply.user_id,
                    t_reply.reply_content,
                    t_reply.createtime,
                    a.avatar,
                    a.username  aUsername,
                    b.username  bUsername
                  FROM
                    t_reply
                    JOIN t_user a ON t_reply.user_id = a.userid
                    JOIN t_user b ON t_reply.target_id = b.userid 
                  WHERE
                    t_reply.comment_id = ${cid} 
                  ORDER BY
                    t_reply.createtime DESC`;
      const result = await QueryMethod(sql);
      return result;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else {
    return false;
  }
};
// 评论一条博客
const newComment = async (req, res) => {
  try {
    const content = req.body.content;
    const bid = req.body.bid;
    const time = formatDate(new Date());
    const uid = req.body.uid;
    const sql = `INSERT INTO t_comment ( blog_id, user_id, comment_content, createtime)
                  VALUES
                    ( '${bid}',  '${uid}',  '${content}', '${time}' );`;
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
// 回复一条评论（包括回复一条回复）
const newReply = async (req, res) => {
  try {
    const content = req.body.content;
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tid = req.body.tid;
    const time = formatDate(new Date());
    const sql = `INSERT INTO t_reply ( comment_id, user_id, target_id, reply_content, createtime )
                  VALUES
                    ('${cid}', '${uid}', '${tid}', '${content}', '${time}' );`;
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
module.exports = {
  getComment,
  newComment,
  getReply,
  newReply,
};
