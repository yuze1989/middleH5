<template>
  <div id="app">
    <router-view />
    <bottom :url="$route.path" v-if="$route.meta.tabbarshow"
    :type="$route.meta.type"></bottom>
  </div>
</template>
<script>
import bottom from './common/bottom.vue';

export default {
  components: {
    bottom,
  },
  name: 'app',
  data() {
    return {

    };
  },
  methods: {
  },

};
</script>
<style>
  @import './assets/iconfont/iconfont.css';
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
