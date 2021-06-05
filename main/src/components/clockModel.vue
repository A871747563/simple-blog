<template>
  <div class="clock">{{ hour }}:{{ minutes }}:{{ second }}</div>
</template>

<script>
import { displayTime } from 'utils/Clock.js'
import { ref, reactive } from 'vue'
export default {
  setup() {
    // 计时器
    const hour = ref('00')
    const minutes = ref('00')
    const second = ref('00')
    setInterval(() => {
      const time = displayTime()
      hour.value = time.hour
      minutes.value = time.minutes
      second.value = time.second
    }, 1000)
    return {
      hour,
      minutes,
      second
    }
  }
}
</script>

<style scoped lang="scss">
// .clock {
//   z-index: 0;
//   position: relative;
//   width: 100vw;
//   height: 100vh;
//   color: rgba(0, 0, 0, 0.503);
//   text-align: center;
//   line-height: 100vh;
//   // 字体自适应
//   font-size: 22vw;
//   font-weight: 1000;
//   // 禁止选择
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
// }
</style>
