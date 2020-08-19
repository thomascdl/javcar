<template>
  <div class="container2">
    <div id="order-div">
      <div class="total-video-num">共 <b style="font-size: 20px;color: #e4393c">{{ count }}</b> 位演员</div>
    </div>
    <div class="actor-content">
      <ActorItem v-for="(item,index) in actorList" :key="index" :actor="item" />
      <p /><p /><p /><p /><p /><p />
      <div class="pager">
        <el-pagination
          :current-page.sync="page"
          background
          :page-size="70"
          :pager-count="11"
          layout="prev, pager, next"
          :total="count"
          @current-change="currentPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
const ActorItem = () => import('components/ActorItem')
import { getActorInfo } from 'network/actor'
export default {
  name: 'Actor',
  components: {
    ActorItem
  },
  data() {
    return {
      actorList: [],
      count: 0,
      page: 1
    }
  },
  watch: {
    $route(to) {
      if (to.path === '/actor/list') {
        this.loadPage(to.query)
      }
    },
    'actorList': function() {
      this.$nextTick(function() {
        const that = document.getElementsByClassName('container')[0]
        setTimeout(() => {
          that.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 100)
      })
    }
  },
  created() {
    this.loadPage(this.$route.query)
  },
  methods: {
    loadPage(query) {
      this.page = parseInt(query.page || 1)
      this.getInfo(this.page)
    },
    currentPageChange(page) {
      this.$router.push({ path: '/actor/list', query: { page: page }})
    },
    getInfo(page) {
      getActorInfo(page).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.count = res.count
          this.actorList = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
  .container2 {
    width: 90%;
    margin: 0 auto;
  }
  .actor-content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  .actor-content p{
    width: 125px;
    margin-right: 20px;
    margin-left: 20px;
  }
  .pager{
    margin: 30px;
    width: 100%;
    text-align: center;
  }
  #order-div{
    margin: 0 auto;
    position: relative;
    height: 45px;
  }
  .total-video-num{
    font-size: 15px;
    position: absolute;
    right: 30px;
    bottom: 2px;
    display: inline-block;
  }
</style>
