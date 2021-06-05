<template>
  <div id="P404" :class="theme">
    <span>404</span>
    <Particles id="tsparticles" :options="setting404" />
  </div>
</template>

<script>
import { setting404 } from 'api/setting'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    return {
      setting404,
      theme
    }
  }
}
</script>

<style scoped lang="scss">
#P404.dark {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #090c10;
  z-index: 0;
  overflow: hidden;
  > span {
    z-index: 1;
    user-select: none;
    position: absolute;
    // border: 1px solid white;
    font-size: 65px;
    color: #c9d1d9;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #tsparticles {
      position: relative;
      z-index: 2;
    }
  }
}
#P404.light {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #768fba;
  z-index: 0;
  overflow: hidden;
  > span {
    z-index: 1;
    user-select: none;
    position: absolute;
    // border: 1px solid white;
    font-size: 65px;
    color: black;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #tsparticles {
      position: relative;
      z-index: 2;
    }
  }
}
</style>
