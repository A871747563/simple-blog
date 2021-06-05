// 首页数据渲染
export const CommentConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/comment'
}
// 查看一篇文章
export const ReplyConfig = {
  method: 'get',
  url: 'http://localhost:4399/api/reply'
}
// 查看我的博客
export const NewCommentConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/newComment'
}
// 删除一条博客
export const NewReplyConfig = {
  method: 'post',
  url: 'http://localhost:4399/api/newReply'
}
