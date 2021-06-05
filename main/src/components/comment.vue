<template>
  <div id="comment" :class="theme">
    <div class="comment">
      <img v-lazy="userlogo" />
      <el-input v-model="Commentinput" placeholder="请输入评论内容" clearable />
      <el-button type="primary" @click="CommentinputEvent">发布评论</el-button>
    </div>
    <span>{{ `评论区(${allCount})：` }}</span>
    <div v-for="(item, index) in CommentPackage" :key="index" class="item">
      <template v-if="item.comment_content !== ''">
        <div class="userInfo">
          <img v-lazy="item.avatar" />
          <div class="detail">
            <span class="name">{{ item.username }}</span>
            <span class="time">{{ item.createtime }}</span>
          </div>
          <div class="comment_icon">
            <i class="el-icon-s-comment" @click="ReplyEvent(index, item.user_id, item.username)"></i>
            <i class="el-icon-s-order" :class="`loading-${index}`" @click="OpenEvent(index, item.comment_id, item.replyCount)"></i>
            <span>{{ item.replyCount }}</span>
          </div>
        </div>
        <!-- 博客评论内容区 -->
        <div class="content">
          <span>{{ item.comment_content }}</span>
        </div>
        <!-- 评论回复区 -->
        <div class="comment_reply off" :class="`target-${index}`">
          <span>
            <div v-for="(Ritem, Rindex) in ReplyPackage[`data${index}`]" :key="Rindex" class="reply_item">
              <div class="reply_userInfo">
                <img v-lazy="Ritem.avatar" />
                <div class="reply_detail">
                  <span class="reply_name">{{ Ritem.aUsername }}</span>
                  <span class="reply_time">{{ Ritem.createtime }}</span>
                </div>
                <div class="comment_icon">
                  <i class="el-icon-s-comment" @click="RReplyEvent(index, Ritem.user_id, Ritem.aUsername)"></i>
                </div>
              </div>
              <div class="reply_content">
                <span>{{ '@' + Ritem.bUsername + '：' + Ritem.reply_content }}</span>
              </div>
            </div>
          </span>
        </div>
        <!-- 回复评论输入框区 -->
        <div class="comment_reply_input off" :class="`RinputTarget-${index}`">
          <el-input v-model="Replyinput" class="replyInput" :placeholder="tname" clearable />
          <el-button type="primary" @click="CReplyinputEvent(item.comment_id)">发布回复</el-button>
        </div>
      </template>
      <!-- 用户信息区 -->
    </div>
    <!-- 分页器 -->
    <div v-if="CommentPackage.length !== 0" class="pageModel">
      <Pagination :current-page="currentPage" :all-count="allCount" :page-size="pageSize" @handleCurrentChange="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import Pagination from 'components/Pagination'
