<template>
  <div class="page">
  <div class="box" :style="'min-height:'+height+'px'">
    <div class="top">文章名称</div>
    <div class="txt">
      <span>测试作者</span>
      <span>2021-08-17 10：53</span>
    </div>
    <div class="img-box">
      <img src="../assets/logo.png">
    </div>
    <div class="content">
      {{text}}
    </div>
     </div>
    <div class="footer">
      <div @click="isShow = !isShow">
        <span>免责声明</span>
        <i class="iconfont icon-xiala" v-if="!isShow"></i>
        <i class="iconfont icon-shangla" v-else></i>
      </div>
      <div class="footer-content" v-if="isShow">
        该文章由用户自主上传，文字版权归原作者所有。如您发现版权问题请点击
        <span @click="complaint">投诉</span>
      </div>
      <div class="footer-tip">
        <div class="right-margin">——</div>
        <div><i class="iconfont icon-juzhun"></i></div>
        <div>巨准SCRM 提供技术支持</div>
        <div class="left-margin">——</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      height: 0,
      id: 0,
      isShow: false,
      text: '《三国演义》第一百零三回写道：诸葛亮屯军于五丈原，令人搦战，但魏兵坚守不出。为了激将司马懿，诸葛亮派人送去妇人衣服一件和书信一封，意欲讽刺、挖苦司马懿。但司马懿就是不中计，还故意穿着女装戏耍，感谢诸葛亮一番好意。最后，诸葛亮病逝于五丈原，司马懿了笑到最后。',
    };
  },
  mounted() {
    this.height = document.documentElement.clientHeight - 151;
    console.log(this.height);
    this.id = this.$route.query.id;
    console.log(this.$route.query.id);
  },
  methods: {
    // 投诉
    complaint() {
      console.log('投诉');
    },
  },
};
</script>
<style scoped>
  .page {
    padding: 15px;
  }

  .top {
    font-size: 16px;
    color: #333333;
  }

  .txt {
    margin: 12px 0;
    font-size: 14px;
    color: #999999;
  }

  .img-box img {
    width: 100%;
    margin-bottom: 12px;
  }

  .footer-content {
    margin: 10px 0;
    padding: 5px;
    background: #F5F5F5;
    border-radius: 2px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
    text-align: justify;
  }

  .footer-content span {
    color: #1890FF;
  }

  .content {
    text-indent: 2em;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    text-align: justify;
  }

  .footer {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
    text-align: justify;
  }

  .icon-xiala,
  .icon-shangla {
    font-size: 5px;
    color: #999999;
    margin: 5px;
  }

  .footer-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .right-margin {
    margin-right: 10px;
  }

  .left-margin {
    margin-left: 10px;
  }
</style>
