<template>
  <div class="container1">
    <div v-if="videoInfo.video !== undefined" class="title">{{ videoInfo.video.title }}</div>
    <div class="info">
      <div class="img">
        <el-image
          v-if="videoInfo.bimg"
          style="width:100%"
          :src="videoInfo.bimg"
          fit="fill"
        />
      </div>
      <div class="detail">
        <div v-if="videoInfo.video !== undefined" class="detail-option"><b>番号：</b>{{ videoInfo.video.fh }}</div>
        <div v-if="userId" class="rate">
          <b>评分：</b><MyRate
            :value="mark"
            show-score
            class="my-rate"
            text-color="#ff9900"
            allow-half
            @change="change"
          />
        </div>
        <div v-if="videoInfo.video !== undefined" class="detail-option"><b>时长：</b>{{ videoInfo.video.length }}分钟</div>
        <div class="detail-option"><b>导演：</b>{{ videoInfo.director }}</div>
        <div class="detail-option"><b>发行日期：</b>{{ videoInfo.release_date }}</div>
        <div class="detail-option"><b>制作商：</b>{{ videoInfo.maker }}</div>
        <div v-if="videoInfo.series" class="detail-option"><b>系列：</b>{{ videoInfo.series }}</div>
        <div v-if="videoInfo.video !== undefined" class="detail-option">
          <b>标签：</b>
          <span v-for="(item,index) in (videoInfo.video.genre||' ').split(',')" :key="index" class="tag" @click="searchOnGenre(item)">{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="play-div" @click="playVideo(videoInfo.video.url)">
      在线播放
    </div>
    <div class="actor-title">演员列表</div>
    <div class="actor-content">
      <ActorItem v-for="(item,index) in videoInfo.actors" :key="index" :actor="item" />
      <p /><p /><p /><p /><p /><p /><p /><p />
    </div>
    <div v-if="videoFive.length !== 0" class="actor-title">相关影片</div>
    <div class="video-content">
      <VideoItem v-for="(item,index) in videoFive" :key="index" :video="item" />
      <p /><p /><p /><p /><p /><p />
    </div>
  </div>
</template>

<script>
const MyRate = () => import('components/MyRate')
import { startPlay } from 'network/video-item'
const ActorItem = () => import('components/ActorItem')
const VideoItem = () => import('components/VideoItem')
import { scoreTheVideo } from 'network/video-item'
import { getVideoInfo, getRandomVideo } from 'network/video-detail'
export default {
  name: 'VideoDetail',
  components: {
    ActorItem,
    VideoItem,
    MyRate
  },
  data() {
    return {
      videoInfo: '',
      videoFive: [],
      mark: 0
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  watch: {
    $route() {
      this.getInfo()
      this.getRelativeVideo()
    },
    'videoFive': function() {
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
    this.getInfo()
    this.getRelativeVideo()
  },
  methods: {
    playVideo(url) {
      startPlay(url)
    },
    change(score) {
      scoreTheVideo(this.$store.getters.userId, this.videoInfo.video.id, score * 2).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.mark = score
          this.$message('评分成功！')
        } else {
          this.$message('评分失败！')
        }
      }).catch(() => {
        this.$message('评分失败！')
      })
    },
    searchOnGenre(item) {
      this.$store.commit('initParams')
      this.$store.commit('changeGenre', item)
      this.$router.push({ path: '/video/list', query: this.$store.state.params })
    },
    getRelativeVideo() {
      const id = this.$route.params.id
      getRandomVideo(id).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.videoFive = res.data
        }
      })
    },
    getInfo() {
      const id = this.$route.params.id
      getVideoInfo(id).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.videoInfo = res.data
          this.mark = this.videoInfo.video.scoreDetail.mark / 2 || 0
        }
      })
    }
  }
}
</script>

<style scoped>
  .play-div{
    width: 50%;
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
    text-align: center;

    background-image: linear-gradient(to bottom,#337ab7 0,#265a88 100%);
    background-repeat: repeat-x;
    border-color: #245580;

    text-shadow: 0 -1px 0 rgba(0,0,0,.2);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 1px rgba(0,0,0,.075);

    color: #fff;
    font-size: 18px;
    line-height:2;
    border-radius: 6px;
    margin-top: 20px;
    cursor: pointer;
  }
  .play-div:hover{
    background-color: #265a88;
    background-position: 0 -15px;
  }
  .container1 {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 20px;
  }
  .title{
    padding-top: 20px;
    padding-bottom: 10px;
    text-align: left;
    font-size: 24px;
  }
  .info{
    width: 100%;
    padding: 15px 0;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .img{
    flex-grow: 1;
    padding: 0 15px;
    width: 800px;
    border-right: 2px solid #E1E1E1;
  }
  .detail{
    width: 300px;
    font-size: 18px;
    padding: 0 15px;
    flex-grow: 1;
  }
  .detail-option{
    height: auto;
    line-height: 40px;
  }
  .tag{
    cursor: pointer;
    background-color: #eb9316;
    opacity: .65;
    text-shadow: 0 -1px 0 rgba(0,0,0,.2);
    padding: 1px 5px;
    font-size: 13px;
    line-height: 1.7;
    border-radius: 3px;
    color: #fff;
    display: inline-block;
    margin-right: 5px;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #eea236;

  }
  .actor-title{
    font-size: 20px;
    margin-top: 20px;
    line-height: 60px;
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
  .video-content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .video-content p{
    width: 175px;
    margin-right: 20px;
    margin-left: 20px;
  }
  .rate{
    font-weight: bold;
  }
  .my-rate{
    display: inline-block;
    position: relative;
    top:-2px;
  }

</style>
