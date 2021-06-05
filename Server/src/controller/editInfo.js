// 直接与数据库对接层
const { QueryMethod } = require("../db/mysql");
// 修改用户一般信息
const editGeneral = async (req, res) => {
  const uid = req.body.uid;
  const avatar = req.body.avatar;
  const username = req.body.username;
  const sex = req.body.sex;
  const email = req.body.email;
  const phone = req.body.phone;
  try {
    const sql = `UPDATE t_user
                SET 
                    username = '${username}',
                    sex = '${sex}',
                    email = '${email}',
                    phone = '${phone}',
                    avatar = '${avatar}'
                WHERE
                    userid = ${uid};
                    `;
    const result = await QueryMethod(sql);
    return {
      affectedRows: result["affectedRows"],
    };
  } catch (err) {
    console.log(err);
    return false;
  }
};
// 修改用户密码
const editPassword = async (req, res) => {
  const uid = req.body.uid;
  const newPass = req.body.newPass;
  const oldPass = req.body.oldPass;
  try {
    const sql = `UPDATE t_user
                  SET 
                      password = '${newPass}'
                  WHERE
                      password = ${oldPass} AND userid = ${uid};
                      `;
    const result = await QueryMethod(sql);
    const temp = result["affectedRows"];
    // 这里有三种情况的成功请求：
    // 1.服务端代码错误
    // 2.成功
    // 3.密码错误
    return result["affectedRows"] === 1
      ? {
          status: "success",
        }
      : {
          status: "password_error", // 密码校验错误
        };
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  editGeneral,
  editPassword,
};
