<template>
  <div class="box-bos">
    <ul v-if="err !== '0100000006'">
      <li :class="{'active': navType === index}"
      v-for="(item,index) in lists" :key="index"
        @click="change(index)">
        {{item.name}}
      </li>
      <li class="margin"></li>
    </ul>
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-else>
      <div class="content-box">
        <div class="tip">
          (共有{{totalCount}}个
          {{lists[navType].name}}素材)</div>
        <List v-model="loading" :finished="finished" offset="100"
        @load="onLoad" finished-text="没有更多了">
          <div class="article" v-for="(item,index) in dataList" :key="index"
          @click="goDetails(item)">
            <div class="left">
              <i class="iconfont icon-fasong1" @click.stop="share(item)"></i>
              <img :src="item.materialEnclosureUrl" v-if="navType === 2">
              <img :src="item.coverPicUrl || lists[navType].url" v-else>
            </div>
            <div class="right">
              <div class="name">{{item.title}}</div>
              <div class="sizi">{{item.description || item.fileSizeStr}}</div>
              <div class="flex">
                <div class="ad" v-for="(str,subscript) in item.tagList" :key="subscript">
                  {{str.name}}
                </div>
              </div>
            </div>
          </div>
        </List>
      </div>
    </PullRefresh>
  </div>
</template>

<script>
import { List, PullRefresh, Toast } from 'vant';
import { mapState } from 'vuex';
import Http from '../utils/http';
import Wechat from '../utils/wechat';
import Config from '../utils/config';
import jurisdiction from '../common/jurisdiction.vue';

