<template>
    <div class="page">
      <skeleton title avatar :row="10" :loading="loading">
      <div class="box">
        <div class="top">{{data.title}}</div>
        <div class="text">
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
            该文章由用户自主上传，文字版权归原作者所有。
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
import moment from 'moment';
import Http from '../utils/http';

export default {
  components: {
    skeleton,
  },
  data() {
    return {
      loading: true,
      id: 0,
      isShow: false,
      gmtCreate: '',
      data: {},
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getList();
  },
  methods: {
    time(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
    },
    // 获取数据
    getList() {
      const that = this;
      Http.post('/scrm/h5/marketing-material/get-by-share-id', {
        shareId: that.id,
      }, '').then((res) => {
        if (res.success) {
          that.data = res.data;
          document.title = res.data.title;
          that.gmtCreate = this.time(res.data.gmtCreate);
          that.loading = false;
        }
      });
    },
  },
};
</script>
<style scoped>
  .page {
    padding: 1.5rem;
  }
  .box{
    min-height: calc(100vh - 15.1rem);
  }
  .top {
    font-size: 1.6rem;
    color: #333333;
  }

  .text {
    margin: 1.2rem 0;
    font-size: 1.4rem;
    color: #999999;
  }
  .footer-content {
    margin: 1rem 0;
    padding: 0.5rem;
    background: #F5F5F5;
    border-radius: 0.2rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.25);
    text-align: justify;
  }

  .footer-content span {
    color: #1890FF;
  }

  .content {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.65);
    text-align: justify;
  }
  .content >>> img{
    max-width: 100%;
  }
  .footer {
    margin-top: 2rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.25);
    text-align: justify;
  }

  .icon-xiala,
  .icon-shangla {
    font-size: 0.5rem;
    color: #999999;
    margin: 0.5rem;
  }

  .footer-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
  }

  .right-margin {
    margin-right: 1rem;
  }

  .left-margin {
    margin-left: 1rem;
  }
</style>
