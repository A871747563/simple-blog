<template>
  <div id="BlogDetail" :class="theme">
    <div class="cover">
      <img v-lazy="Ablogdata.cover_image" />
      <div class="info">
        <div class="title">
          <span>
            <Printer :text="Ablogdata.blog_title" />
          </span>
        </div>
        <div class="small-info">
          <span class="author">
            <svg-icon icon-name="businesscard_fill" class-name="detail-icon" :class="theme" />
            {{ Ablogdata.username }}
          </span>
          <span class="createtime">
            <svg-icon icon-name="time_fill" class-name="detail-icon" :class="theme" />
            {{ Ablogdata.create_time }}
          </span>
          <span class="text-count">
            <svg-icon icon-name="brush_fill" class-name="detail-icon" :class="theme" />
            {{ contentCount }}字
          </span>
          <span class="readtime">
            <svg-icon icon-name="computer_fill" class-name="detail-icon" :class="theme" />
            {{ readTime }}分钟
          </span>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="content">
        <div class="describes">{{ Ablogdata.blog_info }}</div>
        <div class="essay" data-toc="#toc" v-html="Ablogdata.blog_content"></div>
      </div>
      <div class="comment-model">
        <div class="comment">
          <Comment v-if="isRouterAlive" />
        </div>
      </div>
      <div id="toc"></div>
    </div>
  </div>
</template>

