<template>
  <div id="actor" @click="searchOnActor(actor.name)">
    <div id="imgDiv">
      <el-image
        v-if="actor.img"
        style="width:125px;height:125px"
        :src="actor.img"
        :lazy="true"
        fit="fill"
      />
      <div class="mask1" />
    </div>
    <div id="text-area">
      <span class="name">{{ actor.name|limitText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActorItem',
  filters: {
    limitText: function(text) {
      if (!text) {
        return ''
      }
      if (text.length > 6) {
        return text.slice(0, 6) + '..'
      }
      return text
    }
  },
  props: {
    actor: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    searchOnActor(item) {
      this.$store.commit('initParams')
      this.$store.commit('changeActor', item)
      this.$router.push({ path: '/video/list', query: this.$store.state.params })
    }
  }
}
</script>

<style scoped>
  #actor{
    margin: 10px 20px 10px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  #actor #imgDiv{
    font-size: 0;
    width: 125px;
    height: 125px;
    position: relative;
  }
  #actor #text-area{
    padding: 4px;
    line-height: 24px;
    text-align: center;
    font-size: 15px;
    border-top: 1px solid #d9d9bd;
    background-color: #f8f8f8;
  }
  .name{
    text-align: center;
    cursor: pointer;
  }
  .name:hover {
    color: #337ab7;
  }
  #imgDiv:hover .mask1{
    content: '';
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 200;
    bottom: 0;
    left: 0;
  }
</style>

