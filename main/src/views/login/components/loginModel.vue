<template>
  <div id="login_container">
    <div class="title">登录</div>
    <div class="loginform">
      <el-form ref="formName" label-position="left" label-width="100px" :model="logindata" :rules="rules">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="logindata.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="logindata.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <div class="form_button">
          <el-button :loading="loadingStatus" type="primary" @click="loginEvent">确认登录</el-button>
          <el-button :loading="loadingStatus" type="danger" @click="pushRegister">注册</el-button>
        </div>
      </el-form>
    </div>
    <div class="info">
      <span class="admim">管理员：admin，密码：123456</span>
      <span class="general">一般用户：yamasabin，密码：123456</span>
    </div>
  </div>
</template>

<script>
import { notify } from 'utils/element-util'
import { settingCK } from 'utils/cookie-util'
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { loginAxios } from 'utils/request/requestLogin.js'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    // vuex 获取(获得初始值)
    const logindata = reactive({
      username: store.getters['login/getUsername'],
      password: store.getters['login/getPassword']
    })
    // 等待转圈
    const loadingStatus = ref(false)
    // 校验dom的显示与隐藏
    const valid = reactive({
      username: false,
      password: false
    })

    const pushRegister = () => {
      store.commit('login/setIslogin', false)
    }
    const loginEvent = () => {
      // 一次前端表单校验
      formName.value.validate((valid) => {
        if (valid) {
          //  发送axios请求
          loadingStatus.value = true
          loginAxios(logindata)
            .then(
              (res) => {
                const data = res.data.data
                if (!data) {
                  notify('用户名或密码错误，登录失败', 'error')
                  loadingStatus.value = false
                  return
                } else {
                  console.log(data)
                  // store.commit('login/setToken', data.token)
                  settingCK('token', data.token) // token认证 存放
                  settingCK('userid', data.userid)
                  settingCK('is_superuser', data.is_superuser)
                  notify('登录成功，正在跳转', 'success')
                  setTimeout(() => {
                    loadingStatus.value = false
                    router.push({ name: 'Home' })
                  }, 500)
                }
              },
              (err) => {
                notify('请求出错了', 'error')
                loadingStatus.value = false
                console.log(err)
              }
            )
            .catch((err) => {
              notify('前端代码错误', 'error')
              loadingStatus.value = false
              console.log(err)
            })
        } else {
          notify('表单存在问题！', 'warning')
          return false
        }
      })
    }
    // 信息校验相关----------------------------------------------------------------------------------
    // 表单dom元素命名区
    const formName = ref(null)
    // 表单校验规则
    const rules = ref({
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    })
    return {
      logindata,
      loginEvent,
      valid,
      blur,
      pushRegister,
      loadingStatus,
      formName,
      rules
    }
  }
}
</script>

<style scoped lang="scss">
#login_container {
  // display: none;
  user-select: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 350px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.9);
  text-align: center;
  border-radius: 5px;
  color: white;
  .loginform {
    width: calc(100%);
    height: calc(100% - 80px);
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      // border: 1px solid white;
      .el-form-item {
        margin: 0;
        width: 250px;
      }
    }
    ::v-deep(.el-form-item__error) {
      top: 70%;
      font-size: 12px !important;
    }
    // 左边的字体
    ::v-deep(.el-form-item__label) {
      float: left;
      text-align: left;
      color: white;
      font-size: 15px;
      font-weight: 500;
      padding: 0;
    }
    ::v-deep(.el-input__inner) {
      float: right;
      width: 180px;
      background-color: transparent;
      color: white;
      // border: 1px solid white;
      &::placeholder {
        color: gray;
      }
    }
    .form_button {
      // border: 1px solid white;
      &:after {
        content: '';
        display: block;
        clear: both;
      }
      .el-button {
        float: left;
        width: 100%;
        // 初级按钮样式
        margin: 0;
        &:hover {
          color: rgb(64, 158, 255);
        }
        &.el-button--primary {
          background-color: transparent;
        }
        // 危险按钮样式
        &.el-button--danger {
          margin-top: 10px;
          background-color: transparent;
        }
        &.is-loading {
          &:before {
            background-color: transparent;
          }
        }
      }
    }
  }

  .title {
    // box-shadow: 0 3px 2px white;
    //   border: 1px solid white;
    color: white;
    height: 80px;
    line-height: 80px;
    font-size: 25px;
    font-weight: 800;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: -10%;
      left: 0;
      right: 0;
      margin: auto;
      height: 3%;
      width: 85%;
      background-color: white;
    }
  }
  .info {
    margin-top: 10px;
    > span {
      display: block;
      padding: 5px;
      // border: 1px solid white;
      font-weight: 500;
      font-size: 15px;
      text-align: left;
    }
  }
}
</style>
