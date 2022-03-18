<template>
  <div class="sop-box">
    <div class="sop-title">
      <span><i class="iconfont icon-wenjian sop-icon-color"></i> 图片</span>
      <i class="iconfont icon-fasong1"></i>
    </div>
    <div class="image-con"></div>
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
.image-con img {
  width: 20rem;
}
</style>
