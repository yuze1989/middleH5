<template>
  <div class="bottom">
    <div class="item" @click="clickItem('/workbench')" :class="{active: url === '/workbench'}">
      <i :class="url=== '/workbench' ? 'icon-gongzuotai21' : 'icon-gongzuotai'"
      class="iconfont"></i>
      <div>工作台</div>
    </div>
    <div class="item" @click="clickItem('/customer')" :class="{active: url === '/customer'}">
      <i :class="url=== '/customer' ? 'icon-kehu2' : 'icon-kehu'" class="iconfont"></i>
      <div>客户</div>
    </div>
    <div class="item" @click="clickItem('/marketing')" :class="{active: url === '/marketing'}">
      <i :class="url=== '/marketing' ? 'icon-yingxiao' : 'icon-yingxiao2'" class="iconfont"></i>
      <div>营销</div>
    </div>
    <div class="item" @click="clickItem('/surplus')" :class="{active: url === '/surplus'}">
      <i :class="url=== '/surplus' ? 'icon-gengduo2' : 'icon-gengduo'" class="iconfont"></i>
      <div>更多</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'workBottom',
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
