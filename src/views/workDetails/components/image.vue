<template>
  <div class="sop-box" v-if="content.image">
    <div class="sop-title">
      <span><i class="iconfont icon-wenjian sop-icon-color"></i> 图片</span>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send({
        msgtype: content.msgType,
        enterChat: true,
        file: {
          mediaid: content.image.mediaid,
        }
      })"></i>
    </div>
    <div class="image-con">
      <img :src="content.image.attachmentPath" alt="">
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
.image-con img {
  width: 20rem;
}
</style>
