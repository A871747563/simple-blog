<template>
  <div id="register_container">
    <div class="title">注册新用户</div>
    <div class="registerform">
      <el-form ref="formName" label-position="left" label-width="100px" :model="registerdata" :rules="rules">
        <div class="left">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="registerdata.username" />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="registerdata.password" type="password" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="password2">
            <el-input v-model="registerdata.password2" type="password" />
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="性别：" prop="sex">
            <el-select v-model="registerdata.sex" placeholder="请选择性别">
              <el-option label="女" value="1" class="dark editInfo" />
              <el-option label="男" value="0" class="dark" />
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="registerdata.email" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="registerdata.phone" />
          </el-form-item>
        </div>
        <div class="bottom">
          <el-button :loading="loadingStatus" type="primary" @click="pushLogin">登录</el-button>
          <el-button :loading="loadingStatus" type="danger" @click="registerEvent">确认注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { notify } from 'utils/element-util'
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { registerAxios } from 'utils/request/requestLogin.js'
export default {
  setup() {
    const store = useStore()
    //  多传数据给后端没关系，我们只要不欠数据就行
    const registerdata = reactive({
      username: '',
      password: '',
      password2: '',
      sex: '0',
      email: '',
      phone: ''
    })
    // 等待转圈
    const loadingStatus = ref(false)
    // 前往登录
    const pushLogin = () => {
      store.commit('login/setIslogin', true)
    }
    const registerEvent = () => {
      // 一次前端表单校验
      formName.value.validate((valid) => {
        if (valid) {
          //  发送axios请求
          loadingStatus.value = true
          registerAxios(registerdata)
            .then(
              (res) => {
                if (res.data.erron !== 0) {
                  notify('注册失败', 'error')
                  loadingStatus.value = false
                  return
                } else {
                  notify('注册成功,前往登录', 'success')
                  loadingStatus.value = false
                  // 注册成功，自动将我们的注册成功的值存入store，让登录组件监听获得值方便登录，更为友好
                  store.commit('login/setUsername', registerdata.username)
                  store.commit('login/setPassword', registerdata.password)
                  pushLogin()
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
      sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
          required: true,
          validator: (rule, value, callback, source, options) => {
            if (registerdata.password2 !== '' && value !== registerdata.password2) {
              callback('两次密码不一致')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      password2: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        {
          required: true,
          validator: (rule, value, callback, source, options) => {
            if (value !== registerdata.password) {
              callback('两次密码不一致')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
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
      ]
    })
    return {
      registerdata,
      registerEvent,
      pushLogin,
      blur,
      loadingStatus,
      formName,
      rules
    }
  }
}
</script>

<style scoped lang="scss">
#register_container {
  // display: none;
  user-select: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 700px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.9);
  text-align: center;
  border-radius: 5px;
  color: white;
  .title {
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
      width: 91%;
      background-color: white;
    }
  }
  .registerform {
    width: 100%;
    height: calc(100% - 180px);
    padding: 50px 0;
    // border: 1px solid white;
    // 左边的字体
    ::v-deep(.el-form-item__label) {
      color: white;
      font-size: 15px;
      font-weight: 500;
    }
    ::v-deep(.el-input__inner) {
      background-color: transparent;
      color: white;
      border: 1px solid white;
      &::placeholder {
        color: white;
      }
    }
  }

  .left {
    float: left;
    margin-left: 30px;
    // border: 1px solid white;
  }
  .right {
    float: right;
    margin-right: 30px;
    // border: 1px solid white;
  }
  .bottom {
    // border: 1px solid rgb(199, 23, 23);
    height: 100%;
    clear: both;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 200px;
      &:hover {
        color: rgb(64, 158, 255);
      }
      // 初级按钮样式
      &.el-button--primary {
        background-color: transparent;
        margin-left: 132px;
      }
      // 危险按钮样式
      &.el-button--danger {
        background-color: transparent;
        margin-right: 42px;
      }
      &.is-loading {
        &:before {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
