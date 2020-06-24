<template>
  <div id="layout">
    <div class="header">
      <NavBar />
    </div>
    <div class="container">
      <keep-alive :exclude="['VideoDetail']"><router-view /></keep-alive>
    </div>
  </div>
</template>

<script>
const NavBar = () => import('./components/NavBar')
export default {
  name: 'Layout',
  components: {
    NavBar
  },
  data() {
    return {}
  },
  watch: {
    $route(to) {
      const that = document.getElementsByClassName('container')[0]
      setTimeout(() => {
        that.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }, 100)
    }
  }
}
</script>

<style lang="less">
  @import "../assets/css/base.css";
  @import "../style/index";
  .header{
    height: @navBar-height;
    width: 100%;
  }
  .container{
    width: 100%;
    position: absolute;
    top: @navBar-height;
    bottom: 0;
    overflow: scroll;
    background-color: #fffce7;
  }
</style>
