<template>
  <div id="UserEdit" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition
            class="animate_bin"
            enter-active-class="animate__animated animate__bounceInDown"
            leave-active-class="animate__animated animate__bounceOutUp"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script>
// 打印机组件
import Printer from 'components/Printer'
import { onMounted, onUnmounted, computed, onActivated, onDeactivated } from 'vue'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { useStore } from 'vuex'
export default {
  components: {
    Printer
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    // dom挂载完毕
    onMounted(() => {
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
      data: '修改个人信息',
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#UserEdit.dark {
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
    width: 35%;
    height: 500px; // 子盒子撑开父元素高度
    margin-bottom: 150px;
    background-color: transparent;
    position: relative;
    // border: 1px solid white;
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
      background-image: url('../../assets/image/dark2.jpg');
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
  .animate_bin {
    animation-duration: 1.5s;
    animation-delay: 0;
    animation-iteration-count: 1;
  }
}
#UserEdit.light {
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
    width: 35%;
    height: 500px; // 子盒子撑开父元素高度
    margin-bottom: 150px;
    background-color: transparent;
    position: relative;
    // border: 1px solid white;
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
      background-image: url('../../assets/image/light2.jpg');
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
  .animate_bin {
    animation-duration: 1.5s;
    animation-delay: 0;
    animation-iteration-count: 1;
  }
}
</style>
