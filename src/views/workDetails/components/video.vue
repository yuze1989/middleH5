<template>
  <div class="sop-box">
    <div class="sop-title">
      <span><i class="iconfont icon-shipin sop-icon-color"></i> 视频</span>
     <i class="iconfont icon-fasong1" @click="send({
        msgtype: content.msgType,
        video: {
          mediaid: content.video.attachmentId,
        }
      })"></i>
    </div>
    <div class="video-con">
      <img :src="content.video.attachmentPath" alt="">
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
  .video-con img {
    width: 15.2rem;
    position: relative;
  }
  .video-con img::before {
    content: '';
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/play.png') no-repeat 3.3rem;
    width: 3.3rem;
    height: 3.3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
