<template>
  <div id="video">
    <div id="imgDiv" v-popover:popover @click="goToVideoDetail(video.id)">
      <el-image
        style="width:175px;height:238px"
        :src="video.simg"
        fit="fill"
      />
      <div class="mask" />
      <div class="play" @click.stop="playVideo(video.url,video.id)" />
      <div class="length-div"><span>{{ video.length | toTime }}</span></div>
      <div v-if="video.hasSubtitle === '1'" class="zimu">
        <el-image
          style="width:60px;height:60px"
          :src="zimuUrl"
          fit="fill"
          :lazy="true"
        />
      </div>
    </div>
    <div id="text-area">
      <p class="fh" @click="goToVideoDetail(video.id)">{{ video.fh|limitText }}</p>
      <Icon v-if="!like&&userId" type="md-heart-outline" class="heart" size="20" @click="likeAction(video.id)" />
      <Icon v-if="like&&userId" type="md-heart" color="red" class="heart" size="20" @click="likeAction(video.id)" />
      <p class="pf">{{ video.score }}</p>
    </div>
    <el-popover
      ref="popover"
      v-model="visible"
      popper-class="my-pop"
      :open-delay="openDelay"
      placement="right"
      width="320"
      trigger="hover"
    >
      <div>
        <div class="title" @click="goToVideoDetail(video.id)">{{ video.title }}</div>
        <div v-if="userId" class="rate">
          <MyRate
            v-model="mark"
            show-score
            text-color="#ff9900"
            allow-half
            @change="change"
          />
        </div>
        <div class="small-title">标签：</div>
        <span><el-tag
          v-for="item in (video.genre||' ').split(',')"
          :key="item"
          type="success"
          size="mini"
          class="tag"
          @click="searchOnGenre(item)"
        >{{ item }}</el-tag></span>
        <div class="small-title">演员：</div>
        <span v-if="video.avers">
          <el-tag
            v-for="item in (video.avers||' ').split(',')"
            :key="item"
            size="mini"
            class="tag"
            @click="searchOnActor(item)"
          >{{ item }}</el-tag>
        </span>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { startPlay } from 'network/video-item'
import { likeTheVideo, scoreTheVideo } from 'network/video-item'
const MyRate = () => import('components/MyRate')
export default {
  name: 'VideoItem',
  components: {
    MyRate
  },
  filters: {
    toTime: function(value) {
      const hour = Math.floor(value / 60)
      let min = value % 60
      if (min < 10) {
        min = '0' + min
      }
      return hour + ':' + min
    },
    limitText: function(text) {
      if (!text) { return '' }
      if (text.length > 10) {
        return text.slice(0, 10) + '..'
      }
      return text
    }
  },
  // props: ['video'],
  props: {
    video: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      zimuUrl: require('assets/img/zimu.png'),
      visible: false,
      openDelay: 500,
      params: {},
      like: this.video.scoreDetail['islike'],
      mark: this.video.scoreDetail.mark / 2 || 0
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  methods: {
    change(score) {
      scoreTheVideo(this.$store.getters.userId, this.video.id, score * 2).then(res => {
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
    playVideo(url, id) {
      startPlay(url, id)
    },
    likeAction(videoId) {
      this.like = !this.like
      likeTheVideo(this.$store.getters.userId, videoId, this.like).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data) {
            this.$message('收藏成功！')
          } else {
            this.$message('取消收藏成功！')
          }
        } else {
          this.like = !this.like
          this.$message(res.error)
        }
      }).catch(() => {
        this.like = !this.like
        this.$message('操作失败！')
      })
    },
    goToVideoDetail(id) {
      this.$router.push({ name: 'video-detail', params: { id: id }})
    },
    searchOnGenre(item) {
      this.$store.commit('initParams')
      this.$store.commit('changeGenre', item)
      this.$router.push({ path: '/video/list', query: this.$store.state.params })
    },
    searchOnActor(item) {
      this.$store.commit('initParams')
      this.$store.commit('changeActor', item)
      this.$router.push({ path: '/video/list', query: this.$store.state.params })
    }
  }
}
</script>

<style scoped>
  #video{
    margin-top: 10px;
    margin-right: 20px;
    margin-left: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  #video #imgDiv{
    font-size:0;
    height: 238px;
    width: 175px;
    position: relative;
  }
  #video #text-area{
    line-height: 40px;
    height: 40px;
    font-size: 16px;
    background-color: #f8f8f8;
  }
  .rate{
    font-weight: bold;
    position: relative;
    left: 100px;
    margin-bottom: 5px;
  }
  .pf{
    color: #ff6200;
    font-size: 22px;
    float:right;
    margin-right: 7px;
  }
  .fh{
    color: #222;
    float: left;
    margin-left: 7px;
    cursor: pointer;
  }
  .fh:hover{
    color: #ff6200;
  }
  .heart{
    float: left;
    margin-left: 3px;
    position: relative;
    top: 9px;
    cursor: pointer;
  }
  .tag{
    margin-left: 5px;
    margin-bottom: 3px;
    cursor: pointer;
  }
  #imgDiv:hover .mask{
    content: '';
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  #imgDiv:hover .play{
    position: absolute;
    width: 32px;
    height: 32px;
    right: 10px;
    bottom: 10px;
    background: url(~assets/img/play.png) no-repeat 0 0;
    cursor: pointer;
    z-index: 22;
  }
  .play:hover{
    position: absolute;
    width: 32px;
    height: 32px;
    right: 10px;
    bottom: 10px;
    background: url(~assets/img/play.png) no-repeat -40px 0 !important;
    cursor: pointer;
    z-index: 22;
  }
  .length-div{
    height: 18px;
    width: 40px;
    position: absolute;
    left: 5px;
    bottom: 5px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    text-align: center;
    color: white;
    line-height: 18px;
    font-size: 12px;
    font-weight: bolder;
  }
  .zimu{
    position: absolute;
    left: 4px;
    top: 0;
    z-index: 23;
    width: 60px;
    height: 60px;
  }
  .title{
    padding: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .title:hover{
    color: #e4393c;
  }
  .small-title{
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 5px;
  }
</style>

<!--<style>-->
<!--  /*.my-pop {*/-->
<!--  /*  background-color: #f8f8f8;*/-->
<!--  /*}*/-->
<!--</style>-->
