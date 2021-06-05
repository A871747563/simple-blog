<template>
  <div id="ManageUser" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <!-- 表格主体 -->
        <div>
          <el-table
            v-loading="managedata.length === 0"
            :data="managedata"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column label="—" width="70">
              <template #default="scope">
                <span class="img_border"><img v-lazy="scope.row.avatar" /></span>
              </template>
            </el-table-column>
            <el-table-column label="用户名">
              <template #default="scope">
                <span>{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别" width="70">
              <template #default="scope">
                <span>{{ scope.row.sex === '0' ? '男' : '女' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="邮箱">
              <template #default="scope">
                <span>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号">
              <template #default="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="博客数量" width="100">
              <template #default="scope">
                <span>{{ scope.row.blogNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="身份">
              <template #default="scope">
                <span>{{ scope.row.is_superuser === 0 ? '一般用户' : '管理员' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="mini" type="danger" :disabled="uid == scope.row.userid" @click="UserEdit(scope.row.userid)">
                  编辑信息
                </el-button>
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
    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户信息" width="30%" :before-close="handleClose">
      <div class="dialog_form">
        <el-form ref="formName" label-position="left" label-width="100px" :model="formdata" :rules="rules">
          <el-form-item label="性别：" prop="sex">
            <el-select v-model="formdata.sex" placeholder="请选择性别">
              <el-option label="女" value="1" class="editInfo" :class="theme" />
              <el-option label="男" value="0" :class="theme" />
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="formdata.email" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="formdata.phone" />
          </el-form-item>
          <el-form-item label="身份：" prop="is_superuser">
            <el-select v-model="formdata.is_superuser" placeholder="请选择身份">
              <el-option label="管理员" :value="1" class="editInfo" :class="theme" />
              <el-option label="一般用户" :value="0" :class="theme" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sumitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 打印机组件
import Printer from 'components/Printer'
import Pagination from 'components/Pagination'
import { computed, onMounted, onUnmounted, reactive, ref, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from 'utils/element-util'
import { getAllUserAxios, editUserAxios } from 'utils/request/requestEditUser.js'
import { ElMessageBox } from 'element-plus'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { gettingCK } from 'utils/cookie-util'
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
    // 本登录用户的id
    const uid = computed(() => {
      return gettingCK('userid')
    })
    // 首屏数据存储
    const managedata = ref([])
    // 修改用户信息的表单数据
    const formdata = ref({
      uid: '',
      sex: '',
      email: '',
      phone: '',
      is_superuser: ''
    })
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
    // 对话框
    const dialogVisible = ref(false)
    // 定义方法区------------------------------------------------------------------
    // 页码改变，再次渲染
    const handleCurrentChange = (changePage) => {
      currentPage.value = changePage
      getUserData()
    }
    // 修改用户信息
    const UserEdit = (userid) => {
      // useid 为目标用户的id
      // 使用some节约性能
      let targetUser
      managedata.value.some((item) => {
        if (item.userid === userid) {
          targetUser = item
          return item
        }
      })
      //   开启对话框前的数据载入
      formdata.value.uid = targetUser.userid
      formdata.value.sex = targetUser.sex
      formdata.value.email = targetUser.email
      formdata.value.phone = targetUser.phone
      formdata.value.is_superuser = targetUser.is_superuser
      dialogVisible.value = true
    }
    // 模态框方式关闭对话框之前
    const handleClose = (done) => {
      done()
    }
    // 表单校验规则
    const rules = ref({
      sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
          required: true,
          validator: (rule, value, callback, source, options) => {
            // 身份证正则校验
            var reg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
            if (!reg.test(value)) {
              callback('请输入正确的邮箱')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
          required: true,
          validator: (rule, value, callback, source, options) => {
            // 身份证正则校验
            var reg = new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/)
            if (!reg.test(value)) {
              callback('请输入正确的手机号')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      is_superuser: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    })
    // 表单dom元素命名区
    const formName = ref(null)
    // 提交修改表单
    const sumitForm = () => {
      formName.value.validate((valid) => {
        if (valid) {
          return ElMessageBox.confirm(`确定修改？`, '提示', {
            type: 'warning',
            customClass: theme.value
          }).then(() => {
            editUserAxios(formdata.value)
              .then(
                (res) => {
                  dialogVisible.value = false
                  getUserData()
                  notify('修改数据成功', 'success')
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
          })
        } else {
          notify('表单存在问题！', 'warning')
          return false
        }
      })
    }
    // 请求定义区--------------------------------------------------------------------------------------
    // 发送post请求获取数据
    const getUserData = () => {
      getAllUserAxios(axioInfo)
        .then(
          (res) => {
            managedata.value = res.data.data.data
            allCount.value = res.data.data.allCount
            notify('初始化用户数据成功', 'success')
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
      getUserData()
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
      data: '用户管理',
      handleCurrentChange,
      currentPage,
      managedata,
      allCount,
      UserEdit,
      dialogVisible,
      formdata,
      handleClose,
      sumitForm,
      uid,
      pageSize,
      theme,
      rules,
      formName
    }
  }
}
</script>

<style scoped lang="scss">
// 样式小修改
#ManageUser.dark {
  .img_border {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    border-radius: 50px;
    overflow: hidden;
    // border: 1px solid white;
    img {
      height: 60px;
    }
  }

  &::v-deep(.el-table) {
    margin: 5% 5% 0 5%;
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
      color: #4ca1ec;
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
  //   对话框三区颜色配置
  ::v-deep(.el-dialog__header) {
    .el-dialog__title,
    i {
      color: #c9d1d9;
    }
    background-color: #011826;
  }
  ::v-deep(.el-dialog__body) {
    background-color: #090c10;
    //   表单输入左边的字体
    .el-form-item__label {
      color: #c9d1d9;
    }
    // 表单输入内容区
    .el-input__inner {
      background-color: #012840;
      color: #c9d1d9;
      &::placeholder {
        color: #c9d1d9;
      }
    }
  }
  ::v-deep(.el-dialog__footer) {
    background-color: #090c10;
  }
  //   对话框主内容区设置
  ::v-deep(.el-dialog__body) {
    display: flex;
    justify-content: center;
    .dialog_form {
      width: 320px;
    }
  }
  .el-button {
    color: #c9d1d9;
    background-color: transparent;
    &:hover {
      color: #4ca1ec;
    }
  }
  // 主要样式配置---------------------------------------------
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
    width: 70%;
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
#ManageUser.light {
  .img_border {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    border-radius: 50px;
    overflow: hidden;
    // border: 1px solid white;
    img {
      height: 60px;
    }
  }

  &::v-deep(.el-table) {
    margin: 5% 5% 0 5%;
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
      border: 1px solid white;
    }
    // 司马重置（太难找啦）
    .el-table__body tr:hover > td {
      // 表体的hover在这
      background-color: #768fba !important;
    }
    &::before {
      background-color: transparent !important;
    }
  }
  .pageModel {
    float: right;
    margin: 3% 5%;
  }
  //   对话框三区颜色配置
  ::v-deep(.el-dialog__header) {
    color: black;
    .el-dialog__title,
    i {
      color: black;
    }
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: auto;
      height: 2px;
      width: 90%;
      background-color: #768fba;
    }
    // background-color: #677ca2;
  }
  // ::v-deep(.el-dialog__body) {
  //   background-color: #8dabdf;
  //   //   表单输入左边的字体
  //   .el-form-item__label {
  //     color: #000;
  //   }
  //   // 表单输入内容区
  //   .el-input__inner {
  //     background-color: #b2c7e9;
  //     color: #000;
  //     &::placeholder {
  //       color: #000;
  //     }
  //   }
  // }
  // ::v-deep(.el-dialog__footer) {
  //   background-color: #8dabdf;
  // }
  //   对话框主内容区设置
  ::v-deep(.el-dialog__body) {
    display: flex;
    justify-content: center;
    .dialog_form {
      width: 320px;
    }
  }
  // .el-button {
  //   color: #000;
  //   background-color: transparent;
  //   &:hover {
  //     color: #d9e3f4;
  //   }
  // }
  // 主要样式配置---------------------------------------------
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
    width: 70%;
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
