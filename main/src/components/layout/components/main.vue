<template>
  <div id="main" :class="theme">
    <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-if="!$route.meta.keepAlive" />
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

<style scoped>
#main.dark {
  height: 100vh;
}
#main.light {
  height: 100vh;
}
</style>
