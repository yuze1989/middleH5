<template>
  <footer v-if="tabBars && tabBars.length > 0" class="tabbarWrap">
    <div
      v-for="item in tabBars"
      :key="item.name"
      class="item" @click="clickItem(item.url)"
      :class="{active: $route.path === item.url}">
      <i :class="`${$route.path === item.url ? item.selectIcon : item.icon}`"
        class="iconfont tabbar-icon"></i>
      <div class="title">{{item.title}}</div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'workTabBar',
  data() {
    return {
      tabBars: [
        {
          name: 'work',
          url: '/home/workbench/',
          icon: 'icon-gongzuotai2',
          selectIcon: 'icon-gongzuotai-11',
          title: '工作台',
        },
        {
          name: 'customer',
          url: '/home/customer/',
          icon: 'icon-kehu1',
          selectIcon: 'icon-kehu3',
          title: '客户',
        },
        {
          name: 'my',
          url: '/home/my/',
          icon: 'icon-wode1',
          selectIcon: 'icon-wode-1',
          title: '我的',
        },
      ],
    };
  },
  methods: {
    clickItem(path) {
      if (path === this.$route.path) return;
      this.$router.push(path);
    },
  },

};
</script>
<style scoped="scoped">
  .tabbarWrap {
    display: flex;
    align-items: center;
    padding: 0.8rem 2rem 0.35rem;
    border-top: 1px solid #DEDEDE;
    padding-bottom: calc(3.5px + env(safe-area-inset-bottom));
  }

  .item {
    flex: 1;
    text-align: center;
    font-family: PingFangSC-Regular;
    color: #9D9ABC;
  }

  .tabbar-icon {
    font-size: 20px;
  }

  .item .title {
    margin-top: 2px;
    letter-spacing: 0;
    line-height: 15px;
    font-weight: 400;
    font-size: 11px;
  }

  .active {
    color: #4066D4;
  }
</style>