import { ref, onMounted, computed, inject, reactive } from 'vue'
import { notify } from 'utils/element-util'
import { UTCtobeijing } from 'utils/UTCtobeijing.js'
import { CommentAxios, ReplyAxios, NewCommentAxios, NewReplyAxios } from 'utils/request/requestComm.js'
import { gettingCK } from 'utils/cookie-util'
import { useStore } from 'vuex'
export default {
  components: {
    Pagination
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    // 从父组件拿到刷新函数
    const reload = inject('reload')
    // 登录用户头像
    const userlogo = computed(() => {
      return store.getters['header/getUserlogo']
    })
    // 博客评论数据包
    const CommentPackage = ref([
      {
        username: 'Admin',
        time: '2019年9月16日 18:43',
        content: '一条评论',
        replyCount: 11
      },
      {
        username: 'Admin',
        time: '2019年9月16日 18:43',
        content: '一条评论',
        replyCount: 11
      },
      {
        username: 'Admin',
        time: '2019年9月16日 18:43',
        content: '一条评论',
        replyCount: 11
      },
      {
        username: 'Admin',
        time: '2019年9月16日 18:43',
        content: '一条评论',
        replyCount: 11
      },
      {
        username: 'Admin',
        time: '2019年9月16日 18:43',
        content: '一条评论',
        replyCount: 11
      }
    ])
    // 评论回复数据包(一页五个评论的回复数据包)
    const ReplyPackage = ref({
      data0: [],
      data1: [],
      data2: [],
      data3: [],
      data4: []
    })
    // 回复目标信息
    const tid = ref('0')
    const tname = ref('请输入评论内容')
    // 三个输入框
    const Commentinput = ref('')
    const Replyinput = ref('')
    // const RReplyinput = ref('')
    // 上次评论的回复输入框的索引（用于关闭输入框）
    const RlastInput = ref('')
    // // 上次回复的回复输入框的索引（用于关闭输入框）
    // const RRlastInput = ref('')
    // 分页器配置----------------------------------
    const currentPage = ref(1)
    const allCount = ref(1000)
    const pageSize = ref(5)
    const axioInfo = reactive({
      offset: computed(() => {
        return (currentPage.value - 1) * pageSize.value
      }),
      limit: pageSize.value
    })
    // 页码改变，重新渲染
    const handleCurrentChange = (changePage) => {
      currentPage.value = changePage
      // 获取页码改变后的数据
      getComment()
      // 将回复数据包重置，关闭已展开的回复列表
      ReplyPackage.value = {
        data0: [],
        data1: [],
        data2: [],
        data3: [],
        data4: []
      }
      for (let i = 0; i < 5; i++) {
        const targetClass = `target-${i}`
        const targetDom = document.getElementsByClassName(targetClass)[0]
        targetDom.setAttribute('class', `comment_reply ${targetClass} off`)
      }
    }
    // 评论博客点击事件
    const CommentinputEvent = () => {
      if (Commentinput.value !== '') {
        NewCommentAxios({
          bid: sessionStorage.getItem('blogId'),
          content: Commentinput.value,
          uid: gettingCK('userid')
        })
          .then(
            (res) => {
              console.log(res)
              notify('评论博客成功', 'success')
              reload()
            },
            (err) => {
              notify('请求出错了', 'error')
              console.log(err)
            }
          )
          .catch((err) => {
            notify('前端代码错误', 'error')
            console.log(err)
          })
      } else {
        notify('内容不能为空', 'warning')
      }
    }
    // 回复评论点击事件
    const CReplyinputEvent = (cid) => {
      if (Replyinput.value !== '') {
        NewReplyAxios({
          content: Replyinput.value,
          cid: cid,
          tid: tid.value,
          uid: gettingCK('userid')
        })
          .then(
            (res) => {
              console.log(res)
              notify('回复评论成功', 'success')
              reload()
            },
            (err) => {
              notify('请求出错了', 'error')
              console.log(err)
            }
          )
          .catch((err) => {
            notify('前端代码错误', 'error')
            console.log(err)
          })
      } else {
        notify('内容不能为空', 'warning')
      }
    }
    // // 回复评论中的评论事件
    // const RReplyinputEvent = (cid, tid) => {
    //   console.log(cid, tid)
    // }
    // 点击回复回复的按钮触发的事件（开启回复的回复输入框）-----------------------------------------------------
    const RReplyEvent = (target, id, name) => {
      // 点谁就变成谁的tid，并且提示在回复谁
      console.log(name)
      tname.value = `@${name}`
      tid.value = id
      Replyinput.value = ''
      // // 判断上个输入框是否和本次相同，不同则关闭上次的输入框
      // if (RRlastInput.value !== '' && RRlastInput.value !== target) {
      //   const LastClass = `RRinputTarget-${RRlastInput.value}`
      //   const LastDom = document.getElementsByClassName(LastClass)[0]
      //   LastDom.setAttribute('class', `reply_input ${LastClass} off`)
      // }
      // // 记录下本次点击的输入框的索引
      // RRlastInput.value = target
      // const targetClass = `RRinputTarget-${target}`
      // const targetDom = document.getElementsByClassName(targetClass)[0]
      // targetDom.setAttribute('class', `reply_input ${targetClass} on`)
      // 判断上个输入框是否和本次相同，不同则关闭上次的输入框
      if (RlastInput.value !== '' && RlastInput.value !== target) {
        const LastClass = `RinputTarget-${RlastInput.value}`
        const LastDom = document.getElementsByClassName(LastClass)[0]
        LastDom.setAttribute('class', `comment_reply_input ${LastClass} off`)
      }
      // 记录下本次点击的输入框的索引
      RlastInput.value = target
      // 动态绑定的唯一的类名
      const targetClass = `RinputTarget-${target}`
      const targetDom = document.getElementsByClassName(targetClass)[0]
      targetDom.setAttribute('class', `comment_reply_input ${targetClass} on`)
    }
    // 点击回复评论按钮触发的事件（开启评论回复输入框）-----------------------------------------------------
    const ReplyEvent = (target, id, name) => {
      // 点点谁就变成谁的tid，并且提示在回复谁
      tname.value = `@${name}`
      tid.value = id
      Replyinput.value = ''
      // 判断上个输入框是否和本次相同，不同则关闭上次的输入框
      if (RlastInput.value !== '' && RlastInput.value !== target) {
        const LastClass = `RinputTarget-${RlastInput.value}`
        const LastDom = document.getElementsByClassName(LastClass)[0]
        LastDom.setAttribute('class', `comment_reply_input ${LastClass} off`)
      }
      // 记录下本次点击的输入框的索引
      RlastInput.value = target
      // 动态绑定的唯一的类名
      const targetClass = `RinputTarget-${target}`
      const targetDom = document.getElementsByClassName(targetClass)[0]
      targetDom.setAttribute('class', `comment_reply_input ${targetClass} on`)
    }
    // 点击展开评论回复触发事件------------------------------------------------------------------------------
    const OpenEvent = (target, cid, replyCount) => {
      // 如果回复数为0我们直接不允许展开
      if (replyCount === 0) {
        notify('没有回复哟~~', 'success')
        // 有且仅当数据包中对应数据为空时，我们才去请求数据
      } else if (ReplyPackage.value[`data${target}`].length === 0) {
        // 改变对应位置的图标为转圈等待（防止用户多次点击）
        const loadingClass = `loading-${target}`
        const loadingDom = document.getElementsByClassName(loadingClass)[0]
        loadingDom.setAttribute('class', `el-icon-loading ${loadingClass} `)
        // 发送请求区
        // ---------------------------------------------------------
        ReplyAxios({
          cid: cid
        })
          .then(
            (res) => {
              console.log(res)
              const temp = res.data.data

              // 处理完毕后的数据包
              const handleData = []
              // 将带T和Z的UTC时间转换为标准格式
              for (const item in temp) {
                temp[item].createtime = UTCtobeijing(temp[item].createtime)
                handleData.push(temp[item])
              }
              console.log(handleData)
              ReplyPackage.value[`data${target}`] = handleData
              // 改变对应位置的图标为非转圈（成功拿到请求数据）
              const loadingClass = `loading-${target}`
              const loadingDom = document.getElementsByClassName(loadingClass)[0]
              loadingDom.setAttribute('class', `el-icon-s-order ${loadingClass} `)
              // 打开折叠
              const targetClass = `target-${target}`
              const targetDom = document.getElementsByClassName(targetClass)[0]
              if (targetDom.getAttribute('class').indexOf('on') === -1) {
                targetDom.setAttribute('class', `comment_reply ${targetClass} on`)
              } else {
                targetDom.setAttribute('class', `comment_reply ${targetClass} off`)
              }
              notify('获取评论成功', 'success')
            },
            (err) => {
              notify('请求出错了', 'error')
              console.log(err)
            }
          )
          .catch((err) => {
            notify('前端代码错误', 'error')
            console.log(err)
          })
      } else {
        // 打开折叠
        const targetClass = `target-${target}`
        const targetDom = document.getElementsByClassName(targetClass)[0]
        if (targetDom.getAttribute('class').indexOf('on') === -1) {
          targetDom.setAttribute('class', `comment_reply ${targetClass} on`)
        } else {
          targetDom.setAttribute('class', `comment_reply ${targetClass} off`)
        }
      }
    }

    // axios请求方法区------------------------------------------------------------------------------
    // 发送请求获取首屏数据
    const getComment = () => {
      CommentAxios({
        bid: sessionStorage.getItem('blogId'),
        ...axioInfo
      })
        .then(
          (res) => {
            CommentPackage.value = res.data.data.data
            allCount.value = res.data.data.allCount
            // 将带T和Z的UTC时间转换为标准格式
            for (const item in CommentPackage.value) {
              CommentPackage.value[item].createtime = UTCtobeijing(CommentPackage.value[item].createtime)
            }
            notify('评论初始化成功', 'success')
          },
          (err) => {
            notify('请求出错了', 'error')
            console.log(err)
          }
        )
        .catch((err) => {
          notify('前端代码错误', 'error')
          console.log(err)
        })
    }

    // dom挂载完毕------------------------------------------------------------------------------
    onMounted(() => {
      getComment()
    })
    return {
      Commentinput,
      Replyinput,
      tname,
      // RReplyinput,
      CommentinputEvent,
      CReplyinputEvent,
      // RReplyinputEvent,
      RReplyEvent,
      ReplyEvent,
      OpenEvent,
      currentPage,
      allCount,
      handleCurrentChange,
      CommentPackage,
      ReplyPackage,
      userlogo,
      pageSize,
      theme
    }
  }
}
</script>

