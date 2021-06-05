<template>
  <div id="EditInfo" :class="theme">
    <div class="avatar_form">
      <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadEvent">
        <div class="img_border">
          <img v-if="formdata.avatar" v-lazy="formdata.avatar" class="avatar" />
          <img v-else src="https://i.loli.net/2021/05/19/swZ1cBOuTQ2otaW.png" class="avatar" />
        </div>
      </el-upload>
    </div>
    <div class="content_form">
      <el-form ref="formName" label-position="left" label-width="100px" :model="formdata" :rules="rules">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formdata.username" />
        </el-form-item>
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
        <div class="form_button">
          <el-button type="primary" @click="SubmitEvent">提交</el-button>
          <el-button type="danger" @click="PasswordEvent">修改密码</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { notify } from 'utils/element-util'
import { gettingCK } from 'utils/cookie-util'
import { uploadAxios } from 'utils/request/requestImg.js'
import { userinfoAxios } from 'utils/request/requestInfo.js'
import { EditGeneralAxios } from 'utils/request/requestEditInfo.js'
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
    // 用户初始数据（用于比较新值和老值，节约请求资源）
    const Initformdata = ref({
      avatar: '',
      username: '',
      sex: '',
      email: '',
      phone: ''
    })
    const formdata = ref({
      avatar: '',
      username: '',
      sex: '',
      email: '',
      phone: ''
    })

    const SubmitEvent = () => {
      // 一次前端表单校验
      formName.value.validate((valid) => {
        if (valid) {
          // 二次前端校验
          // 数据存在差异才去请求
          let flag
          for (const item in formdata.value) {
            if (formdata.value[item] !== Initformdata.value[item]) {
              flag = true
              break
            } else {
              flag = false
            }
          }
          if (flag) {
            // 携带userid去请求
            formdata.value['uid'] = userid.value
            EditGeneralAxios(formdata.value)
              .then(
                (res) => {
                  console.log(res)
                  notify('修改个人信息成功', 'success')
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
            notify('请修改信息', 'warning')
          }
        } else {
          notify('表单存在问题!', 'warning')
          return false
        }
      })
    }
    const PasswordEvent = () => {
      router.push({ name: 'EditPassword' })
    }
    // 发送请求获取用户信息
    const userInfoData = () => {
      userinfoAxios({
        uid: userid.value
      })
        .then(
          (res) => {
            formdata.value = res.data.data.data
            // 深拷贝一份存档
            Initformdata.value = JSON.parse(JSON.stringify(res.data.data.data))
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
    // 文件上传相关----------------------------------------------------------------------------------
    // 文件列表移除文件时的钩子
    // 图片地址

    const beforeAvatarUpload = (file) => {
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPNG && !isJPEG && !isJPG) {
        notify('必须jpg、png、jpeg 格式!', 'warning')
        return false
      }
      if (!isLt2M) {
        notify('不能超过2MB!', 'warning')
        return false
      }
    }
    // 自定义文件上传事件
    const uploadEvent = (obj) => {
      uploadAxios({ fileupload: obj.file })
        .then(
          (res) => {
            formdata.value.avatar = res.data.url
            // sessionStorage临时存储下上次上传的图片地址
            // sessionStorage.setItem('url', res.data.url)
            notify('上传图片成功', 'success')
          },
          (err) => {
            notify('上传图片出错了', 'error')
            console.log(err)
          }
        )
        .catch((err) => {
          notify('前端代码错误', 'error')
          console.log(err)
        })
    }
    // 信息校验相关----------------------------------------------------------------------------------
    // 表单dom元素命名区
    const formName = ref(null)
    // 表单校验规则
    const rules = ref({
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
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
    // dom挂载完毕
    onMounted(() => {
      userInfoData()
    })
    onUnmounted(() => {})
    return {
      formdata,
      uploadEvent,
      beforeAvatarUpload,
      SubmitEvent,
      PasswordEvent,
      formName,
      rules,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#EditInfo.dark {
  width: 100%;
  height: 100%;
  background-color: #011826;
  position: absolute;
  border-radius: 12px;
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
        width: 130px;
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
        height: 150px;
      }
    }
  }
}
#EditInfo.light {
  width: 100%;
  height: 100%;
  box-shadow: 0px -2px 5px #333333;
  background-color: white;
  position: absolute;
  border-radius: 12px;
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
        width: 130px;
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
        height: 150px;
      }
    }
  }
}
</style>
