// 直接与数据库对接层
const { QueryMethod } = require("../db/mysql");
// 查询出所有用户的所有信息(除用户名密码)
const getAllUser = async (req, res) => {
  const offset = req.body.offset;
  const limit = req.body.limit;
  try {
    const sql = `SELECT
                    t_user.userid, 
                    t_user.username, 
                    t_user.sex, 
                    t_user.email, 
                    t_user.phone, 
                    t_user.avatar, 
                    t_user.is_superuser
                FROM
                    t_user
                ORDER BY
                    t_user.userid ASC
                LIMIT ${offset}, ${limit}`;
    const result = await QueryMethod(sql);
    // 查询对应用户的博客总数
    for (item of result) {
      const tempsql = `SELECT COUNT(*) AS 'blogNum' 
                    FROM
                        t_blog 
                    WHERE
                        t_blog.userid = ${item.userid};`;
      const tempResult = await QueryMethod(tempsql);
      item.blogNum = tempResult[0].blogNum;
    }
    // 查询用户总数
    const CountSql = `SELECT COUNT(*) as 'allCount' FROM t_user`;
    const CountResult = await QueryMethod(CountSql);

    return {
      data: result,
      allCount: CountResult[0].allCount,
    };
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 修改指定用户的信息
const editUser = async (req, res) => {
  const uid = req.body.uid;
  const sex = req.body.sex;
  const email = req.body.email;
  const phone = req.body.phone;
  const is_superuser = req.body.is_superuser;
  try {
    const sql = `UPDATE 
                    t_user
                 SET 
                    sex = '${sex}',
                    email = '${email}',
                    phone = '${phone}',
                    is_superuser = ${is_superuser}
                 WHERE
                    userid = ${uid};`;
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
  getAllUser,
  editUser,
};
