<template>
    <div class="page">
      <skeleton title avatar :row="10" :loading="loading">
      <div class="box" :style="'min-height:' + height + 'px'">
        <div class="top">{{data.title}}</div>
        <div class="txt">
          <span>{{data.author}}</span>
          <span style="margin-left: 5px;">{{gmtCreate}}</span>
        </div>
        <div class="content" v-html="data.content">
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
        </skeleton>

  </div>
</template>
<script>
import { skeleton } from 'vant';
import Http from '../utils/http';

export default {
  components: {
    skeleton,
  },
  data() {
    return {
      loading: true,
      height: 0,
      id: 0,
      isShow: false,
      gmtCreate: '',
      data: {},
    };
  },
  mounted() {
    this.height = document.documentElement.clientHeight - 151;
    this.id = this.$route.query.id;
    this.getList();
  },
  methods: {

    // 获取数据
    getList() {
      const that = this;
      Http.post('/scrm/h5/marketing-material/get-by-share-id', {
        shareId: that.id,
      }, '').then((res) => {
        // alert(JSON.stringify(res));
        if (res.success) {
          that.data = res.data;
          document.title = res.data.title;
          that.gmtCreate = Http.getyyyyMMdd(res.data.gmtCreate);
          that.loading = false;
        }
      });
    },
    // 投诉
    complaint() {
      console.log('投诉');
      // window.location.href = '';
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
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    text-align: justify;
  }
  .content >>> img{
    max-width: 100%;
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
