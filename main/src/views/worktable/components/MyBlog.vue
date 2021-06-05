<template>
  <div id="MyBlog" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <el-empty v-if="!ublogdata.length" description="无数据" :image-size="250" />
        <div v-for="(item, index) in ublogdata" :key="index" class="content_3D">
          <div class="front">
            <img src="../../../assets/image/myblog.jpg" />
            <div class="modal">
              <span class="title">{{ item.blog_title }}</span>
              <span class="time">{{ item.create_time }}</span>
            </div>
          </div>
          <div class="back">
            <img v-lazy="item.cover_image" />
            <div class="modal">
              <div class="button">
                <el-button type="success" @click="blogDetail(item.blog_id)">查看</el-button>
                <el-button type="primary" @click="blogEdit(item.blog_id)">编辑</el-button>
                <el-button type="danger" @click="blogDelete(item.blog_id)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <div v-if="ublogdata.length" class="pageModel">
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
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { computed, onMounted, onUnmounted, reactive, ref, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from 'utils/element-util'
import { gettingCK } from 'utils/cookie-util'
import { UblogAxios, DeleteAxios } from 'utils/request/requestInfo.js'
import { UTCtobeijing } from 'utils/UTCtobeijing.js'
import { ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
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
    // 数据区----------------------------------------------------------------------------
    const router = useRouter()
    // 首屏数据存储
    const ublogdata = ref([])
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
    // 方法区-------------------------------------------------------------------------
    // 页码改变触发
    const handleCurrentChange = (changePage) => {
      currentPage.value = changePage
      getData()
      window.scrollTo(0, 380)
    }
    // 查看博客
    const blogDetail = (blogId) => {
      router.push({
        name: 'BlogDetail',
        params: {
          blogId: blogId
        }
      })
    }
    // 编辑博客
    const blogEdit = (blogId) => {
      // console.log(blogId)
      router.push({
        name: 'EditBlog',
        params: {
          blogId: blogId
        }
      })
    }
    // 删除博客
    const blogDelete = (blogId) => {
      ElMessageBox.confirm('确定要将数据永久删除?', '提示', {
        type: 'warning',
        customClass: theme.value
      })
        .then(() => {
          deleData(blogId)
        })
        .catch(() => {
          console.log('取消了')
        })
    }
    // 发送请求获取用户博客数据
    const getData = () => {
      UblogAxios({
        uid: gettingCK('userid'),
        ...axioInfo
      })
        .then(
          (res) => {
            // 页面数据初始化
            ublogdata.value = res.data.data.data
            allCount.value = res.data.data.allCount
            // 将带T和Z的UTC时间转换为标准格式
            for (const item in ublogdata.value) {
              ublogdata.value[item].create_time = UTCtobeijing(ublogdata.value[item].create_time)
            }
            notify('初始化博客数据成功', 'success')
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
    // 发送请求删除数据
    const deleData = (blogId) => {
      DeleteAxios({
        bid: blogId
      })
        .then(
          (res) => {
            if (res.data.erron !== 0) {
              notify('删除失败', 'error')
            } else {
              notify('删除成功', 'success')
              getData()
            }
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
      getData()
      startEvent(35, 45)
    })

    // 一般策略
    onUnmounted(() => {
      endEvent()
    })
    // 缓存策略
    onActivated(() => {
      startEvent(35, 45)
    })
    onDeactivated(() => {
      endEvent()
    })
    return {
      data: '我的博客',
      handleCurrentChange,
      allCount,
      currentPage,
      ublogdata,
      blogDetail,
      blogEdit,
      blogDelete,
      pageSize,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#MyBlog.dark {
  .content_3D {
    width: 280px;
    height: 153px;
    margin-top: 60px;
    border-radius: 5px;
    transform-style: preserve-3d;
    animation: rotate-reverse 1.2s cubic-bezier(0.66, -0.47, 0.33, 1.5) forwards;
  }
  .content_3D:hover {
    animation: rotate 1.2s cubic-bezier(0.66, -0.47, 0.33, 1.5) forwards;
  }
  .front,
  .back {
    box-shadow: 0px -2px 5px #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 20px;
    border-radius: 15px;
    background-color: #0f1216;
    color: white;
    > img {
      width: 110%;
    }
    .modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      .title {
        // 多行文字隐藏
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        padding: 0 20px;
        color: white;
        font-size: 20px;
        font-weight: 1000;
      }
      .time {
        color: white;
        font-size: 15px;
        font-weight: 1000;
      }
      .button {
        transform: scale(0.8);
        .el-button {
          background-color: transparent;
          &:hover {
            color: #4ca1ec;
          }
        }
      }
    }
  }
  .back {
    transform: rotateX(180deg);
  }
  // 主设置区
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    padding-bottom: 30px;
    margin-top: -35px;
    border-radius: 12px;
    width: 65%;
    min-height: 650px; // 子盒子撑开父元素高度
    padding-bottom: 150px;
    margin-bottom: 150px;
    background-color: #011826;
    position: relative;
    display: flex;
    flex-wrap: wrap; // 自动换行模式
    justify-content: space-around; // 左右开启间距
    align-content: flex-start; // 子类就会开启最小限度行距距模式
  }
  //* 封面图 */
  .cover {
    width: 100%;
    height: 65vh;
    float: left;
    // position: absolute;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    &::after {
      background-image: url('../../../assets/image/dark2.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center;
      content: '';
      // opacity: 0.9;
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
  }
  .pageModel {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 50px;
  }
}
#MyBlog.light {
  .content_3D {
    width: 280px;
    height: 153px;
    margin-top: 60px;
    border-radius: 5px;
    transform-style: preserve-3d;
    animation: rotate-reverse 1.2s cubic-bezier(0.66, -0.47, 0.33, 1.5) forwards;
  }
  .content_3D:hover {
    animation: rotate 1.2s cubic-bezier(0.66, -0.47, 0.33, 1.5) forwards;
  }
  .front,
  .back {
    box-shadow: 0px -2px 5px #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 20px;
    border-radius: 15px;
    background-color: #0f1216;
    color: white;
    > img {
      width: 110%;
    }
    .modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      .title {
        // 多行文字隐藏
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        padding: 0 20px;
        color: white;
        font-size: 20px;
        font-weight: 1000;
      }
      .time {
        color: white;
        font-size: 15px;
        font-weight: 1000;
      }
      .button {
        transform: scale(0.8);
        .el-button {
          background-color: transparent;
          &:hover {
            color: #4ca1ec;
          }
        }
      }
    }
  }
  .back {
    transform: rotateX(180deg);
  }
  // 主设置区
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    padding-bottom: 30px;
    margin-top: -35px;
    border-radius: 12px;
    width: 65%;
    min-height: 650px; // 子盒子撑开父元素高度
    padding-bottom: 150px;
    margin-bottom: 150px;
    box-shadow: 0px -2px 5px #333333;
    background-color: white;
    position: relative;
    display: flex;
    flex-wrap: wrap; // 自动换行模式
    justify-content: space-around; // 左右开启间距
    align-content: flex-start; // 子类就会开启最小限度行距距模式
  }
  //* 封面图 */
  .cover {
    width: 100%;
    height: 65vh;
    float: left;
    // position: absolute;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    &::after {
      background-image: url('../../../assets/image/light2.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center;
      content: '';
      // opacity: 0.9;
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
  }
  .pageModel {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 50px;
  }
}
/* 下面我们定义一下翻转动画 */
@keyframes rotate {
  0% {
    transform: rotateX(0);
  }
  100% {
    transform: rotateX(180deg);
  }
}

@keyframes rotate-reverse {
  0% {
    transform: rotateX(180deg);
  }
  100% {
    transform: rotateX(0);
  }
}
</style>
