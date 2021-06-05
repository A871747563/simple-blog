<template>
  <div id="header" :class="theme">
    <!-- 头部主区域 -->
    <div :class="[change ? 'headerChange' : 'headerDefault']">
      <div class="logo">
        <img src="@/assets/image/logo.png" alt="" />
      </div>
      <div class="ElMenu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <div v-for="(item, index) in siderRouter" :key="index">
            <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path" @click="pushPage(item.name)">
              <svg-icon :icon-name="item.meta.icon" class-name="itemMenu" :class="[change ? 'itemChange' : 'itemDefault']" />
              {{ item.meta.name }}
            </el-menu-item>
            <el-submenu v-if="item.children && !item.meta.hidden" :index="item.path">
              <template #title class="demo">
                <svg-icon :icon-name="item.meta.icon" class-name="itemMenu" :class="[change ? 'itemChange' : 'itemDefault']" />
                {{ item.meta.name }}
              </template>
              <el-menu-item
                v-for="(itemNext, indexNext) in item.children"
                :key="indexNext"
                :index="itemNext.path"
                :class="theme"
                @click="pushPage(itemNext.name)"
              >
                {{ itemNext.meta.name }}
              </el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </div>
      <div class="userinfo">
        <div class="theme-control">
          <svg-icon
            v-if="theme === 'dark'"
            icon-name="moon"
            class-name="theme-icon"
            :class="[change ? 'itemChange' : 'itemDefault']"
            @click="themeEvent"
          />
          <svg-icon
            v-if="theme === 'light'"
            icon-name="sun"
            class-name="theme-icon"
            :class="[change ? 'itemChange' : 'itemDefault']"
            @click="themeEvent"
          />
        </div>
        <div class="name">
          <span>{{ username }}</span>
        </div>
        <div class="avatar">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="avatarLink" />
            </span>
            <template #dropdown class="demo">
              <el-dropdown-menu class="avatar_item" :class="theme">
                <el-dropdown-item icon="el-icon-remove" @click="exitEvent">注销</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-tools" @click="infoEvent">个人信息</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!--抽屉组件  -->
    <div class="header_drawer">
      <el-drawer v-model="drawer" title="个人信息" :direction="direction" :before-close="handleClose" destroy-on-close>
        <div v-if="userInfo !== ''" class="drawer_avatar">
          <div class="img_border"><img v-lazy="userInfo.data.avatar" /></div>
        </div>
        <div v-if="userInfo !== ''" class="username">
          <svg-icon icon-name="addressbook_fill" class-name="drawer-icon" :class="theme" />
          <span>用户名：{{ userInfo.data.username }}</span>
        </div>
        <div v-if="userInfo !== ''" class="sex">
          <svg-icon icon-name="browse_fill" class-name="drawer-icon" :class="theme" />
          <span>
            性别：
            {{ userInfo.data.sex === '0' ? '男' : '女' }}
          </span>
        </div>
        <div v-if="userInfo !== ''" class="email">
          <svg-icon icon-name="mail_fill" class-name="drawer-icon" :class="theme" />
          <span>邮箱：{{ userInfo.data.email }}</span>
        </div>
        <div v-if="userInfo !== ''" class="phone">
          <svg-icon icon-name="flashlight_fill" class-name="drawer-icon" :class="theme" />
          <span>手机号码：{{ userInfo.data.phone }}</span>
        </div>
        <div v-if="userInfo !== ''" class="identity">
          <svg-icon icon-name="group_fill" class-name="drawer-icon" :class="theme" />
          <span>身份：{{ userInfo.data.is_superuser === 1 ? '管理员' : '一般用户' }}</span>
        </div>
        <div v-if="userInfo !== ''" class="blogNum">
          <svg-icon icon-name="document_fill" class-name="drawer-icon" :class="theme" />
          <span>博客数量：{{ userInfo.blogNum }}</span>
        </div>
        <div v-if="userInfo !== ''" class="editInfo">
          <span><el-button type="primary" @click="PushEvent">修改个人信息</el-button></span>
        </div>
        <div v-if="userInfo === ''" class="empty">
          <el-empty description="无数据" :image-size="100" />
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { DeleteCkAll, gettingCK, settingCK } from 'utils/cookie-util'
import { notify, message } from 'utils/element-util.js'
import { userinfoAxios } from 'utils/request/requestInfo.js'
import { ElMessageBox } from 'element-plus'
export default {
  setup() {
    //  监听vuex数据变化对导航栏进行更新
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const siderRouter = computed(() => {
      return store.getters['SiderRoutes/getRoutes']
    })
    const userid = computed(() => {
      return gettingCK('userid')
    })
    // 两个路由
    const router = useRouter()
    const route = useRoute()
    const avatarLink = ref('https://i.loli.net/2021/05/20/QWuIX5LzF2TEP8D.png') // 定义初始化数据
    const username = ref('Admin')
    const userInfo = ref('')
    // 导航栏高度变化判断
    const change = ref(false)
    // 导航高亮位置(监听)
    const activeIndex = computed(() => {
      return route.path.split('/').pop()
    })
    // 前往修改页
    const PushEvent = () => {
      router.push({ name: 'EditInfo' })
      drawer.value = false
    }
    // 发送请求获取用户信息
    const userInfoData = () => {
      userinfoAxios({
        uid: userid.value
      })
        .then(
          (res) => {
            userInfo.value = res.data.data
            avatarLink.value = userInfo.value.data.avatar
            username.value = userInfo.value.data.username
            store.commit('header/setUserlogo', userInfo.value.data.avatar)
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
    const rollingheight = () => {
      // 头部导航栏，全局触发
      change.value = window.pageYOffset > 120
      // 文章详细页才触发
      if (document.getElementById('toc')) {
        if (window.pageYOffset > 500) {
          document.getElementById('toc').setAttribute('style', 'position:fixed')
        } else {
          document.getElementById('toc').setAttribute('style', 'position:absolute')
        }
      }
    }
    // 导航栏点击跳转
    const pushPage = (name) => {
      router.push({ name: name })
    }

    // 抽屉组件参数与方法----------------------------------------------------------------------------
    const drawer = ref(false)
    const direction = ref('rtl')
    // 抽屉组件函数
    const handleClose = (done) => {
      done()
    }
    // -----------------迁移---------------------------------------
    // 注销函数
    const exitEvent = () => {
      ElMessageBox.confirm('退出用户的登录状态, 是否继续?', '提示', {
        type: 'warning',
        customClass: theme.value
      }).then(() => {
        message('<strong>正在退出，请等待&nbsp;<i class="el-icon-loading"></i></strong>', 'warning', true, 1500)
        setTimeout(() => {
          router.push({ name: 'Login' })
          // 退出登录，清除cookie
          DeleteCkAll()
          notify('退出成功', 'success')
        }, 1500)
      })
    }
    // 查看用户信息函数
    const infoEvent = () => {
      drawer.value = true
      // document.getElementsByTagName('body')[0].style['overflowY'] = 'hidden'
    }
    // 主题切换函数
    const themeEvent = () => {
      if (store.getters['header/getTheme'] === 'dark') {
        settingCK('theme', 'light')
        store.commit('header/setTheme', 'light')
        notify('切换为明亮主题成功', 'success')
      } else {
        settingCK('theme', 'dark')
        store.commit('header/setTheme', 'dark')
        notify('切换为黑暗主题成功', 'success')
      }
    }
    // dom 挂载完毕
    onMounted(() => {
      userInfoData()
      window.addEventListener('scroll', rollingheight, true)
    })
    return {
      change,
      pushPage,
      drawer,
      direction,
      activeIndex,
      userInfo,
      avatarLink,
      username,
      siderRouter,
      PushEvent,
      handleClose,
      infoEvent,
      exitEvent,
      theme,
      themeEvent
    }
  }
}
</script>

<style scoped lang="scss">
#header.dark {
  // 标题根据滚动条高度进行改变
  .headerDefault {
    z-index: 5;
    user-select: none;
    height: 72px;
    width: 100vw;
    min-width: 1000px;
    position: fixed;
    z-index: 3;
    background-color: transparent;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.476);
    top: 0;
    left: 0;
    transition: 0.4s all ease 0s; // 过渡动画
  }

  .headerChange {
    z-index: 5;
    user-select: none;
    height: 50px;
    width: 100vw;
    min-width: 1000px;
    position: fixed;
    z-index: 3;
    background-color: #011826;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.476);
    top: 0;
    left: 0;
    transition: 0.4s all ease 0s; // 过渡动画
  }
  // 根据页面位置赋予下拉菜单不同的样式
  //  初始默认
  //  有长度变化的样式记得加过渡动画
  .headerDefault ::v-deep(.el-menu) {
    //   border: 1px solid white;
    border: none;
    // 初始化配置
    background-color: transparent;
    width: 500px;
    height: 72px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 330px;
    transition: 0.4s all ease 0s; // 过渡动画
    // 无下拉
    .el-menu-item {
      color: #c9d1d9;
      height: 70px;
      line-height: 70px;
      font-size: 16px;
      &:hover {
        opacity: 0.7;
        background-color: #090c10;
        color: #4ca1ec;
      }
      // 解决诡异bug
      &:focus {
        background-color: transparent;
        color: #c9d1d9;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //  有下拉
    .el-submenu .el-submenu__title {
      color: #c9d1d9;
      line-height: 70px;
      height: 70px;
      font-size: 16px;
      &:hover {
        opacity: 0.7;
        background-color: #090c10;
        color: #4ca1ec;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //   无下拉，被激活
    .el-menu-item.is-active {
      border-bottom: 5px solid #ff404084;
      opacity: 0.7;
      background-color: #090c10;
      color: #4ca1ec;
    }
    //   有下拉，被激活
    .el-submenu.is-active .el-submenu__title {
      border-bottom: 5px solid #ff404084;
      opacity: 0.7;
      background-color: #090c10;
      color: #4ca1ec;
    }
  }
  // 高度改变后-
  .headerChange ::v-deep(.el-menu) {
    //   border: 1px solid white;
    border: none;
    // 初始化配置
    background-color: transparent;
    width: 500px;
    height: 50px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 170px;
    transition: 0.4s all ease 0s; // 过渡动画
    // 无下拉
    .el-menu-item {
      color: #c9d1d9;
      height: 50px;
      line-height: 50px;
      font-size: 10px;
      &:hover {
        background-color: #012840;
        color: #4ca1ec;
      }
      // 解决诡异bug
      &:focus {
        background-color: transparent;
        color: #c9d1d9;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //  有下拉
    .el-submenu .el-submenu__title {
      color: #c9d1d9;
      height: 50px;
      line-height: 50px;
      font-size: 10px;
      &:hover {
        background-color: #012840;
        color: #4ca1ec;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //   无下拉，被激活
    .el-menu-item.is-active {
      border-bottom: 2px solid #ff404084;
      background-color: #012840;
      color: #4ca1ec;
    }
    //   有下拉，被激活
    .el-submenu.is-active .el-submenu__title {
      border-bottom: 2px solid #ff404084;
      background-color: #012840;
      color: #4ca1ec;
    }
  }

  // 根据页面位置赋予用户信息区域不同的样式
  .headerDefault .userinfo {
    height: 72px;
    width: 200px;
    // border: 1px solid white;
    position: absolute;
    right: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: 0.4s all ease 0s; // 过渡动画
    .name,
    .theme-control {
      // border: 1px solid white;
      color: #c9d1d9;
      font-size: 18px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
    .avatar {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 64px;
      cursor: pointer;
      overflow: hidden;
      transition: 0.4s all ease 0s; // 过渡动画
      img {
        height: 45px;
        transition: 0.4s all ease 0s; // 过渡动画
      }
    }
  }
  .headerChange .userinfo {
    width: 150px;
    height: 50px;
    // border: 1px solid white;
    position: absolute;
    right: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: 0.4s all ease 0s; // 过渡动画
    .name,
    .theme-control {
      display: inline-block;
      // border: 1px solid white;
      color: #c9d1d9;
      font-size: 15px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
    .avatar {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 64px;
      cursor: pointer;
      overflow: hidden;
      transition: 0.4s all ease 0s; // 过渡动画
      img {
        height: 35px;
        transition: 0.4s all ease 0s; // 过渡动画
      }
    }
  }

  // logo块配置
  .headerDefault .logo {
    position: absolute;
    left: 20px;
    height: 72px;
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s all ease 0s; // 过渡动画
    //   border: 1px solid white;
    img {
      width: 150px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
  }
  .headerChange .logo {
    position: absolute;
    left: 20px;
    height: 50px;
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    //   border: 1px solid white;
    transition: 0.4s all ease 0s; // 过渡动画
    img {
      width: 100px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
  }
  // 抽屉组件
  .header_drawer {
    // 模态框
    // &::v-deep(.el-overlay) {
    //   width: 80vw;
    //   z-index: 4 !important;
    // }
    // 整体
    user-select: none;
    &::v-deep(.el-drawer) {
      background-color: #011826;
      border-radius: 0 10px 10px 0;
    }
    // 标题
    &::v-deep(.el-drawer__header) {
      text-align: center;
      font-size: 1.5vw;
      color: #c9d1d9;
      // border: 1px solid white;
    }
    // 内容
    &::v-deep(.el-drawer__body) {
      padding: 0 5vw;
      color: #c9d1d9;
      font-size: 1vw;
    }
    // 各个div整体设置
    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // border: 1px solid white;
      margin: 2vw 0;
      padding-left: 3vw;
    }
    div:first-child {
      padding-left: 0;
    }
    .drawer_avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      // border: 1px solid white;
      .img_border {
        width: 6vw;
        height: 6vw;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        overflow: hidden;
        // border: 1px solid white;
      }
      img {
        height: 7vw;
      }
    }
    // 内部标签样式修改
    &::v-deep(.el-tag) {
      font-size: 0.8vw;
    }
    .el-button {
      background-color: transparent;
      &:hover {
        color: #4ca1ec;
      }
    }
  }
}
#header.light {
  // 标题根据滚动条高度进行改变
  .headerDefault {
    z-index: 5;
    user-select: none;
    height: 72px;
    width: 100vw;
    min-width: 1000px;
    position: fixed;
    z-index: 3;
    background-color: transparent;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.476);
    top: 0;
    left: 0;
    transition: 0.4s all ease 0s; // 过渡动画
  }

  .headerChange {
    z-index: 5;
    user-select: none;
    height: 50px;
    width: 100vw;
    min-width: 1000px;
    position: fixed;
    z-index: 3;
    background-color: #768fba;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.476);
    top: 0;
    left: 0;
    transition: 0.4s all ease 0s; // 过渡动画
  }
  // 根据页面位置赋予下拉菜单不同的样式
  //  初始默认
  //  有长度变化的样式记得加过渡动画
  .headerDefault ::v-deep(.el-menu) {
    //   border: 1px solid white;
    border: none;
    // 初始化配置
    background-color: transparent;
    width: 500px;
    height: 72px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 330px;
    transition: 0.4s all ease 0s; // 过渡动画
    // 无下拉
    .el-menu-item {
      color: #ffffff;
      height: 70px;
      line-height: 70px;
      font-size: 16px;
      &:hover {
        opacity: 0.7;
        background-color: #314255;
        color: black;
      }
      // 解决诡异bug
      &:focus {
        background-color: transparent;
        color: black;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //  有下拉
    .el-submenu .el-submenu__title {
      color: #ffffff;
      line-height: 70px;
      height: 70px;
      font-size: 16px;
      &:hover {
        opacity: 0.7;
        background-color: #314255;
        color: black;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //   无下拉，被激活
    .el-menu-item.is-active {
      border-bottom: 5px solid #ff404084;
      opacity: 0.7;
      background-color: #314255;
      color: black;
    }
    //   有下拉，被激活
    .el-submenu.is-active .el-submenu__title {
      border-bottom: 5px solid #ff404084;
      opacity: 0.7;
      background-color: #314255;
      color: black;
    }
  }
  // 高度改变后-
  .headerChange ::v-deep(.el-menu) {
    //   border: 1px solid white;
    border: none;
    // 初始化配置
    background-color: transparent;
    width: 500px;
    height: 50px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 170px;
    transition: 0.4s all ease 0s; // 过渡动画
    // 无下拉
    .el-menu-item {
      color: white;
      height: 50px;
      line-height: 50px;
      font-size: 10px;
      &:hover {
        background-color: #4c7ebb;
        color: black;
      }
      // 解决诡异bug
      &:focus {
        background-color: transparent;
        color: black;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //  有下拉
    .el-submenu .el-submenu__title {
      color: white;
      height: 50px;
      line-height: 50px;
      font-size: 10px;
      &:hover {
        background-color: #4c7ebb;
        color: black;
      }
      transition: 0.4s all ease 0s; // 过渡动画
    }
    //   无下拉，被激活
    .el-menu-item.is-active {
      border-bottom: 2px solid #ff404084;
      background-color: #4c7ebb;
      color: black;
    }
    //   有下拉，被激活
    .el-submenu.is-active .el-submenu__title {
      border-bottom: 2px solid #ff404084;
      background-color: #4c7ebb;
      color: black;
    }
  }

  // 根据页面位置赋予用户信息区域不同的样式
  .headerDefault .userinfo {
    height: 72px;
    width: 200px;
    // border: 1px solid white;
    position: absolute;
    right: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: 0.4s all ease 0s; // 过渡动画
    .name,
    .theme-control {
      display: inline-block;
      // border: 1px solid white;
      color: white;
      font-size: 18px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
    .avatar {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 64px;
      cursor: pointer;
      overflow: hidden;
      transition: 0.4s all ease 0s; // 过渡动画
      img {
        height: 45px;
        transition: 0.4s all ease 0s; // 过渡动画
      }
    }
  }
  .headerChange .userinfo {
    width: 150px;
    height: 50px;
    // border: 1px solid white;
    position: absolute;
    right: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: 0.4s all ease 0s; // 过渡动画
    .name,
    .theme-control {
      display: inline-block;
      // border: 1px solid white;
      color: white;
      font-size: 15px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
    .avatar {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 64px;
      cursor: pointer;
      overflow: hidden;
      transition: 0.4s all ease 0s; // 过渡动画
      img {
        height: 35px;
        transition: 0.4s all ease 0s; // 过渡动画
      }
    }
  }

  // logo块配置
  .headerDefault .logo {
    position: absolute;
    left: 20px;
    height: 72px;
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s all ease 0s; // 过渡动画
    //   border: 1px solid white;
    img {
      width: 150px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
  }
  .headerChange .logo {
    position: absolute;
    left: 20px;
    height: 50px;
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    //   border: 1px solid white;
    transition: 0.4s all ease 0s; // 过渡动画
    img {
      width: 100px;
      transition: 0.4s all ease 0s; // 过渡动画
    }
  }
  // 抽屉组件
  .header_drawer {
    // 模态框
    // &::v-deep(.el-overlay) {
    //   width: 80vw;
    //   z-index: 4 !important;
    // }
    // 整体
    user-select: none;
    &::v-deep(.el-drawer) {
      background-color: white;
      border-radius: 0 10px 10px 0;
    }
    // 标题
    &::v-deep(.el-drawer__header) {
      text-align: center;
      font-size: 1.5vw;
      color: black;
      // border: 1px solid white;
    }
    // 内容
    &::v-deep(.el-drawer__body) {
      padding: 0 5vw;
      color: black;
      font-size: 1vw;
    }
    // 各个div整体设置
    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // border: 1px solid white;
      margin: 2vw 0;
      padding-left: 3vw;
    }
    div:first-child {
      padding-left: 0;
    }
    .drawer_avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      // border: 1px solid white;
      .img_border {
        width: 6vw;
        height: 6vw;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        overflow: hidden;
        // border: 1px solid white;
      }
      img {
        height: 7vw;
      }
    }
    // 内部标签样式修改
    &::v-deep(.el-tag) {
      font-size: 0.8vw;
    }
    // .el-button {
    //   background-color: transparent;
    //   &:hover {
    //     color: #d9e3f4;
    //   }
    // }
  }
}
</style>
