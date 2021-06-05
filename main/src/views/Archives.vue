<template>
  <div id="Archives" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <div v-if="ArchData !== ''" class="count">本系统共计： {{ allCount }} 篇文章</div>
        <el-empty v-if="ArchData === ''" description="无数据" :image-size="250" />
        <div class="items" @click="blogDetail($event)">
          <div v-for="(item, index) in ArchData" :key="index" :data-blogid="item.blog_id">
            <span :data-blogid="item.blog_id">{{ item.blog_title }}</span>
            <span :data-blogid="item.blog_id">{{ item.create_time }}</span>
          </div>
        </div>
        <!-- 分页器 -->
        <div v-if="ArchData !== ''" class="pageModel">
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
import { computed, onMounted, onUnmounted, reactive, ref, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from 'utils/element-util'
import { homeAxios } from 'utils/request/requestInfo.js'
import { UTCtobeijing } from 'utils/UTCtobeijing.js'
import { startEvent, endEvent } from 'utils/ScrollEvent'
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
    const router = useRouter()
    // 首屏数据存储
    const ArchData = ref('')
    // 分页器相关
    const currentPage = ref(1)
    const allCount = ref(1000)
    const pageSize = ref(10)
    const axioInfo = reactive({
      offset: computed(() => {
        return (currentPage.value - 1) * pageSize.value
      }),
      limit: pageSize.value
    })
    // 页码改变，再次渲染
    const handleCurrentChange = (changePage) => {
      currentPage.value = changePage
      getData()
      window.scrollTo(0, 380)
    }
    // 点击跳转到博客详细页面，携带博客id！！！
    const blogDetail = (e) => {
      const index = e.target.getAttribute('data-blogid')
      router.push({
        name: 'BlogDetail',
        params: {
          blogId: index
        }
      })
    }
    // 发送post请求获取数据
    const getData = () => {
      homeAxios(axioInfo)
        .then(
          (res) => {
            // 页面数据初始化
            ArchData.value = res.data.data.data
            allCount.value = res.data.data.allCount
            // 将带T和Z的UTC时间转换为标准格式
            for (const item in ArchData.value) {
              ArchData.value[item].create_time = UTCtobeijing(ArchData.value[item].create_time)
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
      data: '归档页',
      handleCurrentChange,
      currentPage,
      ArchData,
      blogDetail,
      allCount,
      pageSize,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#Archives.dark {
  &::v-deep(.el-button) {
    width: 6vw;
    // background-color: black;
    border: none;
  }
  .pageModel {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5%;
  }
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    border-radius: 12px;
    width: 65%;
    min-height: 650px; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    padding-bottom: 50px;
    background-color: #011826;
    position: relative;
    .count {
      // border: 1px solid white;
      margin: 8% 10% 0 10%;
      color: #c9d1d9;
      font-size: 1.5vw;
    }
    .items {
      // border: 1px solid white;
      margin: 3% 10%;
      // min-height: 500px;
      > div {
        cursor: pointer;
        padding: 0 2vw;
        height: 6vh;
        display: flex;
        align-items: center;
        font-size: 1vw;
        color: #c9d1d9;
        // border: 1px solid white;
        position: relative;
        > span:last-child {
          position: absolute;
          right: 2vw;
        }
        &:hover {
          background-color: #012840;
          color: #4ca1ec;
        }
      }
    }
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
      background-image: url('../assets/image/dark2.jpg');
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
}
#Archives.light {
  &::v-deep(.el-button) {
    width: 6vw;
    // background-color: black;
    border: none;
  }
  .pageModel {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5%;
  }
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    border-radius: 12px;
    width: 65%;
    min-height: 650px; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    padding-bottom: 50px;
    background-color: white;
    box-shadow: 0px -2px 5px #333333;
    position: relative;
    .count {
      // border: 1px solid white;
      margin: 8% 10% 0 10%;
      color: black;
      font-size: 1.5vw;
    }
    .items {
      // border: 1px solid white;
      margin: 3% 10%;
      // min-height: 500px;
      > div {
        cursor: pointer;
        padding: 0 2vw;
        height: 6vh;
        display: flex;
        align-items: center;
        font-size: 1vw;
        color: black;
        // border: 1px solid white;
        position: relative;
        > span:last-child {
          position: absolute;
          right: 2vw;
        }
        &:hover {
          background-color: #b2c7e9;
        }
      }
    }
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
      background-image: url('../assets/image/light2.jpg');
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
}
</style>
