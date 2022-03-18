<template>
  <div class="sop-box">
    <div class="sop-title">
      <span><i class="iconfont icon-wenzi sop-icon-color"></i> 文本</span>
      <i class="iconfont icon-fasong1"></i>
    </div>
    <div class="text-desc">9月开学季大促--第一部预热：鞋、包、配饰 全场4折起，前100名有大礼包，送完为止...</div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
  .text-desc {
    font-size: 1.4rem;
    color: rgba(0,0,0,0.65);
    margin-left: 2.2rem;
  }
</style>
