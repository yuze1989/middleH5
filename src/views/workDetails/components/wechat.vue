<template>
  <div class="sop-box" v-if="content.miniProgram">
    <div class="sop-title">
      <span><i class="iconfont icon-bianzu sop-icon-color"></i> 小程序</span>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send({
        msgtype: 'miniprogram',
        enterChat: true,
        miniprogram: {
          appid: content.miniProgram.appId,
          title: content.miniProgram.title,
          imgUrl: content.miniProgram.imgUrl,
          page: content.miniProgram.page,
        }
      })"></i>
    </div>
    <div class="wechat-con">
      <div class="wechat-name">{{content.miniProgram.title}}</div>
      <div class="wechat-img">
        <img :src="content.miniProgram.imgUrl" alt="">
      </div>
      <div class="wechat-type">
        <i class="iconfont icon-xiaochengxu"></i>
        小程序
      </div>
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
  .wechat-con {
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 1.1rem;
    width: 17.4rem;
    border-radius: 0.2rem;
  }
  .wechat-name {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 1.4rem;
    color: rgba(0,0,0,0.85);
  }
  .wechat-img {
    margin-top: 0.6rem;
  }
  .wechat-img img {
    height: 8.8rem;
  }
  .wechat-type {
    color: rgba(0,0,0,0.45);
    font-size: 1.1rem;
    margin-top: 0.8rem;
  }
  .wechat-type .icon-xiaochengxu {
    font-size: 1.5rem;
    background-color: #1890FF;
    border-radius: 50%;
    color: #FFF;
  }
</style>
