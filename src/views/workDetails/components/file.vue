<template>
  <div class="sop-box">
    <div class="sop-title">
      <span><i class="iconfont icon-wenjian sop-icon-color"></i> 文件</span>
      <i class="iconfont icon-fasong1"></i>
    </div>
    <div class="file-con">
      <div class="file-left">
        <div class="file-name">这是文件名称.ppt这是文件名称.ppt这是文件名称.ppt这是文件名称.ppt</div>
        <div class="file-size">12.3kb</div>
      </div>
      <div class="file-icon"></div>
    </div>
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
  .file-con {
    padding: 1.3rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20.7rem;
    margin-left: 2.2rem;
  }
  .file-left {
    overflow: hidden;
  }
  .file-name {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 1.4rem;
    color: rgba(0,0,0,0.85);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  .file-size {
    font-size: 1.2rem;
    color: rgba(0,0,0,0.45);
    margin-top: 1rem;
  }
  .file-icon {
    margin-left: 1rem;
  }
  .file-icon img {
    width: 2.4rem;
  }
</style>
