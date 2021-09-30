<template>
    <div class="bottom" v-if="type === 1">
      <div class="item" @click="clickItem('/')" :class="{active: url === '/'}">
        <i class="iconfont icon-sucai" v-if="url=== '/'"></i>
        <i class="iconfont icon-sucai2" v-else></i>
        <div>话术</div>
      </div>
      <div class="item" @click="clickItem('/material')"
      :class="{active: url === '/material'}">
        <i class="iconfont icon-huashu" v-if="url === '/material'"></i>
        <i class="iconfont icon-huashu2" v-else></i>
        <div>素材</div>
      </div>
    </div>
    <div class="bottom" v-else>
      <div class="item" @click="clickItem('/workbench')" :class="{active: url === '/workbench'}">
        <i class="iconfont icon-gongzuotai" v-if="url === '/workbench'"></i>
        <i class="iconfont icon-gongzuotai" v-else></i>
        <div>工作台</div>
      </div>
      <div class="item" @click="clickItem('/customer')"
      :class="{active: url === '/customer'}">
        <i class="iconfont icon-kehu2" v-if="url === '/customer'"></i>
        <i class="iconfont icon-kehu" v-else></i>
        <div>客户</div>
      </div>
      <div class="item" @click="clickItem('/marketing')"
      :class="{active: url === '/marketing'}">
        <i class="iconfont icon-yingxiao" v-if="url === '/marketing'"></i>
        <i class="iconfont icon-yingxiao" v-else></i>
        <div>营销</div>
      </div>
      <div class="item" @click="clickItem('/surplus')"
      :class="{active: url === '/surplus'}">
        <i class="iconfont icon-gengduo" v-if="url === '/surplus'"></i>
        <i class="iconfont icon-gengduo" v-else></i>
        <div>更多</div>
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
      this.$emit('goUrl', path);
    },
  },

};
</script>
<style scoped="scoped">
  body{
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
