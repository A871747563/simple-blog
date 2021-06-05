<template>
  <div id="layout" :class="theme">
    <Header />
    <Main />
    <!-- 回到顶部 -->
    <div>
      <el-backtop :visibility-height="backTop.visibilityHeight" :right="backTop.right" :bottom="backTop.bottom">
        <div class="backtop_inner">UP</div>
      </el-backtop>
    </div>
  </div>
</template>

<script>
import Header from './components/header'
import Main from './components/main'
import { useStore } from 'vuex'
import { reactive, computed } from 'vue'
export default {
  components: {
    Header,
    Main
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    // 回到顶部参数
    const backTop = reactive({
      target: '',
      visibilityHeight: 200,
      right: 40,
      bottom: 40
    })
    return {
      backTop,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#layout.dark {
  // 这样设置滚动条挡住了一部分，于是会出现x滚动条
  // 我们需要在body中把x滚动条隐藏
  width: 100vw;
  min-width: 1000px;
  // height: 100vh;
  // 设置相对定位，内部子元素浮动撑开高度
  position: relative;
  // 主题色配置
  // background-color: rgb(31, 33, 36);
  // overflow: hidden;
  // border: 1px solid black;
  .backtop_inner {
    width: 100%;
    background-color: #012840;
    box-shadow: #011826 0px 0px 6px;
    text-align: center;
    line-height: 40px;
    color: #c9d1d9;
    border-radius: 50px;
    z-index: 5;
    &:hover {
      color: #4ca1ec;
    }
  }
}
#layout.light {
  // 这样设置滚动条挡住了一部分，于是会出现x滚动条
  // 我们需要在body中把x滚动条隐藏
  width: 100vw;
  min-width: 1000px;
  position: relative;
  // .backtop_inner {
  //   width: 100%;
  //   background-color: #012840;
  //   box-shadow: #011826 0px 0px 6px;
  //   text-align: center;
  //   line-height: 40px;
  //   color: #c9d1d9;
  //   border-radius: 50px;
  //   z-index: 5;
  //   &:hover {
  //     color: #4ca1ec;
  //   }
  // }
}
</style>
