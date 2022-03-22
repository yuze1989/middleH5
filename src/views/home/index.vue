<template>
  <div class="wrap">
    <router-view />
    <WorkTabBar />
  </div>
</template>

<script>
import WorkTabBar from '../../common/WorkTabBar.vue';

export default {
  name: 'home',
  components: {
    WorkTabBar,
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