<style lang="scss" scoped>
#comment.dark {
  min-height: 300px;
  margin-bottom: 50px;
  > span {
    color: #c9d1d9;
    display: block;
    font-size: 20px;
    margin-bottom: 30px;
  }
  // 回复输入块
  .comment {
    float: left;
    width: 100%;
    min-height: 70px;
    // background: rgb(31, 33, 36);
    background: transparent;
    margin-bottom: 30px;
    // border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 40px;
      border-radius: 5px;
      margin-left: 10px;
    }
    ::v-deep(.el-input) {
      width: 100%;
      margin: 0 10px;
      .el-input__inner {
        background: #090c10;
        color: #c9d1d9;
      }
    }
    ::v-deep(.el-button) {
      margin-right: 10px;
      background-color: transparent;
      &:hover {
        color: #4ca1ec;
      }
    }
  }
  // 博客回复块(针对博客)
  .item {
    float: left;
    width: 100%;
    min-height: 80px;
    color: #c9d1d9;
    // background: rgb(31, 33, 36);
    // border: 1px solid rgb(255, 255, 255);
    background: transparent;
    .userInfo {
      width: 100%;
      // border: 1px solid rgb(255, 255, 255);
      float: left;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        border-radius: 50px;
        margin-left: 10px;
      }

      .detail {
        // border: 1px solid white;
        padding: 0px 20px 7px 20px;
        span {
          display: block;
          //   border: 1px solid white;
          padding: 5px 0;
        }
        .name {
          font-size: 15px;
        }
        .time {
          font-size: 8px;
        }
      }
      .comment_icon {
        position: relative;
        left: 67.8%;
        // border: 1px solid white;
        span {
          font-size: 10px;
        }
        .el-icon-s-comment,
        .el-icon-s-order {
          cursor: pointer;
        }
      }
    }
    .content {
      // border: 1px solid rgb(255, 255, 255);
      float: left;
      margin: 0 0 10px 80px;
      padding: 10px;
      color: #c9d1d9;
      width: calc(100% - 120px);
      border-radius: 5px;
      font-size: 10px;
      background: #012840;
    }
    .comment_reply_input {
      // border: 1px solid white;
      margin: 0 0 0 80px;
      ::v-deep(.el-input) {
        width: 85%;
        margin-right: 10px;
        .el-input__inner {
          background: #090c10;
          color: #c9d1d9;
        }
      }
      ::v-deep(.el-button) {
        margin-right: 5px;
        background-color: transparent;
        &:hover {
          color: #4ca1ec;
        }
      }
      // 评论输入开关
      &.on {
        animation: hideInputOn 0.6s;
        -moz-animation: hideInputOn 0.6s; /* Firefox */
        -webkit-animation: hideInputOn 0.6s; /* Safari and Chrome */
        -o-animation: hideInputOn 0.6s; /* Opera */
        display: static;
      }
      &.off {
        animation: hideInputOff 0.6s;
        -moz-animation: hideInputOff 0.6s; /* Firefox */
        -webkit-animation: hideInputOff 0.6s; /* Safari and Chrome */
        -o-animation: hideInputOff 0.6s; /* Opera */
        display: none;
      }
    }
  }
  // 评论回复块(针对评论)
  .item {
    .comment_reply {
      // 评论开关
      &.on {
        display: block;
        animation: hideItemOn 0.6s;
        -moz-animation: hideItemOn 0.6s; /* Firefox */
        -webkit-animation: hideItemOn 0.6s; /* Safari and Chrome */
        -o-animation: hideItemOn 0.6s; /* Opera */
      }
      &.off {
        animation: hideItemOff 0.6s;
        -moz-animation: hideItemOff 0.6s; /* Firefox */
        -webkit-animation: hideItemOff 0.6s; /* Safari and Chrome */
        -o-animation: hideItemOff 0.6s; /* Opera */
        display: none;
      }
      // border: 1px solid white;
      float: left;
      margin: 0 0 0 60px;
      padding: 10px;
      width: calc(100% - 90px);
      min-height: 80px;
      color: #c9d1d9;
      // background: rgb(31, 33, 36);
      background: transparent;
      border-left: 3px dashed #012840;
      // 评论回复中的每一项
      .reply_item {
        overflow: hidden;
      }
      .reply_userInfo {
        width: 100%;
        // border: 1px solid rgb(255, 255, 255);
        float: left;
        display: flex;
        align-items: center;
        img {
          width: 32px;
          border-radius: 20px;
          margin-left: 10px;
        }
        .reply_detail {
          // border: 1px solid white;
          padding: 0px 20px 7px 20px;
          span {
            display: block;
            //   border: 1px solid white;
            padding: 5px 0;
          }
          .reply_name {
            font-size: 15px;
          }
          .reply_time {
            font-size: 8px;
          }
        }
        .comment_icon {
          position: relative;
          left: 71%;
          cursor: pointer;
          // border: 1px solid white;
        }
      }
      .reply_content {
        float: left;
        margin: 0 0 5px 60px;
        border-radius: 5px;
        padding: 10px;
        font-size: 10px;
        color: #c9d1d9;
        width: calc(100% - 80px);
        background: #012840;
      }
    }
  }
  // 分页器设置
  .pageModel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 5%;
  }
}
#comment.light {
  min-height: 300px;
  margin-bottom: 50px;
  > span {
    color: black;
    display: block;
    font-size: 20px;
    margin-bottom: 30px;
  }
  // 回复输入块
  .comment {
    float: left;
    width: 100%;
    min-height: 70px;
    // background: rgb(31, 33, 36);
    background: transparent;
    margin-bottom: 30px;
    // border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 40px;
      border-radius: 5px;
      margin-left: 10px;
    }
    ::v-deep(.el-input) {
      width: 100%;
      margin: 0 10px;
      // .el-input__inner {
      //   background: #8dabdf;
      //   color: #000;
      // }
    }
    ::v-deep(.el-button) {
      margin-right: 10px;
      // background-color: transparent;
      // &:hover {
      //   color: #d9e3f4;
      // }
    }
  }
  // 博客回复块(针对博客)
  .item {
    float: left;
    width: 100%;
    min-height: 80px;
    color: #000;
    // background: rgb(31, 33, 36);
    // border: 1px solid rgb(255, 255, 255);
    background: transparent;
    .userInfo {
      width: 100%;
      // border: 1px solid rgb(255, 255, 255);
      float: left;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        border-radius: 50px;
        margin-left: 10px;
      }

      .detail {
        // border: 1px solid white;
        padding: 0px 20px 7px 20px;
        span {
          display: block;
          //   border: 1px solid white;
          padding: 5px 0;
        }
        .name {
          font-size: 15px;
        }
        .time {
          font-size: 8px;
        }
      }
      .comment_icon {
        position: relative;
        left: 67.8%;
        // border: 1px solid white;
        span {
          font-size: 10px;
        }
        .el-icon-s-comment,
        .el-icon-s-order {
          cursor: pointer;
        }
      }
    }
    .content {
      // border: 1px solid rgb(255, 255, 255);
      float: left;
      margin: 0 0 10px 80px;
      padding: 10px;
      color: black;
      width: calc(100% - 120px);
      border-radius: 5px;
      font-size: 10px;
      background-color: #e1e7f0;
    }
    .comment_reply_input {
      // border: 1px solid white;
      margin: 0 0 0 80px;
      ::v-deep(.el-input) {
        width: 85%;
        margin-right: 10px;
        // .el-input__inner {
        //   background: #8dabdf;
        //   color: #000;
        // }
      }
      ::v-deep(.el-button) {
        margin-right: 5px;
        // background-color: transparent;
        // &:hover {
        //   color: #d9e3f4;
        // }
      }
      // 评论输入开关
      &.on {
        animation: hideInputOn 0.6s;
        -moz-animation: hideInputOn 0.6s; /* Firefox */
        -webkit-animation: hideInputOn 0.6s; /* Safari and Chrome */
        -o-animation: hideInputOn 0.6s; /* Opera */
        display: static;
      }
      &.off {
        animation: hideInputOff 0.6s;
        -moz-animation: hideInputOff 0.6s; /* Firefox */
        -webkit-animation: hideInputOff 0.6s; /* Safari and Chrome */
        -o-animation: hideInputOff 0.6s; /* Opera */
        display: none;
      }
    }
  }
  // 评论回复块(针对评论)
  .item {
    .comment_reply {
      // 评论开关
      &.on {
        display: block;
        animation: hideItemOn 0.6s;
        -moz-animation: hideItemOn 0.6s; /* Firefox */
        -webkit-animation: hideItemOn 0.6s; /* Safari and Chrome */
        -o-animation: hideItemOn 0.6s; /* Opera */
      }
      &.off {
        animation: hideItemOff 0.6s;
        -moz-animation: hideItemOff 0.6s; /* Firefox */
        -webkit-animation: hideItemOff 0.6s; /* Safari and Chrome */
        -o-animation: hideItemOff 0.6s; /* Opera */
        display: none;
      }
      // border: 1px solid white;
      float: left;
      margin: 0 0 0 60px;
      padding: 10px;
      width: calc(100% - 90px);
      min-height: 80px;
      color: black;
      // background: rgb(31, 33, 36);
      background: transparent;
      border-left: 3px dashed #e1e7f0;
      // 评论回复中的每一项
      .reply_item {
        overflow: hidden;
      }
      .reply_userInfo {
        width: 100%;
        // border: 1px solid rgb(255, 255, 255);
        float: left;
        display: flex;
        align-items: center;
        img {
          width: 32px;
          border-radius: 20px;
          margin-left: 10px;
        }
        .reply_detail {
          // border: 1px solid white;
          padding: 0px 20px 7px 20px;
          span {
            display: block;
            //   border: 1px solid white;
            padding: 5px 0;
          }
          .reply_name {
            font-size: 15px;
          }
          .reply_time {
            font-size: 8px;
          }
        }
        .comment_icon {
          position: relative;
          left: 71%;
          cursor: pointer;
          // border: 1px solid white;
        }
      }
      .reply_content {
        float: left;
        margin: 0 0 5px 60px;
        border-radius: 5px;
        padding: 10px;
        font-size: 10px;
        color: black;
        width: calc(100% - 80px);
        background-color: #e1e7f0;
      }
    }
  }
  // 分页器设置
  .pageModel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 5%;
  }
}
// 回复内容展开关闭动画
@keyframes hideItemOff {
  // 具体细节自己可以调整
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(0, 80px);
  }
}
@keyframes hideItemOn {
  // 具体细节自己可以调整
  0% {
    opacity: 0;
    transform: translate(0, -80px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}
// 回复输入框展开关闭动画
@keyframes hideInputOff {
  // 具体细节自己可以调整
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(80px, 0);
  }
}
@keyframes hideInputOn {
  // 具体细节自己可以调整
  0% {
    opacity: 0;
    transform: translate(-80px, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}
</style>
