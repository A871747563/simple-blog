<template>
  <div id="text" class="change" :class="theme"></div>
</template>

<script>
import { onMounted, computed, ref, onUnmounted, watch, onActivated, onDeactivated } from 'vue'
import { printer } from 'utils/Printer'
import { useStore } from 'vuex'
export default {
  // 父子传参
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    // text 数据(方便实现js事件的双向绑定)
    const text = computed(() => {
      return props.text
    })
    // 定时器存储，方便后续清除
    const temp1 = ref('')
    const temp2 = ref('')
    // 一般策略
    onMounted(() => {
      // 开启焦点闪烁
      if (!temp1.value && !temp2.value) {
        temp1.value = setInterval(() => {
          const text = document.getElementById('text')
          if (text.getAttribute('class').indexOf('change') === -1) {
            // 不含change类名
            text.setAttribute('class', `change ${theme.value}`)
          } else {
            text.setAttribute('class', `${theme.value}`)
          }
        }, 500)
        // 监听器
        watch(
          text,
          (newValue) => {
            // 开启打印
            // 一旦监听到数据变化就清除定时器，重新开一个
            clearInterval(temp2.value)
            temp2.value = printer(newValue, 'text', 40)
          },
          {
            // 首次渲染就执行
            immediate: true
          }
        )
      }
    })
    onUnmounted(() => {
      // 组件销毁时清除定时器
      clearInterval(temp1.value)
      clearInterval(temp2.value)
      temp1.value = ''
      temp2.value = ''
    })
    // 缓存策略
    onActivated(() => {
      // 开启焦点闪烁
      if (!temp1.value && !temp2.value) {
        temp1.value = setInterval(() => {
          const text = document.getElementById('text')
          if (text.getAttribute('class').indexOf('change') === -1) {
            // 不含change类名
            text.setAttribute('class', `change ${theme.value}`)
          } else {
            text.setAttribute('class', `${theme.value}`)
          }
        }, 500)
        // 监听器
        watch(
          text,
          (newValue) => {
            // 开启打印
            // 一旦监听到数据变化就清除定时器，重新开一个
            clearInterval(temp2.value)
            temp2.value = printer(newValue, 'text', 40)
          },
          {
            // 首次渲染就执行
            immediate: true
          }
        )
      }
    })
    onDeactivated(() => {
      // 组件销毁时清除定时器
      clearInterval(temp1.value)
      clearInterval(temp2.value)
      temp1.value = ''
      temp2.value = ''
    })
    return {
      theme
    }
  }
}
</script>

<style scpoed lang="scss">
#text.dark {
  font-weight: 800;
  color: white;
  user-select: none;
  &::after {
    content: '|';
  }
}
#text.light {
  font-weight: 800;
  color: black;
  user-select: none;
  &::after {
    content: '|';
  }
}
// 交替变化类名
#text.change {
  &::after {
    content: '|';
    opacity: 0;
  }
}
</style>
