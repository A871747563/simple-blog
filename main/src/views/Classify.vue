<template>
  <div id="Classify" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <div>
          <el-empty v-if="ClassifyData === ''" description="无数据" :image-size="250" />
          <!-- 下拉菜单 -->
          <el-menu :unique-opened="true" class="el-menu-vertical-demo">
            <el-submenu v-for="(item, index) in ClassifyData" :key="index" :index="index + ''">
              <template #title>
                <span>
                  <i class="el-icon-edit"></i>
                  {{ item.type }}
                </span>
                <!-- 统计数量 -->
                <span class="count">
                  <i class="el-icon-tickets">{{ item.typeCount }}</i>
                </span>
              </template>
              <el-menu-item
                v-for="(itemNext, indexNext) in item.data"
                :key="indexNext"
                :index="index + '-' + indexNext"
                @click="blogDetail(itemNext.blog_id)"
              >
                {{ itemNext.blog_title }}
              </el-menu-item>
              <el-menu-item :index="index + 'more'" @click="moreBlog">more...</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 打印机组件
import Printer from 'components/Printer'
import { computed, onMounted, onUnmounted, reactive, ref, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { ClassifyAxios } from 'utils/request/requestInfo.js'
import { notify } from 'utils/element-util'
export default {
  components: {
    Printer
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const router = useRouter()
    const ClassifyData = ref('')
    // 数据请求函数------------------------------------------------------------------
    const getClassifyData = () => {
      ClassifyAxios()
        .then(
          (res) => {
            ClassifyData.value = res.data.data
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
    // 跳转到对应的博客页面
    const blogDetail = (blogId) => {
      router.push({
        name: 'BlogDetail',
        params: {
          blogId: blogId
        }
      })
    }
    // 跳转更多博客页面(归档页)
    const moreBlog = () => {
      router.push({
        name: 'Archives'
      })
    }
    onMounted(() => {
      getClassifyData()
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
      data: '分类页',
      ClassifyData,
      blogDetail,
      moreBlog,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
// 对element样式的重造
#Classify.dark {
  // 整一块
  &::v-deep(.el-menu) {
    border: none;
    background-color: transparent;
  }
  // 标题
  // 有些颜色配置在标签了
  &::v-deep(.el-submenu__title) {
    border-radius: 10px !important;
    margin: 10px 0;
    // border: 1px solid white;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    color: #c9d1d9;
    .el-icon-tickets,
    .el-submenu__icon-arrow {
      color: #c9d1d9;
    }
    &:hover {
      color: #4ca1ec;
      background-color: #012840;
      // 辣鸡图标单独设置
      .el-icon-tickets,
      .el-submenu__icon-arrow {
        color: #4ca1ec;
      }
    }
    // 数量统计
    .count {
      position: absolute;
      right: 60px;
      // 小小图标样式重置
      .el-icon-tickets {
        // 文字大小
        font-size: 10px;
        &::before {
          // 图标大小
          font-size: 15px;
        }
      }
    }
    // 后边那个小箭头(高度调整)
    .el-submenu__icon-arrow {
      top: 58% !important;
    }
  }
  // 下拉项
  &::v-deep(.el-menu-item) {
    margin-left: 40px;
    font-size: 15px;
    font-weight: 700;
    color: #c9d1d9;
    &:hover {
      color: #4ca1ec !important;
      background-color: #012840 !important;
    }
  }
  // 主设置
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
    min-height: 650px;
    margin-bottom: 150px;
    background-color: #011826;
    position: relative;
    // border: 1px solid white;
    > div {
      // border: 1px solid white;
      margin: 8% 10%;
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
#Classify.light {
  // 整一块
  &::v-deep(.el-menu) {
    border: none;
    background-color: transparent;
  }
  // 标题
  // 有些颜色配置在标签了
  &::v-deep(.el-submenu__title) {
    margin: 10px 0;
    // border: 1px solid white;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    color: black;
    .el-icon-tickets,
    .el-submenu__icon-arrow {
      color: black;
    }
    &:hover {
      color: black;
      background-color: #b2c7e9;
      // 辣鸡图标单独设置
      .el-icon-tickets,
      .el-submenu__icon-arrow {
        color: black;
      }
    }
    // 数量统计
    .count {
      position: absolute;
      right: 60px;
      // 小小图标样式重置
      .el-icon-tickets {
        // 文字大小
        font-size: 10px;
        &::before {
          // 图标大小
          font-size: 15px;
        }
      }
    }
    // 后边那个小箭头(高度调整)
    .el-submenu__icon-arrow {
      top: 58% !important;
    }
  }
  // 下拉项
  &::v-deep(.el-menu-item) {
    margin-left: 40px;
    font-size: 15px;
    font-weight: 700;
    color: black;
    &:hover {
      color: black !important;
      background-color: #b2c7e9 !important;
    }
  }
  // 主设置
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
    min-height: 650px;
    margin-bottom: 150px;
    background-color: white;
    box-shadow: 0px -2px 5px #333333;
    position: relative;
    // border: 1px solid white;
    > div {
      // border: 1px solid white;
      margin: 8% 10%;
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