export default {
  name: 'about',
  components: {
    List,
    PullRefresh,
    jurisdiction,
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      // 提示数量
      totalCount: 0,
      shake: false,
      err: '',
      // 头部选项卡
      lists: [{
        name: '文章',
        msgType: 'news',
        materal: 'snapshotId',
        headType: 'article',
      },
      {
        name: '链接',
        msgType: 'text',
        type: 'content',
        headType: 'link',
      },
      {
        name: '海报',
        msgType: 'image',
        type: 'mediaid',
        headType: 'posters',
      },
      {
        name: '视频',
        msgType: 'video',
        type: 'mediaid',
        materal: 'materialId',
        headType: 'video',
      },
      {
        name: 'PDF',
        msgType: 'file',
        type: 'mediaid',
        url: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/pdf.png',
        headType: 'pdf',
      },
      {
        name: 'PPT',
        msgType: 'file',
        type: 'mediaid',
        url: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/ppt.png',
        headType: 'ppt',
      },
      {
        name: '表格',
        msgType: 'file',
        type: 'mediaid',
        url: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/excel.png',
        headType: 'excel',
      },
      {
        name: '文档',
        msgType: 'file',
        type: 'mediaid',
        url: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/word.png',
        headType: 'word',
      },
      ],
      // 数据
      dataList: [],
      snapshot: false,
      pageIndex: 1,
      totalPages: 1,
    };
  },
  computed: mapState({
    navType: (state) => state.statusType.navType,
  }),
  mounted() {
    const sessionType = parseInt(sessionStorage.getItem('navType'), 0);
    if (sessionType) {
      this.$store.dispatch('statusType/SETNACVTYPE', sessionType);
    }
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
      const { headType } = that.lists[that.navType];
      if (that.navType === 0) {
        that.snapshot = true;
      }
      // 清除下拉刷新状态
      that.refreshing = false;
      if (that.pageIndex > that.totalPages) {
        // 结束上拉加载状态
        that.finished = true;
        that.loading = false;
        return;
      }
      Http.post(`/scrm/material/list-marketing-material/${headType}`, {
        materialType: that.navType + 1,
        pageIndex: that.pageIndex,
        pageSize: 20,
        snapshotFlag: that.snapshot,
      }, '').then((res) => {
        if (res.success && res.totalCount !== 0) {
          that.err = '';
          that.dataList.push(...res.data);
          that.totalCount = res.totalCount;// 总数
          that.totalPages = res.totalPages;// 总页码
          that.loading = false;
          that.pageIndex += 1;
        } else {
          that.totalCount = 0;
          that.finished = true;
          that.loading = false;
          that.err = res.errCode;
          if (res.errMessage) {
            Toast(res.errMessage);
          }
        }
      }).catch(() => {
        that.err = 'errCode';
      });
    },
    goDetails(obj) {
      if (this.navType === 0) {
        Http.post('/scrm/comm/rest/marketing-material/share-marketing-material', {
          snapshotid: obj.id,
        }, '').then((res) => {
          if (res.success) {
            this.$router.push({
              path: 'details',
              query: {
                id: res.data,
              },
            });
          } else {
            Toast.loading({
              message: res.errMessage,
              duration: 1000,
              type: 'fail',
            });
          }
        });
      } else {
        window.location.href = obj.materialEnclosureUrl
          ? encodeURI(obj.materialEnclosureUrl) : obj.content;
      }
    },
    // tab切换
    change(index) {
      this.$store.dispatch('statusType/SETNACVTYPE', index);
      sessionStorage.setItem('navType', index);
      this.pageIndex = 1;
      this.dataList = [];
      if (!this.finished) {
        this.onLoad();
      }
      this.finished = false;
    },
    uploadFileToWx(obj, msgType, url) {
      Toast.loading({
        type: 'loading',
        duration: 0,
        forbidClick: true, // 禁用背景点击
        message: '加载中...',
      });
      let data = {
        msgtype: msgType,
        enterChat: true,
      };
        // 防抖
      if (this.shake) {
        return;
      }
      const { type, materal } = this.lists[this.navType];
      if (msgType === 'news') {
        Http.post('/scrm/comm/rest/marketing-material/share-marketing-material', {
          [materal]: obj.id,
        }, '').then((res) => {
          if (res.success) {
            data.news = {
              // H5消息页面url 必填
              link: url || `${Config.redirect_uri}/ch5/?id=${res.data}&appId=${obj.appId}`,
              title: obj.title, // H5消息标题
              desc: obj.description, // H5消息摘要
              imgUrl: obj.coverPicUrl, // H5消息封面图片URL
            };
            this.shake = true;
            Toast.loading({
              duration: 1,
            });
            Wechat.setAgentConfig(data, 'sendChatMessage');
          } else {
            Toast.loading({
              message: res.errMessage,
              duration: 1000,
              type: 'fail',
            });
          }
        });
        return;
      }

      Http.post('/scrm/comm/rest/marketing-material/upload-file-to-wx', {
        materialType: this.navType + 1,
        materialEnclosureId: obj.materialEnclosureId,
      }, '').then((res) => {
        data = {
          msgtype: msgType,
          enterChat: true,
          [msgType]: {
            [type]: type === 'content' ? obj.content : res.data,
          },
        };
        Wechat.setAgentConfig(data, 'sendChatMessage');
        this.shake = true;
        Toast.loading({
          duration: 1,
        });
      });
    },
    // 分享
    share(obj) {
      const maxsize = 10 * 1024 * 1024;
      let { msgType } = this.lists[this.navType];
      if (!obj.appId && msgType === 'news') {
        Toast('当前素材尚未关联公众号，请在系统内配置后使用');
        return;
      }
      this.shake = false;
      // 判断视频是否超过10m
      if (obj.fileSize >= maxsize && msgType === 'video') {
        msgType = 'news';
        this.uploadFileToWx(obj, msgType, encodeURI(obj.materialEnclosureUrl));
      } else {
        this.uploadFileToWx(obj, msgType, '');
      }
    },
  },
};
</script>
<style scoped="scoped">
  ul::-webkit-scrollbar {
    display: none;
  }

  .active {
    color: #1890FF;
    border-bottom: 0.2rem #1890FF solid;
    font-weight: bolder;
  }

  .box-bos {
    overflow: hidden;
  }

  .icon-fasong1 {
    color: #1890FF;
    font-size: 2.2rem;
  }

  .icon-fasong {
    color: #FFFFFF;
    font-size: 1rem;
    margin: 0.2rem 0.2rem 0 0;
  }

  li {
    border-bottom: 0.2rem rgba(0, 0, 0, 0) solid;
    text-align: center;
    font-size: 1.4rem;
    color: #333333;
    text-align: center;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding: 1rem 0;
    margin: 0 2rem;
  }

  ul {
    height: 4.4rem;
    display: flex;
    align-items: center;
    overflow: auto;
    padding-left: 0;
    list-style: none;
    margin: 0;
    font-size: 1.4rem;
    color: #333333;
  }

  .content-box {
    min-height: calc(100vh - 15rem);
    margin-bottom: 8rem;
    border-top: 0.1rem solid #F3F3F3;
    padding: 1rem 2rem 0 2rem;
  }

  .tip {
    font-size: 1.2rem;
    color: #999999;
    text-align: justify;
  }

  .article {
    opacity: 1;
    padding: 1rem 0;
    display: flex;
    align-items: flex-start;
    border-bottom: #F3F3F3 0.1rem dashed;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .left img {
    margin: 0 1rem 0 0.8rem;
    width: 4.6rem;
    height: 4.6rem;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.3rem;
  }

  .name {
    font-size: 1.6rem;
    color: #333333;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .ad {
    margin: 0 0.8rem 0.8rem 0;
    padding: 0.6rem 0.9rem;
    background: rgba(24, 144, 255, 0.05);
    border-radius: 0.1rem;
    opacity: 0.5;
    font-size: 1.2rem;
    color: #275783;
    line-height: 1rem;
  }

  .sizi {
    font-size: 1.4rem;
    color: #999999;
    text-align: justify;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .footer {
    display: flex;
    font-size: 1.4rem;
    color: #1890FF;
    text-align: justify;
  }

  .footer div {
    margin: 2rem 0 1.5rem 0;
    text-align: center;
    flex: 1;
  }

  .margin {
    margin: 0;
    width: 10px;
  }
</style>
