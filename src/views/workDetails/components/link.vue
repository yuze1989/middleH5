<template>
  <div class="sop-box" v-if="content.link">
    <div class="sop-title">
      <div>
        <i class="iconfont icon-bianzu sop-icon-color"></i>
        <span class="sop-name">&nbsp;&nbsp;链接</span>
      </div>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send({
        msgtype: 'news',
        enterChat: true,
        news: {
          title: content.link.title,
          imgUrl: content.link.imgUrl,
          desc: content.link.desc,
          link: content.link.url,
        }
      })"></i>
    </div>
    <div class="link-con">
      <div class="link-title">{{content.link.title}}</div>
      <div class="link-sub">
        <div class="link-desc">{{content.link.desc}}</div>
        <div class="link-icon">
          <img :src="content.link.imgUrl" alt="">
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
  .link-con {
    width: 21rem;
    padding: 1.2rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 0.2rem;
    margin-left: 2.2rem;
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
    align-items: center;
  }
  .link-desc {
    font-size: 1.2rem;
    color: rgba(0,0,0,0.65);
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
  .link-icon img{
    width: 3.9rem;
    height: 3.9rem;
    object-fit: cover;
    margin-left: 0.6rem;
  }
</style>
