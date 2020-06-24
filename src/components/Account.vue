<template>
  <div id="account">
    <el-avatar icon="el-icon-user-solid" />
    <div v-if="!isLogin" class="go-login" @click="login">登录</div>
    <el-dropdown v-else>
      <span class="el-dropdown-link">
        {{ user }}<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item>播放记录</el-dropdown-item>
        <el-dropdown-item>我喜欢</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {}
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin
    },
    user() {
      return this.$store.getters.currentUser
    }
  },
  methods: {
    login() {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    logout() {
      window.localStorage.setItem('token', '')
      window.localStorage.setItem('user', 'guest')
      window.localStorage.setItem('userId', null)
      this.$store.commit('clearLoginStatus')
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style scoped lang="less">
  @import "style/index";
  #account{
    display: flex;
    align-items: center;
    line-height: @navBar-height;
    padding-left: 10px;
    padding-right: 10px;
  }
  .el-dropdown{
    margin-left: 20px;
    margin-right: 20px;
  }
  .el-dropdown-link {
    display: inline-block;
    cursor: pointer;
    color: white;
    height: @navBar-height;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .go-login{
    color: white;
    margin-left: 20px;
    margin-right: 20px;
    cursor: pointer;
  }
</style>
