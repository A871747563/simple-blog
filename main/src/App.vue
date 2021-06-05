<template>
  <div id="app" :class="theme">
    <router-view />
    <div class="clear"></div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    return {
      theme
    }
  }
}
</script>
>
<style lang="scss">
// 滚动条设置
#app.light {
  background-color: white;
}
#app.dark {
  background-color: #090c10;
}
.clear {
  clear: both;
}
body {
  // 主题色配置
  overflow: scroll;
  overflow-y: visible;
  overflow-x: hidden;
  // 修改滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
    height: 10px;
  }
  /*鼠标悬浮在滑块上时滑块的样式*/
  &::-webkit-scrollbar-thumb:hover {
    border-radius: 50px;
    background-color: #4c7ebb;
  }
  /*鼠标悬浮在非滚动条部分时滑块的样式*/
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: #4c7ebb;
  }
  /*鼠标悬浮在滚动条非滑块部分时滑块的样式*/
  &::-webkit-scrollbar-thumb {
    background-color: #4c7ebb;
  }
  /*正常时候的主干部分*/
  &::-webkit-scrollbar-track {
    background-color: #000;
  }

  /*鼠标悬浮在滚动条上的主干部分*/
  &::-webkit-scrollbar-track:hover {
    background-color: #000;
  }
}
</style>
