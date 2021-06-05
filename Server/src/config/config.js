let MYSQL_CONFIG = {};
MYSQL_CONFIG = {
  host: "localhost",
  user: "root",
  password: "123456",
  port: 3306,
  database: "blog_system",
  multipleStatements: true, // 支持执行多条 sql 语句
};
module.exports = {
  MYSQL_CONFIG,
};
