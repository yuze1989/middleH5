<template>
  <div class="sop-box" v-if="content.video">
    <div class="sop-title">
      <div>
        <i class="iconfont icon-shipin sop-icon-color"></i>
        <span class="sop-name">&nbsp;&nbsp;视频</span>
      </div>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send({
        msgtype: content.msgType,
        enterChat: true,
        video: {
          mediaid: content.video.mediaid,
        }
      })"></i>
    </div>
    <div class="video-con">
      <a :href="content.video.attachmentPath">
        <img :src="content.video.picPath" alt="">
      </a>
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
    refer: {
      type: String,
      default: '',
    },
  },
  methods: {
    send(content) {
      this.$emit('send', content);
    },
  },
};
</script>

<style scoped>
  .video-con {
    margin-left: 2.2rem;
  }
  .video-con img {
    width: 15.2rem;
  }
  .video-con a {
    position: relative;
    display: inline-block;
  }
  .video-con a::before {
    content: '';
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/play.png') no-repeat center;
    background-size: 100%;
    width: 3.3rem;
    height: 3.3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
</style>
