// 首页数据渲染
export const homeConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/alldata'
}
// 查看一篇文章
export const AblogConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/databyID'
}
// 查看我的博客
export const UblogConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/Ualldata'
}
// 删除一条博客
export const DeleteblogConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/deleteblog'
}
// 获取博客分类
export const ClassifyConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/Classifydata'
}
// 获取标签词云
export const CloudConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/user/wordCloud'
}
// 新建一条博客
export const NewblogConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/newblog'
}
// 编辑一条博客
export const EditblogConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/editblog'
}
// 获取博客类型种类
export const blogTypesConfig = {
  method: 'get',
  url: 'http://localhost:4399/api/user/blogTypes'
}
// 添加博客类型种类
export const NewblogTypeConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/blog/NewblogType'
}
