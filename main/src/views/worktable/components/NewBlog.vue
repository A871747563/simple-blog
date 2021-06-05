<template>
  <div id="NewBlog" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <div class="content_form">
          <div class="F-line">
            <div class="new_title">
              <span class="left">标题：</span>
              <el-input v-model="title" placeholder="请输入标题" />
            </div>
            <div class="new_type">
              <span class="left">文章类型：</span>
              <el-select v-model="type" placeholder="请选择文章类型">
                <el-option v-for="item in BTypeOptions" :key="item.type_id" :label="item.type_name" :value="item.type_id" :class="theme" />
              </el-select>
            </div>
            <div class="new_tags">
              <span class="left">标签：</span>
              <el-select v-model="tagsGroup" multiple filterable allow-create default-first-option placeholder="请选择文章标签">
                <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" :class="theme" />
              </el-select>
            </div>
          </div>
          <div class="new_info">
            <span class="left">简介：</span>
            <el-input v-model="description" type="textarea" :rows="2" placeholder="请输入内容" />
          </div>
          <div class="new_upload">
            <span class="left">上传封面图：</span>
            <el-upload
              class="upload-demo"
              :file-list="imgList"
              list-type="picture"
              action=""
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadEvent"
              :before-remove="beforeRemove"
              :on-preview="handlePreview"
              :limit="1"
              :on-exceed="handleExceed"
            >
              <template #tip>
                <div class="el-upload__tip">只能上传 jpg、png、jpeg 格式文件，且不超过2MB</div>
              </template>
              <el-button size="small" type="primary" :class="{ hasImg: imgList.length > 0 }">选择图片</el-button>
            </el-upload>
          </div>
        </div>
        <div class="new_button">
          <el-button type="primary" :loading="loading" @click="submitEvent">提交</el-button>
          <el-button type="danger" :loading="loading" @click="backEvent">返回首页</el-button>
        </div>
        <div class="new_text">
          <!-- <div class="Editor"><Richtext /></div> -->
          <div class="Editor"><MdEdit /></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 新建博客页
