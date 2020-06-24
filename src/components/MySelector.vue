<template>
  <div id="selector">
    <div v-for="(value,key,index) in selectInfo" :key="index" class="s-row">
      <div class="row-key">
        <span>{{ trans[key] }}：</span>
      </div>
      <div class="row-val">
        <ul>
          <li
            v-for="(item,myIndex) in value"
            :key="myIndex"
            :class="{active:myChoice[key].indexOf(item)!==-1}"
            @click="addToChoice(key,item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <div class="s-row">
      <div class="row-key">
        <span>您的选择：</span>
      </div>
      <div class="row-val">
        <ul>
          <span v-for="(value,key,index) in myChoice" :key="index">
            <el-tag
              v-if="value.length !== 0"
              closable
              type="success"
              effect="dark"
              class="tag"
              size="mini"
              @close="rmFromChoice(key)"
            >
              {{ trans[key] }}：{{ value.join(', ') }}
            </el-tag>
          </span>
        </ul>
      </div>
      <div class="row-ext">
        <el-button type="danger" size="mini" class="clear-button" @click="deleteAll">清空</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MySelector',
  data() {
    return {
      poMap: { '1': 'seagate_cdl', '2': 'seagate_zxh', '3': 'west_data_1T', '4': 'west_data_500g' },
      selectInfo: {
        'score': ['0-6', '6-8', '8-10'],
        'up': [2, 4, 6, 8],
        'position': ['seagate_cdl', 'seagate_zxh', 'west_data_1T', 'west_data_500g']
      },
      myChoice: { 'score': [], 'up': [], 'position': [] },
      trans: { 'score': '评分', 'up': '点赞', 'position': '位置' }
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/video/list') {
        this.refreshParams()
      }
    }
  },
  created() {
    this.refreshParams()
  },
  methods: {
    refreshParams() {
      this.myChoice.position = []
      if (typeof this.$route.query.position === 'object') {
        for (const val of this.$route.query.position) {
          this.myChoice.position.push(this.poMap[val])
        }
      } else if (typeof this.$route.query.position === 'string') {
        this.myChoice.position.push(this.poMap[this.$route.query.position])
      }
    },
    letFatherAction() {
      this.$emit('fatherFunc', this.myChoice)
    },
    addToChoice(key, value) {
      const index = this.myChoice[key].indexOf(value)
      if (index !== -1) {
        this.myChoice[key].splice(index, 1)
      } else {
        this.myChoice[key].push(value)
      }
      this.letFatherAction()
    },
    rmFromChoice(key) {
      this.myChoice[key].splice(0)
      this.letFatherAction()
    },
    deleteAll() {
      for (const key in this.myChoice) {
        this.myChoice[key].splice(0)
      }
      this.letFatherAction()
    }
  }
}
</script>

<style scoped>
  #selector{
    width: 100%;
    font-size: 13px;
    border: 1px solid #d9d9bd;
  }
  .s-row{
    display: flex;
    line-height: 34px;
    height: auto;
    border: 1px solid #d9d9bd;
    background: #f0f0e3;
  }
  .row-key{
    border-right: 2px solid #d9d9bd;
    font-weight: bolder;
    width: 10%;
    padding-left: 15px;
    background: #f3f3f3;
  }
  .row-val{
    flex:1
  }
  .row-ext{
    width: 10%;
    display: flex;
    justify-content:center;
    align-items:Center;
  }
  .row-val ul{
    text-align: left;
  }
  .row-val ul li{
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 20px;
    margin-right: 20px;
    color: #005aa0;
  }
  .row-val ul li:hover{
    color: #e4393c;
    cursor: pointer;
  }
  .active{
    color:#e4393c !important;
  }
  .clear-button{
    width:50px;
    height:28px;
    padding: 0;
    font-size: 14px;
  }
  .tag{
    margin-left: 10px;
  }
</style>
