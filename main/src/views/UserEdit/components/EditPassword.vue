<template>
  <div id="EditPassword" :class="theme">
    <div class="avatar_form">
      <div class="img_border">
        <img src="@/assets/image/keyword.png" class="avatar" />
      </div>
    </div>
    <div class="content_form">
      <el-form ref="formName" label-position="left" label-width="100px" :model="formdata" :rules="rules">
        <el-form-item label="原密码：" prop="oldPass">
          <el-input v-model="formdata.oldPass" :type="Inputtype" />
        </el-form-item>
        <el-form-item label="新密码：" prop="newPass">
          <el-input v-model="formdata.newPass" :type="Inputtype" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPass">
          <el-input v-model="formdata.confirmPass" :type="Inputtype" />
        </el-form-item>
        <div class="form_button">
          <el-button type="primary" @click="SubmitEvent">提交修改</el-button>
          <el-button type="danger" @click="PasswordEvent">{{ ButtonText }}</el-button>
          <el-button type="success" @click="ReturnEvent">返回上步</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
// 任务：做密码校验噢！
import { onMounted, onUnmounted, ref, computed, reactive, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { notify, message } from 'utils/element-util'
import { DeleteCkAll, gettingCK } from 'utils/cookie-util'
import { EditPasswordAxios } from 'utils/request/requestEditInfo.js'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const router = useRouter()
    // 获取用户id
    const userid = computed(() => {
      return gettingCK('userid')
    })
    // 输入和按钮相关
    const Inputtype = ref('password')
    const ButtonText = ref('显示密码')

    const SubmitEvent = () => {
      // 一次前端校验
      formName.value.validate((valid) => {
        if (valid) {
          // 二次前端校验
          if (formdata.newPass !== formdata.oldPass) {
            EditPasswordAxios(formdata)
              .then(
                (res) => {
                  const status = res.data.data['status']
                  // 一次后端校验
                  if (status === 'success') {
                    message('<strong>修改密码成功，请重新登录&nbsp;<i class="el-icon-loading"></i></strong>', 'success', true, 1500)
                    setTimeout(() => {
                      router.push({ name: 'Login' })
                      // 退出登录，清除cookie
                      DeleteCkAll()
                      notify('退出成功', 'success')
                    }, 1500)
                  } else if (status === 'password_error') {
                    notify('密码错误，修改失败', 'error')
                  } else {
                    notify('服务端错误', 'error')
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
          } else {
            notify('新旧密码相同', 'error')
          }
        } else {
          notify('表单存在问题!', 'error')
          return false
        }
      })
    }
    const ReturnEvent = () => {
      router.push({ name: 'EditInfo' })
    }
    const PasswordEvent = () => {
      if (Inputtype.value === 'password' && ButtonText.value === '显示密码') {
        Inputtype.value = 'text'
        ButtonText.value = '隐藏密码'
      } else {
        Inputtype.value = 'password'
        ButtonText.value = '显示密码'
      }
    }

    // 密码校验相关----------------------------------------------------------------------------------
    const formdata = reactive({
      uid: userid.value,
      oldPass: '',
      newPass: '',
      confirmPass: ''
    })
    // 表单dom元素命名区
    const formName = ref(null)
    // 表单校验规则
    const rules = reactive({
      oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
      newPass: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
          required: true,
          validator: (rule, value, callback, source, options) => {
            if (formdata.confirmPass !== '' && value !== formdata.confirmPass) {
              callback('两次密码不一致')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      confirmPass: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        {
          required: true,
          validator: (rule, value, callback, source, options) => {
            if (value !== formdata.newPass) {
              callback('两次密码不一致')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    })

    // dom挂载完毕
    onMounted(() => {})
    onUnmounted(() => {})
    return {
      formdata,
      Inputtype,
      ButtonText,
      SubmitEvent,
      PasswordEvent,
      ReturnEvent,
      formName,
      rules,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#EditPassword.dark {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: #011826;
  position: absolute;
  // border: 1px solid white;
  .content_form {
    padding-top: 100px;
    display: flex;
    justify-content: center;
    // 左边的字体
    ::v-deep(.el-form-item__label) {
      color: white;
      font-size: 15px;
      font-weight: 500;
    }
    ::v-deep(.el-input__inner) {
      background-color: rgb(31, 33, 36);
      color: white;
      &::placeholder {
        color: white;
      }
    }
    .form_button {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      .el-button {
        width: 100px;
        background-color: transparent;
        &:hover {
          color: #4ca1ec;
        }
      }
    }
  }
  .avatar_form {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    .img_border {
      display: flex;
      justify-content: center;
      align-items: center;
      //   border: 1px solid white;
      border-radius: 100px;
      width: 130px;
      height: 130px;
      overflow: hidden;
      img {
        width: 150px;
      }
    }
  }
}
#EditPassword.light {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0px -2px 5px #333333;
  background-color: white;
  position: absolute;
  // border: 1px solid white;
  .content_form {
    padding-top: 100px;
    display: flex;
    justify-content: center;
    // 左边的字体
    ::v-deep(.el-form-item__label) {
      color: black;
      font-size: 15px;
      font-weight: 500;
    }
    // ::v-deep(.el-input__inner) {
    //   background-color: rgb(31, 33, 36);
    //   color: white;
    //   &::placeholder {
    //     color: white;
    //   }
    // }
    .form_button {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      .el-button {
        width: 100px;
        // background-color: transparent;
        // &:hover {
        //   color: #d9e3f4;
        // }
      }
    }
  }
  .avatar_form {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    .img_border {
      display: flex;
      justify-content: center;
      align-items: center;
      //   border: 1px solid white;
      border-radius: 100px;
      width: 130px;
      height: 130px;
      overflow: hidden;
      img {
        width: 150px;
      }
    }
  }
}
</style>
