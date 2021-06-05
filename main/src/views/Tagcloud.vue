<template>
  <div id="Tagcloud" :class="theme">
    <div class="cover">
      <div><Printer :text="data" /></div>
    </div>
    <div class="main">
      <div class="content">
        <el-empty v-if="dataArray === ''" description="无数据" :image-size="250" />
        <div>
          <span v-for="(item, index) in dataArray" :key="index" :class="index">{{ `${index}(${item})` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 打印机组件
import { useStore } from 'vuex'
import Printer from 'components/Printer'
import { onMounted, onUnmounted, ref, computed, onUpdated, onActivated, onDeactivated } from 'vue'
import { startEvent, endEvent } from 'utils/ScrollEvent'
import { CloudAxios } from 'utils/request/requestInfo.js'
import { notify } from 'utils/element-util'
export default {
  components: {
    Printer
  },
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const dataArray = ref('')
    // 发送请求获取词云数据
    const getCloudData = () => {
      CloudAxios()
        .then(
          (res) => {
            dataArray.value = res.data.data
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
    // dom数据更新后执行
    onUpdated(() => {
      tagsColor()
    })
    const tagsColor = () => {
      // 定义几个分段颜色
      const color1 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      const color2 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      const color3 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      const color4 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      const color5 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      const color6 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      const color7 = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`
      for (var index in dataArray.value) {
        if (dataArray.value[index] < 10) {
          document.getElementsByClassName(index)[0].style.fontSize = `6px`
          document.getElementsByClassName(index)[0].style.color = color1
        } else if (dataArray.value[index] < 20) {
          document.getElementsByClassName(index)[0].style.fontSize = `12px`
          document.getElementsByClassName(index)[0].style.color = color2
        } else if (dataArray.value[index] < 30) {
          document.getElementsByClassName(index)[0].style.fontSize = `18px`
          document.getElementsByClassName(index)[0].style.color = color3
        } else if (dataArray.value[index] < 40) {
          document.getElementsByClassName(index)[0].style.fontSize = `24px`
          document.getElementsByClassName(index)[0].style.color = color4
        } else if (dataArray.value[index] < 50) {
          document.getElementsByClassName(index)[0].style.fontSize = `30px`
          document.getElementsByClassName(index)[0].style.color = color5
        } else if (dataArray.value[index] < 60) {
          document.getElementsByClassName(index)[0].style.fontSize = `36px`
          document.getElementsByClassName(index)[0].style.color = color6
        } else {
          document.getElementsByClassName(index)[0].style.fontSize = `42px`
          document.getElementsByClassName(index)[0].style.color = color7
        }
      }
    }
    onMounted(() => {
      // 简单的词云图配置(简单粗暴，后面再来优化)
      getCloudData()
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
      data: '标签页',
      dataArray,
      theme
    }
  }
}
</script>
<style scoped lang="scss">
#Tagcloud.dark {
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
    width: 65%;
    min-height: 500px;
    margin-bottom: 150px;
    background-color: #011826;
    position: relative;
    // border: 1px solid white;
    > div {
      // border: 1px solid white;
      user-select: none;
      margin: 8% 10%;
      overflow: hidden;
      clear: both;
      padding: 10px;
      span {
        color: #4ca1ec;
        font-weight: 800;
        display: block;
        float: left;
        padding: 0 15px 15px 15px;
        margin: 10px;
        // border: 1px solid white;
      }
    }
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
      background-image: url('../assets/image/dark2.jpg');
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
}
#Tagcloud.light {
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
    width: 65%;
    min-height: 500px;
    margin-bottom: 150px;
    background-color: white;
    position: relative;
    box-shadow: 0px -2px 5px #333333;
    // border: 1px solid white;
    > div {
      // border: 1px solid white;
      user-select: none;
      margin: 8% 10%;
      overflow: hidden;
      clear: both;
      padding: 10px;
      span {
        color: black;
        font-weight: 800;
        display: block;
        float: left;
        padding: 0 15px 15px 15px;
        margin: 10px;
        // border: 1px solid white;
      }
    }
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
      background-image: url('../assets/image/light2.jpg');
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
}
</style>
