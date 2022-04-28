<template>
  <div id="app" :class="`${$route.meta.showTabbar ? 'homeWrap' : ''}`">
    <div class="homeContent">
      <keep-alive :include="includeArr" :exclude="[]">
        <router-view />
      </keep-alive>
    </div>
    <div v-if="$route.meta.showTabbar"><HomeTabBar /></div>
  </div>
</template>
<script>
import HomeTabBar from '@/common/homeTabBar.vue';

export default {
  components: {
    HomeTabBar,
  },
  name: 'app',
  data() {
    return {
      includeArr: ['workbench', 'customer', 'my'],
    };
  },
  methods: {
    // goUrl(url) {
    //   this.$router.push(url);
    // },
  },

};
</script>
<style lang="less">
  @import './assets/iconfont/iconfont.css';
  html,body,#app{
    height: 100%;;
  }
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
    font-size: 11px;
    color: #999999;
    letter-spacing: 0;
  }
  .active {
    color: #1890FF;
  }

  .homeWrap {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;

    .homeContent {
      flex: 1;
      overflow: hidden;
      display: flex;
    }
  }
</style>
