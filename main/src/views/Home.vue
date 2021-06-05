<template>
  <div id="Home" :class="theme">
    <div class="cover">
      <i class="el-icon-caret-bottom arrowhead"></i>
      <div><Printer :text="aword" /></div>
    </div>
    <div class="main">
      <div class="content" @click="blogDetail($event)">
        <el-empty v-if="homedata === ''" description="无数据" :image-size="250" />
        <div v-for="(item, index) in homedata" :key="index" class="content_item">
          <div class="item_cover" :data-blogid="item.blog_id">
            <div class="triangle" :data-blogid="item.blog_id"></div>
            <div class="info" :data-blogid="item.blog_id">
              <span :data-blogid="item.blog_id">
                {{ item.blog_info }}
              </span>
            </div>
            <img v-lazy="item.cover_image" :data-blogid="item.blog_id" />
          </div>
          <div class="item_content" :data-blogid="item.blog_id">
            <div class="title" :data-blogid="item.blog_id">
              <span :data-blogid="item.blog_id">{{ item.blog_title }}</span>
            </div>
            <div class="time-name" :data-blogid="item.blog_id">
              <span class="time" :data-blogid="item.blog_id">
                <svg-icon icon-name="time_fill" class-name="item-icon" :class="theme" :data-blogid="item.blog_id" />
                {{ item.create_time }}
              </span>
              <span class="name" :data-blogid="item.blog_id">
                <svg-icon icon-name="businesscard_fill" class-name="item-icon" :class="theme" :data-blogid="item.blog_id" />
                {{ item.username }}
              </span>
            </div>
            <div class="tags" :data-blogid="item.blog_id">
              <span :data-blogid="item.blog_id">
                <span v-for="(itemNext, indexNext) in item.blog_tag" :key="indexNext" :data-blogid="item.blog_id">
                  <el-tag v-if="indexNext % 2 == 0" type="success" :data-blogid="item.blog_id">{{ itemNext }}</el-tag>
                  <el-tag v-else type="warning" :data-blogid="item.blog_id">{{ itemNext }}</el-tag>
                </span>
              </span>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <div v-if="homedata !== ''" class="pageModel">
          <Pagination :current-page="currentPage" :all-count="allCount" :page-size="pageSize" @handleCurrentChange="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 打印机组件
