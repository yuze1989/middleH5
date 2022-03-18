<template>
  <div class="sop-box">
    <div class="sop-title">
      <span><i class="iconfont icon-bianzu sop-icon-color"></i> 链接</span>
      <i class="iconfont icon-fasong1" @click="send({
        text: {
          content: 'test',
        },
        attachments: [{
        msgtype: content.msgType,
        link: {
          title: content.link.title,
          imgUrl: content.link.picPath,
          desc: content.link.description,
          url: content.link.url,
        }
      }]
      })"></i>
    </div>
    <div class="link-con">
      <div class="link-title">{{content.link.title}}</div>
      <div class="link-sub">
        <div class="link-desc">{{content.link.description}}</div>
        <div class="link-icon">
          <img :src="content.link.picPath" alt="">
        </div>
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
  },
  methods: {
    send(content) {
      this.$emit('send', content);
    },
  },
};
</script>

<style scoped>
  .link-con {
    width: 21rem;
    padding: 1.2rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 0.2rem;
  }
  .link-title {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 1.4rem;
    color: rgba(0,0,0,0.85);
  }
  .link-sub {
    margin-top: 0.8rem;
    display: flex;
    justify-content: space-between;
  }
  .link-desc {
    font-size: 1.2rem;
    color: rgba(0,0,0,0.65);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
  }
  .link-icon img{
    width: 3.9rem;
    height: 3.9rem;
    object-fit: cover;
  }
</style>
