<template>
  <div class="wrap">
    <router-view />
    <HomeTabBar />
  </div>
</template>

<script>
import HomeTabBar from '@/common/homeTabBar.vue';

export default {
  name: 'home',
  components: {
    HomeTabBar,
  },
};
</script>
<style scoped="scoped">
  .wrap {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }
</style>