<script>
// 打印机组件
import Printer from 'components/Printer'
import { computed, onMounted, onUnmounted, ref, provide, nextTick, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AblogAxios } from 'utils/request/requestInfo.js'
import { notify, message } from 'utils/element-util'
import { UTCtobeijing } from 'utils/UTCtobeijing.js'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import 'highlight.js/styles/atom-one-dark.css'
import Comment from 'components/comment'
import 'toc-helper/css/toc-helper.min.css'
import TocHelper from 'toc-helper'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import Clipboard from 'clipboard'
// 引入默认样式
import 'highlight.js/scss/default.scss'
// 引入个性化的vs2015样式
import 'highlight.js/styles/vs2015.css'
export default {
  components: {
    Printer,
    Comment
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    // md 转 html 处理器
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        // 当前时间加随机数生成唯一的id标识
        const codeIndex = parseInt(Date.now()) + Math.floor(Math.random() * 10000000)
        // 复制功能主要使用的是 clipboard.js
        let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`
        const linesLength = str.split(/\n/).length - 1
        // 生成行号
        let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'
        for (let index = 0; index < linesLength; index++) {
          linesNum = linesNum + '<span></span>'
        }
        linesNum += '</span>'
        if (lang && hljs.getLanguage(lang)) {
          try {
            // highlight.js 高亮代码
            const preCode = hljs.highlight(lang, str, true).value
            html = html + preCode
            if (linesLength) {
              html += '<b class="name">' + lang + '</b>'
            }
            // 将代码包裹在 textarea 中
            return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(
              /<\/textarea>/g,
              '&lt;/textarea>'
            )}</textarea>`
          } catch (error) {
            console.log(error)
          }
        }

        const preCode = md.utils.escapeHtml(str)
        html = html + preCode
        // 将代码包裹在 textarea 中
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(
          /<\/textarea>/g,
          '&lt;/textarea>'
        )}</textarea>`
      }
    })
    // 提供给组件刷新的配置，在发送数据改变请求后让其执行
    const isRouterAlive = ref(true)
    const reload = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    provide('reload', reload)
    // 使用 storage 进行参数缓存，会话结束立即清空
    const route = useRoute()
    if (route.params.blogId) {
      // 进入本页面，马上进行路由传参的参数存储
      sessionStorage.setItem('blogId', route.params.blogId)
    }
    const blogId = ref('')
    const Ablogdata = ref('')
    const contentCount = ref('') // 字数统计
    const clipboard = ref('') // 代码复制功能对象
    const readTime = computed(() => {
      return Math.ceil(contentCount.value / 300)
    }) // 阅读事件计算
    // dom渲染完毕后
    onMounted(() => {
      // 开启滚动样式变化事件
      startEvent(35, 45)
      // 从sessionStorage中获取blogId从而发起axios请求
      blogId.value = sessionStorage.getItem('blogId')
      // 发起请求获取数据
      getEssay()
      setTimeout(() => {
        new TocHelper({
          dom: '*[data-toc]', // 文章内容元素 选择器 或 HTMLElement
          classNames: {
            // class选择器
            toc: 'toc',
            hidden: 'toc-hidden',
            fxied: 'toc-fixed',
            brand: 'toc-brand',
            navbar: 'toc-navbar',
            hightlight: 'toc-hightlight',
            nav: 'toc-nav',
            link: 'toc-link',
            active: 'active',
            marginLeft1: 'ml-1',
            marginLeft2: 'ml-2',
            marginLeft3: 'ml-3',
            marginLeft4: 'ml-4',
            marginLeft5: 'ml-5',
            marginLeft6: 'ml-6'
          },
          hightlight: true,
          brand: '文章目录',
          shadow: false,
          idPrefix: 'blogDetail#',
          offsetBody: document.body,
          // tocFixed: {
          //   top: 24,
          //   left: 0
          // },
          maxDepth: 6,
          autoScroll: true,
          hiddenAfter: null,
          showBefore: null
        }).reset()
      }, 1000)
      // 代码复制功能
      nextTick(() => {
        clipboard.value = new Clipboard('.copy-btn')
        // 复制成功失败的提示
        clipboard.value.on('success', (e) => {
          message('复制成功', 'success')
        })
        clipboard.value.on('error', (e) => {
          message('复制成功失败', 'success')
        })
      })
    })
    // 一般策略
    onUnmounted(() => {
      // 移除滚动样式变化事件
      endEvent()
      clipboard.value.destroy()
    })
    // 缓存策略
    onActivated(() => {
      startEvent(35, 45)
    })
    onDeactivated(() => {
      // 移除滚动样式变化事件
      endEvent()
    })
    // 请求定义区------------------------------------------------
    const getEssay = () => {
      AblogAxios({
        bid: blogId.value
      })
        .then(
          (res) => {
            const tempdata = res.data.data[0]
            tempdata.create_time = UTCtobeijing(tempdata.create_time)
            tempdata.blog_content = md.render(tempdata.blog_content)
            contentCount.value = tempdata.blog_content.length
            Ablogdata.value = tempdata
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
    return {
      Ablogdata,
      contentCount,
      readTime,
      isRouterAlive,
      theme
    }
  }
}
</script>

<style lang="scss" scoped>
#BlogDetail.dark {
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
    flex-wrap: wrap; // 自动换行模式
    align-content: flex-start; // 子类就会开启最小限度行距距模式
    position: relative;
  }
  .content {
    z-index: 2;
    margin-top: -35px;
    border-radius: 12px;
    width: 60%;
    min-height: 80vh; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    background-color: #011826;
    position: relative;
    .describes {
      color: black;
      font-size: 13px;
      margin: 5% 7% 3% 7%;
      padding: 8px 16px;
      background-color: #c9d1d9;
      border-radius: 4px;
      border-left: 5px solid #4ca1ec;
      min-height: 30px;
      line-height: 20px;
      // 让文本居中
      display: flex;
      align-items: center;
    }
    .essay {
      margin: 0 7% 10% 7%;
      padding: 20px 0;
      // font-size: 15px;
      line-height: 30px;
      // color: #4ca1ec;
      overflow: hidden;
    }
  }
  .comment-model {
    z-index: 2;
    width: 60%;
    min-height: 20vh; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    background-color: #011826;
    border-radius: 12px;
    position: relative;
    .comment {
      margin: 0 7% 0 7%;
      padding-top: 3%;
      float: left;
      width: 86%;
    }
  }
  /* 封面图 */
  .cover {
    user-select: none;
    width: 100%;
    height: 65vh;
    // position: absolute;
    float: left;
    // background-color: rgb(65, 104, 120);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    > img {
      opacity: 0.9;
      width: 100%;
      // max-width: 100% !important;
      // position: relative;
      // left: 0;
      // right: 0;
      // margin: 0;
    }
    .info {
      // 绝对定位使得文字能够跑到图片上面来
      position: absolute;
      color: #4ca1ec;
      font-weight: 800;
      // border: 1px solid white;
      .title {
        float: left;
        width: 100%;
        height: 50px;
        font-size: 2vw;
        //   background-color: wheat;
        margin-bottom: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .small-info {
        float: left;
        width: 100%;
        // background-color: violet;
        > span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.1vw;
          // border: 1px solid black;
          margin: 3px 0;
          float: left;
          width: 100%;
          text-align: center;
        }
      }
    }
  }

  // markdown 主题配置-----------------------------部分
  ::v-deep(.essay) {
    counter-reset: h1;
  }

  ::v-deep(h1) {
    counter-reset: h2;
  }

  ::v-deep(h2) {
    counter-reset: h3;
  }

  ::v-deep(h3) {
    counter-reset: h4;
  }

  ::v-deep(h4) {
    counter-reset: h5;
  }

  ::v-deep(h5) {
    counter-reset: h6;
  }
  ::v-deep(.essay) {
    h1:before {
      counter-increment: h1;
      content: counter(h1) ' ';
    }

    h2:before {
      counter-increment: h2;
      content: counter(h1) '.' counter(h2) ' ';
    }

    h3:before {
      counter-increment: h3;
      content: counter(h1) '.' counter(h2) '.' counter(h3) ' ';
    }

    h4:before {
      counter-increment: h4;
      content: counter(h1) '.' counter(h2) '.' counter(h3) '.' counter(h4) ' ';
    }

    h5:before {
      counter-increment: h5;
      content: counter(h1) '.' counter(h2) '.' counter(h3) '.' counter(h4) '.' counter(h5) ' ';
    }

    h6::before {
      counter-increment: h6;
      content: counter(h1) '.' counter(h2) '.' counter(h3) '.' counter(h4) '.' counter(h5) '.' counter(h6) ' ';
    }
  }
  // ------------------------------------------toc目录树------------------------------------------------------
  ::v-deep(#toc) {
    color: #c9d1d9;
    position: absolute;
    right: 50px;
    top: 0 !important;
    height: 500px;
    width: 250px;
    box-shadow: none;
    background-color: transparent;
    z-index: 2;
    .toc-link {
      color: #c9d1d9;
      &:hover {
        background-color: transparent;
      }
      // 一个小点点
      &:hover:before {
        background: #555555;
      }
    }
    .toc-link.active {
      color: #4ca1ec;
      background-color: none;
      // 一个小点点
      &:before {
        background: #4ca1ec;
      }
    }
    .toc-hightlight {
      border-left: 3px solid #4ca1ec;
      color: #4ca1ec;
      background-color: #011826;
    }
  }
  // 目录标题样式
  ::v-deep(.toc-brand) {
    font-size: 25px;
    // border: 1px solid white;
    padding: 20px 0;
  }
  // 控制组件高度用(包括滚动条)
  ::v-deep(.toc-navbar) {
    // padding: 5px;
    // box-shadow: 0 0 0.5rem #eee;
    background-color: transparent;
    max-height: 500px !important;
    overflow: scroll;
    overflow-y: auto;
    overflow-x: hidden;
  }
  // 解决诡异白色
  ::v-deep(.toc-navbar::-webkit-scrollbar-track-piece) {
    background-color: transparent;
  }
  // 解决定位bug
  ::v-deep(*[data-toc] h1) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h2) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h3) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h4) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h5) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h6) {
    margin-top: -50px;
    padding-top: 50px;
  }
}
#BlogDetail.light {
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
    flex-wrap: wrap; // 自动换行模式
    align-content: flex-start; // 子类就会开启最小限度行距距模式
    position: relative;
  }
  .content {
    z-index: 2;
    margin-top: -35px;
    border-radius: 12px;
    width: 60%;
    min-height: 80vh; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    box-shadow: 0px -2px 5px #333333;
    background-color: white;
    position: relative;
    .describes {
      color: black;
      font-size: 13px;
      margin: 5% 7% 3% 7%;
      padding: 8px 16px;
      background-color: #e1e7f0;
      border-radius: 4px;
      border-left: 5px solid #768fba;
      min-height: 30px;
      line-height: 20px;
      // 让文本居中
      display: flex;
      align-items: center;
    }
    .essay {
      margin: 0 7% 10% 7%;
      padding: 20px 0;
      // font-size: 15px;
      line-height: 30px;
      // color: black;
      overflow: hidden;
    }
  }
  .comment-model {
    z-index: 2;
    width: 60%;
    min-height: 20vh; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    box-shadow: 0px -2px 5px #333333;
    background-color: white;
    border-radius: 12px;
    position: relative;
    .comment {
      margin: 0 7% 0 7%;
      padding-top: 3%;
      float: left;
      width: 86%;
    }
  }
  /* 封面图 */
  .cover {
    user-select: none;
    width: 100%;
    height: 65vh;
    // position: absolute;
    float: left;
    // background-color: rgb(65, 104, 120);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    > img {
      opacity: 1;
      width: 100%;
    }
    .info {
      // 绝对定位使得文字能够跑到图片上面来
      position: absolute;
      color: black;
      font-weight: 800;
      // border: 1px solid white;
      .title {
        float: left;
        width: 100%;
        height: 50px;
        font-size: 2vw;
        //   background-color: wheat;
        margin-bottom: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .small-info {
        float: left;
        width: 100%;
        //   background-color: violet;
        > span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.1vw;
          // border: 1px solid black;
          margin: 3px 0;
          float: left;
          width: 100%;
          text-align: center;
        }
      }
    }
  }

  // markdown 主题配置-----------------------------部分
  ::v-deep(.essay) {
    counter-reset: h1;
  }

  ::v-deep(h1) {
    counter-reset: h2;
  }

  ::v-deep(h2) {
    counter-reset: h3;
  }

  ::v-deep(h3) {
    counter-reset: h4;
  }

  ::v-deep(h4) {
    counter-reset: h5;
  }

  ::v-deep(h5) {
    counter-reset: h6;
  }
  ::v-deep(.essay) {
    h1:before {
      counter-increment: h1;
      content: counter(h1) ' ';
    }

    h2:before {
      counter-increment: h2;
      content: counter(h1) '.' counter(h2) ' ';
    }

    h3:before {
      counter-increment: h3;
      content: counter(h1) '.' counter(h2) '.' counter(h3) ' ';
    }

    h4:before {
      counter-increment: h4;
      content: counter(h1) '.' counter(h2) '.' counter(h3) '.' counter(h4) ' ';
    }

    h5:before {
      counter-increment: h5;
      content: counter(h1) '.' counter(h2) '.' counter(h3) '.' counter(h4) '.' counter(h5) ' ';
    }

    h6::before {
      counter-increment: h6;
      content: counter(h1) '.' counter(h2) '.' counter(h3) '.' counter(h4) '.' counter(h5) '.' counter(h6) ' ';
    }
  }
  // ------------------------------------------toc目录树------------------------------------------------------
  ::v-deep(#toc) {
    color: black;
    position: absolute;
    right: 50px;
    top: 0 !important;
    height: 500px;
    width: 250px;
    box-shadow: none;
    background-color: transparent;
    z-index: 2;
    .toc-link {
      color: black;
      &:hover {
        background-color: transparent;
      }
      // 一个小点点
      &:hover:before {
        background-color: #555555;
      }
    }
    .toc-link.active {
      color: #768fba;
      background-color: none;
      // 一个小点点
      &:before {
        background-color: #768fba;
      }
    }
    .toc-hightlight {
      border-left: 3px solid #768fba;
      background-color: #e1e7f0;
    }
  }
  // 目录标题样式
  ::v-deep(.toc-brand) {
    font-size: 25px;
    // border: 1px solid white;
    padding: 20px 0;
  }
  // 控制组件高度用(包括滚动条)
  ::v-deep(.toc-navbar) {
    // padding: 5px;
    // box-shadow: 0 0 0.5rem #eee;
    background-color: transparent;
    max-height: 500px !important;
    overflow: scroll;
    overflow-y: auto;
    overflow-x: hidden;
  }
  // 解决诡异白色
  ::v-deep(.toc-navbar::-webkit-scrollbar-track-piece) {
    background-color: transparent;
  }
  // 解决定位bug
  ::v-deep(*[data-toc] h1) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h2) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h3) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h4) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h5) {
    margin-top: -50px;
    padding-top: 50px;
  }
  ::v-deep(*[data-toc] h6) {
    margin-top: -50px;
    padding-top: 50px;
  }
}
</style>
