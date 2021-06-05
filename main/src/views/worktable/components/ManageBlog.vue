<template>
  <div id="ManageBlog" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <!-- 表格主体 -->
        <div>
          <div class="Title1">
            <span>博客文章类型管理：</span>
          </div>
          <div class="dynamicTags">
            <!-- 标签列表渲染区 -->
            <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <!-- 动态展示输入框 -->
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter="handleInputConfirm"
            />
            <!-- 展示输入框按钮区 -->
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Type</el-button>
          </div>
          <div class="Title2">
            <span>博客文章数据管理：</span>
          </div>
          <el-table
            v-loading="managedata.length === 0"
            :data="managedata"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column label="主题">
              <template #default="scope">
                <span>{{ scope.row.blog_title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template #default="scope">
                <span>{{ scope.row.type_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="作者">
              <template #default="scope">
                <span>{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template #default="scope">
                <span>{{ scope.row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间">
              <template #default="scope">
                <span>{{ scope.row.update_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="mini" type="info" @click="blogEdit(scope.row.blog_id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="blogDelete(scope.row.blog_id)">删除</el-button>
                <el-button size="mini" type="success" @click="blogDetail(scope.row.blog_id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页器 -->
        <div v-if="managedata.length !== 0" class="pageModel">
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
import { computed, onMounted, onUnmounted, reactive, ref, nextTick, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from 'utils/element-util'
import { ElMessageBox } from 'element-plus'
import { homeAxios, DeleteAxios, blogTypesAxios, NewblogTypeAxios } from 'utils/request/requestInfo.js'
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
    // 必须是个数组
    const managedata = ref([])
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
    // 定义方法区------------------------------------------------------------------
    // 页码改变，再次渲染
    const handleCurrentChange = (changePage) => {
      currentPage.value = changePage
      getData()
    }
    // 编辑博客
    const blogEdit = (blogId) => {
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
          getData()
        })
        .catch(() => {
          console.log('取消了')
        })
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
    // 动态tag方法区-------------------------------------------------------------------------------------
    const saveTagInput = ref(null)
    const dynamicTags = ref(['无', '数', '据'])
    const inputVisible = ref(false)
    const inputValue = ref('')
    // 标签删除事件
    const handleClose = (tag) => {
      notify('功能待实现', 'warning')
      // dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    }
    // 点击按钮焦点进入和样式变化
    // 点击展示input输入框
    const showInput = () => {
      inputVisible.value = true
      nextTick((_) => {
        saveTagInput.value.input.focus()
      })
    }
    // 提交输入的标签名前的验证
    const handleInputConfirm = () => {
      if (inputValue.value) {
        return ElMessageBox.confirm(`确定增加？`)
          .then(() => {
            NewblogTypeAxios({
              typeName: inputValue.value
            })
              .then(
                (res) => {
                  if (res.data.data.affectedRows === 1) {
                    dynamicTags.value.push(inputValue.value)
                    inputValue.value = ''
                    inputVisible.value = false
                    notify('添加博客种类成功', 'success')
                  } else {
                    inputValue.value = ''
                    inputVisible.value = false
                    notify('添加博客种类失败', 'error')
                  }
                },
                (err) => {
                  inputValue.value = ''
                  inputVisible.value = false
                  notify('前端代码错误', 'error')
                  console.log(err)
                }
              )
              .catch((err) => {
                inputValue.value = ''
                inputVisible.value = false
                notify('前端代码出错', 'error')
                console.log(err)
              })
          })
          .catch(() => {
            inputValue.value = ''
            inputVisible.value = false
          })
      }
    }

    // 请求定义区--------------------------------------------------------------------------------------
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
    // 发送post请求获取数据
    const getData = () => {
      homeAxios(axioInfo)
        .then(
          (res) => {
            // 页面数据初始化
            const temp = res.data.data.data
            allCount.value = res.data.data.allCount
            managedata.value = []
            // 将标签字符串转换成数组
            // 将带T和Z的UTC时间转换为标准格式
            for (const item in temp) {
              temp[item].blog_tag = temp[item].blog_tag.split('，')
              temp[item].create_time = UTCtobeijing(temp[item].create_time)
              // 更新时间不能为空
              temp[item].update_time = UTCtobeijing(temp[item].update_time)
              managedata.value.push(temp[item])
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
    // 获取博客类型种类(请求)
    const getblogTypes = () => {
      blogTypesAxios({})
        .then(
          (res) => {
            // 两个临时变量
            const tempData = res.data.data
            const tempArray = []
            // 格式化
            for (const i in tempData) {
              tempArray.push(res.data.data[i]['type_name'])
            }
            dynamicTags.value = tempArray
            notify('初始化博客数据成功', 'success')
          },
          (err) => {
            notify('前端代码错误', 'error')
            console.log(err)
          }
        )
        .catch((err) => {
          notify('前端代码出错', 'error')
          console.log(err)
        })
    }
    // 挂载dom完毕
    onMounted(() => {
      getblogTypes()
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
      data: '博客管理',
      handleCurrentChange,
      currentPage,
      managedata,
      blogDetail,
      allCount,
      blogDelete,
      blogEdit,
      saveTagInput,
      dynamicTags,
      inputVisible,
      handleClose,
      inputValue,
      showInput,
      handleInputConfirm,
      pageSize,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
// 样式小修改
#ManageBlog.dark {
  // 管理博客类型标题
  .Title1 {
    margin: 5% 5% 0 5%;
    padding-top: 1%;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: -60%;
      left: 35px;
      height: 10%;
      width: 95%;
      background-color: #090c10;
    }
    span {
      color: #c9d1d9;
      font-size: 22px;
      font-weight: 500;
    }
  }
  // 管理博客具体内容标题
  .Title2 {
    margin: 2% 5% 0 5%;
    padding-top: 1%;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: -60%;
      left: 35px;
      height: 10%;
      width: 95%;
      background-color: #090c10;
    }
    span {
      color: #c9d1d9;
      font-size: 22px;
      font-weight: 500;
    }
  }
  .dynamicTags {
    margin: 3% 5% 0 5%;
    padding-top: 1%;
  }
  // 表格样式设置
  &::v-deep(.el-table) {
    margin: 4% 5% 0 5%;
    width: 90% !important;
    background-color: #012840;
    table {
      border-collapse: collapse !important;
    }
    // 表头
    th {
      background-color: #012840;
      color: #4ca1ec;
      border: 1px solid #090c10;
      text-align: center;
    }
    // 表体
    td {
      color: white;
      border: 1px solid #090c10;
      text-align: center;
    }
    .el-table__row {
      background-color: transparent;
      border: 1px solid #090c10;
    }
    // 司马重置（太难找啦）
    .el-table__body tr:hover > td {
      // 表体的hover在这
      background-color: #090c10 !important;
    }
    &::before {
      background-color: transparent !important;
    }
  }
  .pageModel {
    float: right;
    margin: 3% 5%;
  }
  // 博客种类tag官方设置-------------------
  .el-button {
    background-color: transparent;
    &:hover {
      color: #4ca1ec;
    }
  }
  .el-tag {
    background-color: #090c10;
    border: 1px solid #090c10;
  }
  // 每个tag左边的tag的样式
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    background-color: #090c10;
    border: 1px solid #090c10;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    ::v-deep(.el-input__inner) {
      background-color: #090c10;
      border: 1px solid #090c10;
      color: white;
    }
  }
  // 主要样式配置
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    margin-top: -35px;
    border-radius: 12px;
    width: 85%;
    min-height: 650px; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    background-color: #011826;
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
}
#ManageBlog.light {
  // 管理博客类型标题
  .Title1 {
    margin: 5% 5% 0 5%;
    padding-top: 1%;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: -60%;
      left: 35px;
      height: 8%;
      width: 95%;
      background-color: black;
    }
    span {
      color: black;
      font-size: 22px;
      font-weight: 500;
    }
  }
  // 管理博客具体内容标题
  .Title2 {
    margin: 2% 5% 0 5%;
    padding-top: 1%;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: -60%;
      left: 35px;
      height: 8%;
      width: 95%;
      background-color: black;
    }
    span {
      color: black;
      font-size: 22px;
      font-weight: 500;
    }
  }
  .dynamicTags {
    margin: 3% 5% 0 5%;
    padding-top: 1%;
  }
  // 表格样式设置
  &::v-deep(.el-table) {
    margin: 4% 5% 0 5%;
    width: 90% !important;
    background-color: #e1e7f0;
    table {
      border-collapse: collapse !important;
    }
    // 表头
    th {
      background-color: #768fba;
      color: black;
      border: 1px solid white;
      text-align: center;
    }
    // 表体
    td {
      color: black;
      border: 1px solid white;
      text-align: center;
    }
    .el-table__row {
      background-color: transparent;
      border: 1px solid black;
    }
    // 司马重置（太难找啦）
    .el-table__body tr:hover > td {
      // 表体的hover在这
      background-color: #768fba !important;
    }
    &::before {
      background-color: #e1e7f0;
    }
  }
  .pageModel {
    float: right;
    margin: 3% 5%;
  }
  // 博客种类tag官方设置-------------------
  // .el-button {
  //   // background-color: transparent;
  //   &:hover {
  //     // color: #d9e3f4;
  //   }
  // }
  // .el-tag {
  //   // background-color: #8dabdf;
  //   // border: 1px solid #8dabdf;
  // }
  // 每个tag左边的tag的样式
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    // background-color: #8dabdf;
    // border: 1px solid #8dabdf;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    ::v-deep(.el-input__inner) {
      // background-color: #8dabdf;
      // border: 1px solid #8dabdf;
      color: white;
    }
  }
  // 主要样式配置
  .main {
    width: 100%;
    background-color: transparent;
    float: left;
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    margin-top: -35px;
    border-radius: 12px;
    width: 85%;
    min-height: 650px; // 子盒子撑开父元素高度
    margin-bottom: 50px;
    box-shadow: 0px -2px 5px #333333;
    background-color: white;
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
}
</style>
