<template>
  <div>
    <div id="selector-div">
      <el-collapse-transition>
        <div v-show="showSelector" class="selector-content">
          <my-selector @fatherFunc="getMsgFromSearch" />
        </div>
      </el-collapse-transition>
      <div class="selector-bottom">
        <el-button
          v-if="showSelector"
          icon="el-icon-arrow-up"
          type="success"
          @click="changeSelector"
        >
          隐藏筛选
        </el-button>
        <el-button
          v-else
          icon="el-icon-arrow-down"
          type="success"
          @click="changeSelector"
        >
          展开筛选
        </el-button>
      </div>
    </div>
    <div id="order-div">
      <div class="order-options">
        <el-radio-group v-model="orderBy" @change="changeOrder">
          <el-radio label="id">按默认排序</el-radio>
          <el-radio label="score">按评分排序</el-radio>
          <el-radio label="plays">按播放量排序</el-radio>
        </el-radio-group>
      </div>
      <div class="total-video-num">共 <b style="font-size: 20px;color: #e4393c">{{ videoCount }}</b> 部影片</div>
    </div>
    <div id="video-content">
      <VideoItem v-for="(item,index) in videoList" :key="index" :video="item" />
      <p /><p /><p /><p />
      <div v-if="showPage" class="pager">
        <el-pagination
          :current-page.sync="page"
          background
          :page-size="20"
          :pager-count="11"
          layout="prev, pager, next"
          :total="videoCount"
          @current-change="currentPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>

const VideoItem = () => import('components/VideoItem')
const MySelector = () => import('components/MySelector')

import { getAllVideos, getAllVideosOnGenre, getAllVideosOnActor } from 'network/home'
export default {
  name: 'VideoList',
  components: {
    VideoItem,
    MySelector
  },
  data() {
    return {
      poMap: { 'seagate_cdl': '1', 'seagate_zxh': '2', 'west_data_1T': '3', 'west_data_500g': '4' },
      orderBy: 'id',
      videoList: [],
      videoCount: 0,
      showSelector: false,
      page: 1,
      showPage: true
    }
  },
  watch: {
    'videoList': function() {
      this.$nextTick(function() {
        const that = document.getElementsByClassName('container')[0]
        setTimeout(() => {
          that.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 100)
      })
    },
    '$store.state.showSelector': function() {
      this.showSelector = this.$store.state.showSelector
    },
    $route(to) {
      if (to.path === '/video/list') {
        this.orderBy = this.$route.query.orderBy || 'id'
        this.getInfo(to.query)
        this.page = parseInt(this.$route.query.page) || 1
        this.reloadPagination()
      }
    },
    '$store.state.token': function() {
      this.$store.commit('initParams')
      this.getVideos(this.$store.state.params)
    }
  },
  created() {
    const queryData = JSON.parse(JSON.stringify(this.$route.query))
    this.$store.commit('changeParams', queryData)
    this.page = parseInt(this.$route.query.page) || 1
    this.orderBy = this.$route.query.orderBy || 'id'
    this.getInfo(this.$route.query)
  },
  methods: {
    reloadPagination() {
      this.showPage = false
      this.$nextTick(() => (this.showPage = true))
    },
    changeSelector() {
      this.showSelector = !this.showSelector
      this.$store.commit('changeSelector')
    },
    getInfo(query) {
      if (typeof (query.genre) === 'string') {
        getAllVideosOnGenre(query).then(res => {
          this.videoList = res.data
          this.videoCount = res.count
          if (!res.userId) {
            this.resetLoginStatus()
          }
        }).catch(() => {
          this.videoList = []
          this.videoCount = 0
        })
      } else if (typeof (query.actor) === 'string') {
        getAllVideosOnActor(query).then(res => {
          this.videoList = res.data
          this.videoCount = res.count
          if (!res.userId) {
            this.resetLoginStatus()
          }
        }).catch(() => {
          this.videoList = []
          this.videoCount = 0
        })
      } else {
        getAllVideos(query).then(res => {
          this.videoList = res.data
          this.videoCount = res.count
          if (!res.userId) {
            this.resetLoginStatus()
          }
        }).catch(() => {
          this.videoList = []
          this.videoCount = 0
        })
      }
    },
    resetLoginStatus() {
      window.localStorage.setItem('token', '')
      window.localStorage.setItem('user', 'guest')
      window.localStorage.setItem('userId', null)
      this.$store.commit('clearLoginStatus')
    },
    changeOrder(label) {
      this.$store.commit('changePage', 1)
      this.page = 1
      this.$store.commit('changeOrderBy', label)
      this.orderBy = label
      this.getVideos(this.$store.state.params)
    },
    getMsgFromSearch(sonParams) {
      const tmp = []
      for (const val of sonParams.position) {
        tmp.push(this.poMap[val])
      }
      this.$store.commit('changePosition', tmp)
      this.$store.commit('changePage', 1)
      this.page = 1
      this.getVideos(this.$store.state.params)
    },
    currentPageChange(page) {
      this.$store.commit('changePage', page)
      this.getVideos(this.$store.state.params)
    },
    getVideos(params) {
      this.$router.push({ path: '/video/list', query: params })
    }
  }
}
</script>

<style scoped>
  #selector-div{
    background: url(~assets/img/bg.jpg) repeat;
  }
  .selector-content{
    padding-top: 10px;
    padding-bottom: 10px;
    width: 80%;
    margin: 0 auto;
  }
  .selector-bottom{
    width: 100%;
    background-color: #fffce7;
    position: relative;
    height: 20px;
  }
  .selector-bottom button{
    padding: 2px 4px 2px 4px;
    position: absolute;
    top: 0;
    left: 50%;
    border-radius: 0 0 9px 9px;
    transform: translate(-50%,0);
  }
  #order-div{
    width:80%;
    margin: 0 auto;
    text-align: left;
    position: relative;
    height: 45px;
  }
  .order-options{
    display: inline-block;
    margin-left: 25px;
    position: absolute;
    bottom: 5px;
  }
  #video-content{
    width:80%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  #video-content p{
    width: 175px;
    margin-right: 20px;
    margin-left: 20px;
  }
  .pager{
    margin: 30px;
    width: 100%;
    text-align: center;
  }
  .total-video-num{
    font-size: 15px;
    position: absolute;
    right: 30px;
    bottom: 2px;
    display: inline-block;
  }
</style>
