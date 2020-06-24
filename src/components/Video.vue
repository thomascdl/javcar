<template>
  <div class="video-area">
    <div class="title" />
    <video-player
      ref="videoPlayer"
      class="video-player vjs-custom-skin"
      :options="playerOptions"
      :playsinline="true"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"

      @statechanged="playerStateChanged($event)"
      @ready="playerReadied"
    />
  </div>

</template>

<script>
// Similarly, you can also introduce the plugin resource pack you want to use within the component
// import 'some-videojs-plugin'
export default {
  name: 'VideoPlay',
  data() {
    return {
      playerOptions: {
        // videojs options
        muted: false,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'http://192.168.0.6:8001/play/video/?url=' + this.$route.query.url
        }],
        poster: '/static/images/author.jpg',
        preload: 'auto',
        loop: false,
        autoplay: true,
        aspectRatio: '16:9',
        fluid: true,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
    // videoSrc(){
    //   return "http://192.168.0.6:8001/play/video/?url=" + this.$route.query.url
    // }
  },
  mounted() {
    const p = this.player
    document.onkeydown = function(e) {
      const vol = 0.1 // 1代表100%音量，每次增减0.1
      const time = 10 // 单位秒，每次增减10秒
      // 按向上键
      if (e.keyCode === 38) {
        p.cache_.lastVolume !== 1 ? p.cache_.lastVolume += vol : 1
        p.volume(p.cache_.lastVolume)
      }
      // 按向下键
      if (e.keyCode === 40) {
        p.cache_.lastVolume !== 0 ? p.cache_.lastVolume -= vol : 1
        p.volume(p.cache_.lastVolume)
      }
      // 按左键
      if (e.keyCode === 37) {
        console.log(p)
        p.cache_.currentTime !== 0 ? p.cache_.currentTime -= time : 1
        console.log(p.cache_.currentTime)
        p.currentTime(p.cache_.currentTime)
      }
      // 按右键
      if (e.keyCode === 39) {
        console.log(p)
        p.cache_.currentTime !== p.cache_.duration ? p.cache_.currentTime += time : 1
        p.currentTime(p.cache_.currentTime)
      }
    }
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>

<style scoped>
  .title{
    height:50px
  }

  .video-player{
    margin: 0 auto;
    width: 800px;
    height: 450px
  }

</style>
