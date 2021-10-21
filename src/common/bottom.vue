<template>
  <div class="bottom">
    <div class="item" @click="clickItem('/')" :class="{active: url === '/'}">
      <i :class="url=== '/' ? 'icon-sucai' : 'icon-sucai2'" class="iconfont"></i>
      <div>话术</div>
    </div>
    <div class="item" @click="clickItem('/material')" :class="{active: url === '/material'}">
      <i :class="url=== '/material' ? 'icon-huashu' : 'icon-huashu2'" class="iconfont"></i>
      <div>素材</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bottom',
  data() {
    return {

    };
  },
  props: {
    url: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    clickItem(path) {
      console.log(path);
      console.log(this.$router);
      this.$router.push(path);
      // this.$emit('goUrl', path);
    },
  },

};
</script>
<style scoped="scoped">
  body {
    margin: 0;
  }

  .bottom {
    position: fixed;
    bottom: 0px;
    border-top: 1px solid #f3f3f3;
    background: #FFFFFF;
    width: 100%;
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item {
    flex: 1;
    text-align: center;
    color: #999999;
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #999999;
    letter-spacing: 0;
  }

  .active {
    color: #1890FF;
  }
</style>
