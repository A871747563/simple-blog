<template>
  <div id="Login">
    <Particles id="tsparticles" :options="settingLogin" />
    <!-- <clock-model /> -->
    <div class="login_logo">
      <img src="@/assets/image/logo.png" alt="" />
    </div>
    <transition
      class="transAnima"
      mode="out-in"
      enter-active-class="animate__animated animate__bounceInLeft"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <register-model v-if="!islogin" />
    </transition>
    <transition
      class="transAnima"
      mode="out-in"
      enter-active-class="animate__animated animate__bounceInLeft"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <login-model v-if="islogin" />
    </transition>
  </div>
</template>

<script>
import { settingLogin } from 'api/setting.js'
import { computed } from 'vue'
import { useStore } from 'vuex'
import RegisterModel from './components/registerModel'
import LoginModel from './components/loginModel'
export default {
  components: {
    RegisterModel,
    LoginModel
    // ClockModel
  },
  setup() {
    const store = useStore()
    const islogin = computed(() => {
      return store.getters['login/getIslogin']
    })
    return {
      settingLogin,
      islogin
    }
  }
}
</script>

<style scoped lang="scss">
#Login {
  .transAnima {
    animation-duration: 0.5s;
    animation-delay: 0s;
    animation-iteration-count: 1;
  }
  // 背景样式
  #tsparticles {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    &::after {
      background-image: url('../../assets/image/login-back.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center;
      content: '';
      opacity: 1;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
    }
  }
  .login_logo {
    position: absolute;
    left: 50px;
    top: 50px;
    // border: 1px solid white;
    height: 50px;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 180px;
    }
  }
}
</style>
