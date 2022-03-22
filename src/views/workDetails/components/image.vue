<template>
  <div class="sop-box" v-if="content.image">
    <div class="sop-title">
      <div>
        <i class="iconfont icon-tupian sop-icon-color"></i>
        <span class="sop-name">&nbsp;&nbsp;图片</span>
      </div>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send({
        msgtype: content.msgType,
        enterChat: true,
        image: {
          mediaid: content.image.mediaid,
        }
      })"></i>
    </div>
    <div class="image-con">
      <a :href="content.image.attachmentPath">
        <img :src="content.image.attachmentPath" alt="">
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
.image-con {
  margin-left: 2.2rem;
}
.image-con img {
  width: 10rem;
  height: 10rem;
  object-fit: cover;
}
</style>