// 关于存储markdown格式，原本想直接存储markdown格式的数据，但再后端数据库存储那块不熟悉，无法解决这个问题
// 于是乎，采取在数据库中存储html格式，在编辑时再转换成markdown格式进行编辑，啊啊啊啊啊。
// 5.28----解决了在数据库存储markdown的问题，实现了html和markdown同时都可存储数据库的兼容
// 打印机组件
import Printer from 'components/Printer'
import { ref, reactive, provide, onMounted, onUnmounted, computed, onActivated, onDeactivated } from 'vue'
// import Richtext from 'components/richtext.vue'
import MdEdit from 'components/MdEdit.vue'
import { NewblogAxios, blogTypesAxios, NewblogTypeAxios } from 'utils/request/requestInfo.js'
import { uploadAxios } from 'utils/request/requestImg.js'
import { notify } from 'utils/element-util'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { gettingCK } from 'utils/cookie-util'
import { ElMessageBox } from 'element-plus'
export default {
  components: {
    // Richtext,
    MdEdit,
    Printer
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const router = useRouter()
    const uid = computed(() => {
      return gettingCK('userid')
    })
    // 下拉框相关
    const type = ref('')
    const BTypeOptions = ref([
      {
        type_id: 1,
        type_name: '技术文章'
      },
      {
        type_id: 2,
        type_name: '科普文章'
      },
      {
        type_id: 3,
        type_name: '吹水文章'
      },
      {
        type_id: 4,
        type_name: '日记文章'
      }
    ])
    // 多标签选择相关(可自己附加其他选项)
    const tagOptions = ref([
      {
        value: 'HTML',
        label: 'HTML'
      },
      {
        value: 'CSS',
        label: 'CSS'
      },
      {
        value: 'JavaScript',
        label: 'JavaScript'
      },
      {
        value: 'Java',
        label: 'Java'
      },
      {
        value: 'C',
        label: 'C'
      },
      {
        value: 'C+',
        label: 'C+'
      },
      {
        value: 'Ruby',
        label: 'Ruby'
      }
    ])
    // 按钮loading
    const loading = ref(false)
    const tagsGroup = ref([])
    // 输入框相关
    const title = ref('')
    const description = ref('')
    // 富文本内容（vue3新的父子传参方式）
    const content = ref()
    provide('content', content)
    // 函数区--------------------------------------------------------------------------------------------------------
    // 数据提交函数
    // 提交博客(请求)
    const submitEvent = () => {
      const tempdata = {
        title: title.value,
        info: description.value,
        img: imgList.value[0] ? imgList.value[0].url : '',
        uid: uid.value,
        tag: tagsGroup.value.join('，'),
        tid: type.value,
        content: content.value
        // content: content.value ? md.render(content.value) : '' // 转换成html格式进行存储
      }
      // 提交数据前的校验开关
      let Control = false
      for (const item in tempdata) {
        if (tempdata[item] === '') {
          notify('文章信息不完整', 'warning')
          Control = false
          return
        } else {
          Control = true
        }
      }
      // 查看开关状态确定是否进行提交请求
      if (Control) {
        loading.value = true
        submitData(tempdata)
      }
    }
    const submitData = (data) => {
      NewblogAxios(data)
        .then(
          (res) => {
            console.log(res)
            if (res.data.errno !== -1) {
              const blogId = res.data.data.insertId
              notify('博客添加成功，即将跳转至对应页面', 'success')
              sessionStorage.removeItem('url')
              setTimeout(() => {
                loading.value = false
                router.push({
                  name: 'BlogDetail',
                  params: {
                    blogId: blogId
                  }
                })
              }, 1000)
            } else {
              loading.value = false
              notify('出错了！，新建博客失败', 'error')
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
    // 放弃新建，返回首页
    const backEvent = () => {
      router.push({
        name: 'Home'
      })
    }
    // 获取博客类型种类(请求)
    const getblogTypes = () => {
      blogTypesAxios({})
        .then(
          (res) => {
            BTypeOptions.value = res.data.data
            notify('初始化成功', 'success')
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
    // 文件上传相关--------------------------------------------------------------------------------------------------------
    // 文件列表移除文件时的钩子
    // 图片列表
    const imgList = ref([])
    const handleRemove = (file) => {
      imgList.value = []
    }
    // 初始化图片上传列表
    if (sessionStorage.getItem('url')) {
      imgList.value.push({
        name: '博客封面图',
        url: sessionStorage.getItem('url')
      })
    }
    // 文件超出个数限制时的钩子
    const handleExceed = (files) => {
      notify('只能选择一张', 'warning')
    }
    // 上传文件之前的钩子，参数为上传的文件，若主要用于检查上传文件的格式和大小
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
      // QiNiuData.data.key = `upload_pic_${file.name}`
    }
    // 删除文件之前的钩子，用于提醒用户移除。
    const beforeRemove = () => {
      if (imgList.value.length > 0) {
        return ElMessageBox.confirm(`确定移除这张图片？`, '提示', {
          type: 'warning',
          customClass: theme.value
        }).then(() => {
          notify('移除了噢~~~', 'warning')
        })
        // 文件格式校验不通过时走这里
      } else {
        return true
      }
    }
    // 查看图片(未实现)
    const handlePreview = () => {
      console.log('查看图片')
    }
    // 自定义文件上传事件
    const uploadEvent = (obj) => {
      uploadAxios({ fileupload: obj.file })
        .then(
          (res) => {
            console.log(res)
            imgList.value.push({
              name: '博客封面图',
              url: res.data.url
            })
            // sessionStorage临时存储下上次上传的图片地址
            sessionStorage.setItem('url', res.data.url)
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
    // dom挂载完毕
    onMounted(() => {
      getblogTypes()
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
      data: '新建博客',
      title,
      description,
      type,
      BTypeOptions,
      tagsGroup,
      submitEvent,
      backEvent,
      handleRemove,
      handleExceed,
      beforeAvatarUpload,
      beforeRemove,
      uploadEvent,
      imgList,
      handlePreview,
      tagOptions,
      theme,
      loading
    }
  }
}
</script>
<style scoped lang="scss">
#NewBlog.dark {
  // 将小三项放第一行
  .F-line {
    // border: 1px solid white;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .new_title {
      > span {
        width: 30%;
        display: block;
        color: #c9d1d9;
      }
      // border: 1px solid white;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      &::v-deep(.el-input) {
        background-color: transparent;
        border: none;
        .el-input__inner {
          background-color: #012840;
          border: 2px solid black;
          border-radius: 5px;
          font-size: 12px;
          color: #c9d1d9;
          &::placeholder {
            font-size: 12px;
            color: #c9d1d9;
          }
          &:focus {
            font-size: 12px;
            color: #c9d1d9;
            border: 2px solid #4ca1ec;
          }
        }
      }
    }
    .new_type {
      // border: 1px solid white;
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        width: 35%;
        display: block;
        color: #c9d1d9;
      }
      &::v-deep(.el-select) {
        border: none;
      }
      &::v-deep(.el-input--suffix) {
        font-size: 1vw;
        background-color: transparent;
        border: none;
        .el-input__inner {
          color: #c9d1d9;
          background-color: #012840;
          border: 2px solid black;
          border-radius: 5px;
          font-size: 12px;
          &::placeholder {
            color: #c9d1d9;
            font-size: 12px;
          }
          &:focus {
            font-size: 12px;
            color: #c9d1d9;
            border: 2px solid rgb(31, 33, 36);
          }
        }
      }
    }
    .new_tags {
      // border: 1px solid white;
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        width: 17%;
        display: block;
        color: #c9d1d9;
      }
      ::v-deep(.el-select) {
        // 分了两层
        // 一般输入框
        .el-input__inner {
          font-size: 12px;
          background-color: #012840;
          border: 2px solid black;
          color: #c9d1d9;
          &::placeholder {
            font-size: 12px;
            color: #c9d1d9;
          }
        }
        // 标签选择输入框
        .el-select__input {
          font-size: 12px;
          color: #c9d1d9;
        }
        // 各个小标签的区域
        .el-select__tags {
          .el-tag {
            font-size: 12px;
            background-color: #090c10;
            color: #4ca1ec;
          }
        }
      }
    }
  }
  // 第二行
  .new_info {
    padding: 0 2.3%;
    // border: 1px solid white;
    width: 95%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      width: 6%;
      display: block;
      color: #c9d1d9;
    }
    &::v-deep(.el-textarea) {
      font-size: 1vw;
      background-color: transparent;
      border: none;
      .el-textarea__inner {
        color: #c9d1d9;
        height: 100px;
        max-height: 100px;
        background-color: #012840;
        border: 2px solid black;
        font-size: 12px;
        &::placeholder {
          font-size: 12px;
          color: #c9d1d9;
        }
        &:focus {
          font-size: 12px;
          color: #c9d1d9;
          border: 2px solid #4ca1ec;
        }
      }
    }
  }
  // 第三行
  .new_upload {
    padding: 0 2.3%;
    margin-top: 3%;
    // border: 1px solid white;
    width: 95%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > span {
      width: 15%;
      display: block;
      color: #c9d1d9;
      // // border: 1px solid white;
    }
    // 小提示
    &::v-deep(.el-upload__tip) {
      color: #c9d1d9;
    }
    // 图片列表
    &::v-deep(.el-upload-list) {
      width: 90%;
      float: left;
      // 图片各项
      .el-upload-list__item {
        background-color: #012840;
        height: 90px;
        // border: 1px solid rgb(64, 158, 255);
        border: none;
        .el-upload-list__item-name {
          color: #c9d1d9;
        }
      }
    }
    // 按钮
    &::v-deep(.el-button) {
      float: left;
      background-color: #090c10;
    }
    &::v-deep(.el-button.hasImg) {
      display: none;
    }
  }
  // 第四行
  .new_button {
    padding: 0 2.5%;
    margin: 0 8%;
    // border: 1px solid white;
    width: 79%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      -webkit-transform: scale(0.9);
      transform: scale(0.9);
      width: 120px;
      background-color: #090c10;
    }
  }
  // 文本编辑器
  .new_text {
    margin: 2% 8%;
    // border: 1px solid white;
    width: 84%;
  }
  // 整个小项表单
  .content_form {
    margin: 100px 8% 50px 8%;
    padding-bottom: 50px;
    background-color: #090c10;
    // border: 1px solid white;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      width: 2%;
      left: -1%;
      top: 0;
      background-color: #c9d1d9;
    }
  }
  // --------------------------------------主设置--------------------------------------------
  .main {
    width: 100%;
    background-color: transparent;
    /* position: absolute; */
    float: left;
    // margin-top: 65vh; 浮动方案可以不加外边距
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    margin-top: -35px;
    border-radius: 12px;
    width: 70%;
    min-height: 35vh; // 子盒子撑开父元素高度
    margin-bottom: 150px;
    padding-bottom: 150px;
    background-color: #011826;
    // // border: 1px solid white;
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
      // // border: 1px solid white;
    }
  }
}
#NewBlog.light {
  // 将小三项放第一行
  .F-line {
    // border: 1px solid white;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .new_title {
      > span {
        width: 30%;
        display: block;
        color: black;
      }
      // border: 1px solid white;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      &::v-deep(.el-input) {
        background-color: transparent;
        border: none;
        .el-input__inner {
          border-radius: 5px;
          font-size: 12px;
          &::placeholder {
            font-size: 12px;
          }
          &:focus {
            font-size: 12px;
          }
        }
      }
    }
    .new_type {
      // border: 1px solid white;
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        width: 35%;
        display: block;
        color: black;
      }
      &::v-deep(.el-select) {
        border: none;
      }
      &::v-deep(.el-input--suffix) {
        font-size: 1vw;
        background-color: transparent;
        border: none;
        .el-input__inner {
          border-radius: 5px;
          font-size: 12px;
          &::placeholder {
            font-size: 12px;
          }
          &:focus {
            font-size: 12px;
          }
        }
      }
    }
    .new_tags {
      // border: 1px solid white;
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        width: 20%;
        display: block;
        color: black;
      }
      ::v-deep(.el-select) {
        // 分了两层
        // 一般输入框
        .el-input__inner {
          font-size: 12px;
          &::placeholder {
            font-size: 12px;
          }
        }
        // 标签选择输入框
        .el-select__input {
          font-size: 12px;
        }
        // 各个小标签的区域
        .el-select__tags {
          .el-tag {
            font-size: 12px;
          }
        }
      }
    }
  }
  // 第二行
  .new_info {
    padding: 0 2.3%;
    // border: 1px solid white;
    width: 95%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      width: 6.5%;
      display: block;
      color: black;
    }
    &::v-deep(.el-textarea) {
      font-size: 1vw;
      background-color: transparent;
      border: none;
      .el-textarea__inner {
        height: 100px;
        max-height: 100px;
        font-size: 12px;
        &::placeholder {
          font-size: 12px;
        }
        &:focus {
          font-size: 12px;
        }
      }
    }
  }
  // 第三行
  .new_upload {
    padding: 0 2.3%;
    margin-top: 3%;
    // border: 1px solid white;
    width: 95%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > span {
      width: 15%;
      display: block;
      color: black;
      // // border: 1px solid white;
    }
    // 小提示
    &::v-deep(.el-upload__tip) {
      color: black;
    }
    // 图片列表
    &::v-deep(.el-upload-list) {
      width: 90%;
      float: left;
      // 图片各项
      .el-upload-list__item {
        // background-color: #b2c7e9;
        height: 90px;
        // border: 1px solid rgb(64, 158, 255);
        border: none;
        // .el-upload-list__item-name {
        //   color: #000;
        // }
      }
    }
    // 按钮
    &::v-deep(.el-button) {
      float: left;
      // background-color: #8dabdf;
    }
    &::v-deep(.el-button.hasImg) {
      display: none;
    }
  }
  // 第四行
  .new_button {
    padding: 0 2.5%;
    margin: 0 8%;
    // border: 1px solid white;
    width: 79%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      -webkit-transform: scale(0.9);
      transform: scale(0.9);
      width: 120px;
    }
  }
  // 文本编辑器
  .new_text {
    margin: 2% 8%;
    // border: 1px solid white;
    width: 84%;
  }
  // 整个小项表单
  .content_form {
    margin: 100px 8% 50px 8%;
    padding-bottom: 50px;
    background-color: #e1e7f0;
    // border: 1px solid white;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      width: 1%;
      left: -1%;
      top: 0;
      background-color: #768fba;
    }
  }
  // --------------------------------------主设置--------------------------------------------
  .main {
    width: 100%;
    background-color: transparent;
    /* position: absolute; */
    float: left;
    // margin-top: 65vh; 浮动方案可以不加外边距
    display: flex;
    justify-content: center;
  }
  .content {
    z-index: 2;
    margin-top: -35px;
    border-radius: 12px;
    width: 70%;
    min-height: 35vh; // 子盒子撑开父元素高度
    margin-bottom: 150px;
    padding-bottom: 150px;
    background-color: white;
    box-shadow: 0px -2px 5px #333333;
    // // border: 1px solid white;
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
      // // border: 1px solid white;
    }
  }
}
</style>