import Printer from 'components/Printer'
import Pagination from 'components/Pagination'
import { startEvent, endEvent } from 'utils/ScrollEvent' // 滚动样式变化事件
import { computed, onMounted, onUnmounted, reactive, ref, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { notify, message } from 'utils/element-util'
import { useStore } from 'vuex'
import { homeAxios } from 'utils/request/requestInfo.js'
import { AwordAxios } from 'utils/request/requestAword.js'
import { UTCtobeijingMini } from 'utils/UTCtobeijing.js'
export default {
  components: {
    Printer,
    Pagination
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const router = useRouter()
    // 一言数据
    const aword = ref('Hello World!')
    // 首屏数据存储
    const homedata = ref('')
    // 分页器相关
    const currentPage = ref(1)
    const allCount = ref(1000)
    const pageSize = ref(9)
    const axioInfo = reactive({
      offset: computed(() => {
        return (currentPage.value - 1) * pageSize.value
      }),
      limit: pageSize.value
    })

    // 点击跳转到博客详细页面，携带博客id！！！(改为事件代理)
    const blogDetail = (e) => {
      const index = e.target.getAttribute('data-blogid')
      if (index) {
        router.push({
          name: 'BlogDetail',
          params: {
            blogId: index
          }
        })
      }
    }
    // 页码改变，再次渲染
    const handleCurrentChange = (changePage) => {
      currentPage.value = changePage
      getData()
      window.scrollTo(0, 600)
    }
    // 发送post请求获取首屏数据
    const getData = () => {
      homeAxios(axioInfo)
        .then(
          (res) => {
            // 页面数据初始化
            homedata.value = res.data.data.data
            allCount.value = res.data.data.allCount
            // 将标签字符串转换成数组
            // 将带T和Z的UTC时间转换为标准格式
            for (const item in homedata.value) {
              homedata.value[item].blog_tag = homedata.value[item].blog_tag.split('，')
              homedata.value[item].create_time = UTCtobeijingMini(homedata.value[item].create_time)
            }
            notify('首屏初始化', 'success')
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
    // 挂载dom完毕
    onMounted(() => {
      // 请求一言
      AwordAxios()
        .then(
          (res) => {
            // 一言初始化
            aword.value = `${res.data.hitokoto}——《${res.data.from}》`
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
      startEvent(0, 150)
      getData()
    })
    // 一般策略
    onUnmounted(() => {
      endEvent()
    })
    // 缓存策略
    onActivated(() => {
      startEvent(0, 150)
    })
    onDeactivated(() => {
      endEvent()
    })
    return {
      aword,
      // data: 'System.out.print("Hello World!");',
      handleCurrentChange,
      currentPage,
      homedata,
      blogDetail,
      allCount,
      pageSize,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
// 文章简略内容模块样式s
#Home.dark {
  .content_item {
    width: 280px;
    height: 300px;
    overflow: hidden;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 25px;
    box-shadow: 0px -2px 5px #333333;
    // border: 1px solid white;
    .item_cover {
      width: 100%;
      height: 191px;
      // background-color: wheat;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;

      > img {
        height: 220px;
      }
      .triangle {
        position: absolute;
        top: -250px;
        left: 0;
        border-left: 175px solid transparent;
        border-right: 175px solid #358362;
        border-top: 175px solid #358362;
        border-bottom: 175px solid transparent;
      }
      .info {
        position: absolute;
        left: 0;
        bottom: -100%;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        transition: 0.5s all ease 0s; // 过渡动画
        > span {
          // 多行文字隐藏
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
          padding: 20px 20px 0 20px;
          font-size: 15px;
          color: #8b8c8c;
          line-height: 1.5;
          text-indent: 2em;
          font-weight: 1000;
        }
      }
      &:hover {
        .info {
          bottom: 0;
          transition: 0.5s all ease 0s; // 过渡动画
        }
      }
    }
    .item_content {
      width: 100%;
      height: calc(100% - 191px);
      background-color: #0f1216;
      .title {
        width: 100%;
        height: 40%;
        // border: 1px solid white;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          // 多行文字隐藏
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          padding: 0 15px;
          color: white;
          font-size: 18px;
          font-weight: 1000;
        }
      }
      .time-name {
        width: 100%;
        height: 30%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
          display: flex;
          justify-content: center;
          align-items: center;
          // border: 1px solid white;
          padding: 0 10px;
          font-weight: 1000;
          font-size: 12px;
        }
        .time {
          color: white;
        }
        .name {
          color: #358362;
        }
      }
      .tags {
        width: 100%;
        height: 30%;
        transform: scale(0.6);
        > span {
          color: white;
          float: right;
          margin-right: -65px;
          // 多行文字隐藏
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          .el-tag {
            font-size: 15px;
            margin: 0 5px;
          }
        }
      }
    }
  }
  // 分页器布局设置
  .pageModel {
    position: absolute;
    bottom: 50px;
    // border: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // ---------------------------------------------------------------------
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    transition: 0.1s all ease 0s; // 过渡动画
    border-radius: 12px;
    width: 60%;
    min-height: 700px; // 子盒子撑开父元素高度
    padding: 50px 50px 150px 50px;
    margin-bottom: 150px;
    position: relative;
    // border: 1px solid white;
    background-color: #011826;
    display: flex;
    flex-wrap: wrap; // 自动换行模式
    justify-content: space-around; // 左右开启间距
    align-content: flex-start; // 子类就会开启最小限度行距距模式
  }
  /* 封面图 */
  .cover {
    width: 100%;
    height: 100vh;
    float: left;
    // position: absolute;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    &::after {
      background-image: url('../assets/image/dark1.png');
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center;
      content: '';
      // // opacity: 0.9;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
    }
    // 打印文字配置
    div {
      z-index: 2;
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      // color: white;
      font-size: 2vw;
      // border: 1px solid white;
    }
    .arrowhead {
      z-index: 2;
      position: absolute;
      bottom: 50px;
      font-size: 40px;
      color: white;
      animation: arrowAnime 1s infinite;
    }
  }
}
#Home.light {
  .content_item {
    width: 280px;
    height: 300px;
    overflow: hidden;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 25px;
    // border: 1px solid white;
    .item_cover {
      width: 100%;
      height: 191px;
      // background-color: wheat;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;

      > img {
        height: 220px;
      }
      .triangle {
        position: absolute;
        top: -250px;
        left: 0;
        border-left: 175px solid transparent;
        border-right: 175px solid #768fba;
        border-top: 175px solid #768fba;
        border-bottom: 175px solid transparent;
      }
      .info {
        position: absolute;
        left: 0;
        bottom: -100%;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        transition: 0.5s all ease 0s; // 过渡动画
        > span {
          // 多行文字隐藏
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
          padding: 20px 20px 0 20px;
          font-size: 15px;
          color: #8b8c8c;
          line-height: 1.5;
          text-indent: 2em;
          font-weight: 1000;
        }
      }
      &:hover {
        .info {
          bottom: 0;
          transition: 0.5s all ease 0s; // 过渡动画
        }
      }
    }
    .item_content {
      width: 100%;
      height: calc(100% - 191px);
      background-color: #e1e7f0;

      .title {
        width: 100%;
        height: 40%;
        // border: 1px solid white;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          // 多行文字隐藏
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          padding: 0 15px;
          color: black;
          font-size: 18px;
          font-weight: 1000;
        }
      }
      .time-name {
        width: 100%;
        height: 30%;
        // border: 1px solid white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
          display: flex;
          justify-content: center;
          align-items: center;
          // border: 1px solid white;
          padding: 0 10px;
          font-weight: 1000;
          font-size: 12px;
        }
      }
      .tags {
        width: 100%;
        height: 30%;
        transform: scale(0.6);
        > span {
          color: black;
          float: right;
          margin-right: -65px;
          // 多行文字隐藏
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          .el-tag {
            font-size: 15px;
            margin: 0 5px;
          }
        }
      }
    }
  }
  // 分页器布局设置
  .pageModel {
    position: absolute;
    bottom: 50px;
    // border: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // ---------------------------------------------------------------------
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    transition: 0.1s all ease 0s; // 过渡动画
    border-radius: 12px;
    width: 60%;
    min-height: 700px; // 子盒子撑开父元素高度
    padding: 50px 50px 150px 50px;
    margin-bottom: 150px;
    position: relative;
    // border: 1px solid white;
    box-shadow: 0px -2px 5px #333333;
    background-color: white;
    display: flex;
    flex-wrap: wrap; // 自动换行模式
    justify-content: space-around; // 左右开启间距
    align-content: flex-start; // 子类就会开启最小限度行距距模式
  }
  /* 封面图 */
  .cover {
    width: 100%;
    height: 100vh;
    float: left;
    // position: absolute;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    &::after {
      background-image: url('../assets/image/light1.png');
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center;
      content: '';
      // // opacity: 0.9;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
    }
    // 打印文字配置
    div {
      z-index: 2;
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      // color: white;
      font-size: 2vw;
      // border: 1px solid white;
    }
    .arrowhead {
      z-index: 2;
      position: absolute;
      bottom: 50px;
      font-size: 40px;
      color: black;
      animation: arrowAnime 1s infinite;
    }
  }
}
@keyframes arrowAnime {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-15%);
  }
  20% {
    transform: translateY(-30%);
  }
  30% {
    transform: translateY(-45%);
  }
  40% {
    transform: translateY(-60%);
  }
  50% {
    transform: translateY(-60%);
  }
  60% {
    transform: translateY(-45%);
  }
  70% {
    transform: translateY(-30%);
  }
  80% {
    transform: translateY(-15%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
