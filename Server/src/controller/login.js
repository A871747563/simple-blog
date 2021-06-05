// 直接与数据库对接层
const { QueryMethod } = require("../db/mysql");
const adminLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const sql = `SELECT
                  t_user.userid,
                  t_user.is_superuser
                FROM
                  t_user
                WHERE
                  t_user.username = '${username}' AND
                  t_user.password = '${password}'`;
    const result = await QueryMethod(sql);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const adminRegister = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const sex = req.body.sex;
    const email = req.body.email;
    const phone = req.body.phone;
    // 默认头像
    const avatar = "https://i.loli.net/2021/02/05/IgwtjY2RW7sOuMo.png";
    const sql = `INSERT INTO t_user (username, password, sex, email, phone, avatar )
    VALUES
      ('${username}', '${password}', '${sex}', '${email}', '${phone}', '${avatar}' );`;
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
  adminRegister,
  adminLogin,
};
