<template>
  <div class="box-bos">
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <div class="content-box" v-else>
      <div class="search-box">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" class="search-input" placeholder="请输入雷达标题"
        v-model="keyword" />
        <div class="search-font" @click="onRefresh">搜索</div>
      </div>

      <div class="tip">(共有{{totalCount}}个雷达素材)</div>
      <PullRefresh v-model="refreshing" @refresh="onRefresh">
        <List v-model="loading" :finished="finished" offset="100" @load="onLoad"
        finished-text="没有更多了" class="bolk">
          <div class="content" v-for="(item,index) in dataList" :key="index">
            <div class="content-top">
              <i class="iconfont icon-fasong1" @click="uploadFileToWx(item)"></i>
              <div class="title ellipsis">{{item.title}}</div>
            </div>
            <div class="article">
              <div class="article-img">
                <img :src="item.linkCoverUrl">
              </div>
              <div class="article-box">
                <div class="article-title ellipsis">{{item.linkTitle}}</div>
                <div class="article-sum">总点击人数：{{item.totalClickUserTimes || 0}}
                </div>
              </div>
            </div>
          </div>
        </List>
      </PullRefresh>
    </div>

  </div>
</template>

<script>
import { PullRefresh, List, Toast } from 'vant';
import Http from '@/utils/http';
import Wechat from '@/utils/wechat';
import Config from '@/utils/config';
import jurisdiction from '@/common/jurisdiction.vue';

export default {
  name: 'about',
  components: {
    jurisdiction,
    PullRefresh,
    List,
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      keyword: '',
      err: '',
      shake: true,

      // 数据
      dataList: [],
      pageIndex: 1,
      totalCount: 0,
      totalPages: 1,
    };
  },
  mounted() {

  },
  methods: {
    onLoad() {
      this.getList();
    },
    onRefresh() {
      this.pageIndex = 1;
      this.dataList = [];
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    getList() {
      const that = this;
      // 清除下拉刷新状态
      that.refreshing = false;
      if (!that.shake) {
        return;
      }
      that.shake = false;
      if (that.pageIndex > that.totalPages) {
        // 结束上拉加载状态
        that.finished = true;
        that.loading = false;
        return;
      }
      Http.post('/scrm/comm/rest/interactive-radar/list', {
        title: that.keyword,
        pageIndex: that.pageIndex,
        pageSize: 20,
      }, '').then((res) => {
        that.shake = true;
        if (res.success && res.totalCount !== 0) {
          that.err = '';
          that.dataList = that.pageIndex === 1 ? res.data
            : that.dataList.concat(res.data);
          that.totalCount = res.totalCount;
          that.totalPages = res.totalPages;
          that.loading = false;
          if (that.dataList.length === res.totalCount) {
            // 结束上拉加载状态
            that.finished = true;
          }
          that.pageIndex += 1;
        } else {
          that.finished = true;
          that.loading = false;
          that.err = res.errCode;
          Toast(res.errMessage || '暂无内容');
        }
      }).catch(() => {
        that.err = 'errCode';
      });
    },
    uploadFileToWx(obj) {
      Http.post('/scrm/comm/rest/wechat-account-info/get-app-id-by-corp-id', {
        corpId: localStorage.getItem('corpId'),
      }, '').then((res) => {
        if (res.success) {
          Toast.loading({
            type: 'loading',
            duration: 0,
            forbidClick: true, // 禁用背景点击
            message: '加载中...',
          });
          const data = {
            msgtype: 'news',
            enterChat: true,
            news: {
              link: `${Config.state_url}/ch5/radar?userId=${localStorage.getItem('userId')}&appId=${res.data.appId}&radarId=${obj.id}&corpId=${localStorage.getItem('corpId')}`,
              title: obj.linkTitle, // H5消息标题
              desc: obj.linkDigest, // H5消息摘要
              imgUrl: obj.linkCoverUrl, // H5消息封面图片URL
            },
          };
          Toast.loading({
            duration: 1,
          });
          Wechat.setAgentConfig(data, 'sendChatMessage');
        } else {
          Toast(res.errMessage || '企业没有绑定微信公众号');
        }
      });
    },
  },
};
</script>
<style scoped="scoped">
  .box-bos {
    overflow: hidden;
  }

  .icon-sousuo {
    color: #999999;
    font-size: 1.3rem;
  }
  .icon-fasong1 {
    color: #1890FF;
    font-size: 2.2rem;
  }

  .content-box {
    margin-bottom: 8rem;
    border-top: 0.1rem solid #F3F3F3;
    padding: 1rem 2rem 0 2rem;
  }

  .tip {
    padding-top: 0.6rem;
    font-size: 1.2rem;
    color: #999999;
    text-align: justify;
  }

  .bolk {
    min-height: calc(100vh - 15rem);
  }

  .content {
    padding: 1rem 0;
    border-bottom: #F3F3F3 0.1rem dashed;
  }

  .content-top {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 1.6rem;
    color: #333333;
    padding: 0 0.8rem;
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 25.1rem;
    white-space: nowrap;
  }

  .article {
    display: flex;
    padding: 0.5rem 0 0 3rem;
  }

  .article-img {
    width: 4.6rem;
    height: 4.6rem;
    padding-right: 1rem;
  }

  .article-img img {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
  }

  .article-title {
    margin-bottom: 1rem;
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.65);
  }

  .article-sum {
    font-size: 1.2rem;
    color: #999999;
  }

  .search-box {
    display: flex;
    align-items: center;
    border: 0.5px solid #DDDDDD;
    border-radius: 1.5rem;
    padding: 0.5rem 0 0.5rem 1.6rem;
  }

  .search-input::-webkit-input-placeholder {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.25);
    font-weight: Regular
  }

  .search-input {
    font-size: 1.4rem;
    margin: 0;
    padding: 0 1rem;
    border: none;
    width: 75%;
    height: 2rem;
    color: #666;
  }

  .search-font {
    font-size: 1.3rem;
    border-left: 0.1rem solid rgba(0, 0, 0, 0.08);
    color: #1890FF;
    padding-left: 1rem;
  }
</style>
