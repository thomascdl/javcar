<template>
  <div id="NavBar">
    <div id="logo">LOGO</div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">影片中心</el-menu-item>
      <el-menu-item index="2">演员列表</el-menu-item>
      <el-menu-item index="3">订单管理</el-menu-item>
    </el-menu>
    <el-input
      v-model="input"
      class="NavBar-input"
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      @keyup.enter.native="submit"
    />
    <div id="account"><Account /></div>
  </div>
</template>

<script>
const Account = () => import('components/Account')
export default {
  name: 'NavBar',
  components: {
    Account
  },
  data() {
    return {
      activeIndex: '1',
      input: '',
      params: {}
    }
  },
  watch: {
    $route(to, from) {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.input = this.$route.query.fh || ''
      if (this.$route.path === '/actor/list') {
        this.activeIndex = '2'
      } else {
        this.activeIndex = '1'
      }
    },
    handleSelect(key) {
      if (key === '1') {
        if (this.$route.path !== '/video/list') {
          this.$router.push({ path: '/video/list', query: this.$store.state.params })
        } else {
          this.$store.commit('initParams')
          this.$router.push({ path: '/video/list', query: this.$store.state.params })
        }
      }
      if (key === '2') {
        this.$router.push({ path: '/actor/list', query: { page: '1' }})
      }
    },
    submit() {
      this.$store.commit('initParams')
      this.$store.commit('changeFh', this.input)
      this.$router.push({ path: '/video/list', query: this.$store.state.params })
    }
  }
}
</script>

<style scoped>
  #NavBar{
    display: flex;
    height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #545c64;
    align-items: center;
    min-width: 1100px;
  }
  #NavBar #logo {
    height: 60px;
    width: 10%;
    color: white;
    font-size: 30px;
    text-align: center;
  }
  #NavBar #account{
    margin-left: auto;
  }
  .el-menu{
    height:60px;
    line-height: 60px;
  }
  .NavBar-input {
    width:300px;
    margin-left: 30px;
  }
</style>

<style>
  .NavBar-input input{
    border-radius: 20px;
    font-size: 16px;
  }
</style>
