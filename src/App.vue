<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  created() {
    // 初始化登录状态
    if (localStorage.getItem('token')) {
      this.$store.commit('initLoginStatus')
    }

    // 在页面刷新时将sessionStorage里的信息载入
    // if (sessionStorage.getItem("store") ) {
    //   this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    // }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // window.addEventListener("beforeunload",()=>{
    //   sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    // });
  }
}
</script>
