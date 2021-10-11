<template>
  <div class="box-bos">
    <ul>
      <li :class="{'active': $store.state.navType === index}" v-for="(item,index) in lists"
      :key="index" @click="change(index)">
        {{item.name}}
      </li>
      <li style="margin: 0;width: 10px;"></li>
    </ul>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-if="!err">
      <div class="content-box" :style="'min-height:' + height + 'px'">
        <div class="tip">(共有{{sum}}个文章素材)</div>
        <List v-model="loading" :finished="finished" offset="100"
         @load="onLoad" finished-text="没有更多了">
          <div class="article" v-for="(item,index) in dataList" :key="index"
          @click="goDetails(item)">
            <div class="left">
              <i class="iconfont icon-fasong1" @click.stop="share(item)"></i>
              <img :src="item.materialEnclosureUrl" v-if="$store.state.navType === 2">
              <img :src="item.coverPicUrl || lists[$store.state.navType].url" v-else>
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
    <jurisdiction :err="err" v-show="err"></jurisdiction>
  </div>
</template>

<script>
import { List, PullRefresh, Toast } from 'vant';
import Http from '../utils/http';
import Wechat from '../utils/wechat';
import Config from '../utils/config';
import store from '@/store';
import jurisdiction from '../common/jurisdiction.vue';

export default {
  components: {
    List,
    PullRefresh,
    jurisdiction,
  },
  name: 'about',
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      // 提示数量
      sum: 0,
      shake: false,
      err: '',
      errType: 0,
      height: 0,
      // 头部选项卡
      lists: [
        {
          name: '文章', msgType: 'news', materal: 'snapshotId', headType: 'article',
        },
        {
          name: '链接', msgType: 'text', type: 'content', headType: 'link',
        },
        {
          name: '海报', msgType: 'image', type: 'mediaid', headType: 'posters',
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
      wxMediaId: '',
    };
  },
  mounted() {
    Wechat.setWxConfig();
    const navType = parseInt(sessionStorage.getItem('navType'), 0);
    if (navType) {
      store.dispatch('SETNACVTYPE', navType);
    }
    this.height = document.documentElement.clientHeight - 150;
  },
  methods: {
    onLoad() {
      this.getList();
    },
    onRefresh() {
      this.pageIndex = 1;
      alert(this.sum);
      if (this.dataList.length === this.sum) {
        this.finished = true;
        this.loading = false;
      }
      this.dataList = [];
      this.onLoad();
    },
    getList() {
      const that = this;
      const { headType } = that.lists[that.$store.state.navType];
      if (that.$store.state.navType === 0) {
        that.snapshot = true;
      }
      Http.post(`/scrm/material/list-marketing-material/${headType}`, {
        materialType: that.$store.state.navType + 1,
        pageIndex: that.pageIndex,
        pageSize: 20,
        snapshotFlag: that.snapshot,
      }, '').then((res) => {
        if (res.success) {
          that.err = '';
          // 判断获取数据条数若等于0
          if (res.data.totalCount === 0) {
            // 清空数组
            that.dataList = [];
            // 停止上拉加载
            that.finished = true;
            that.loading = false;
          } else {
            that.dataList.push(...res.data);
            if (that.pageIndex === 1) {
              that.sum = res.totalCount;
            }
            // 清除下拉刷新状态
            that.refreshing = false;
            that.loading = false;
            if (that.dataList.length === res.totalCount) {
              // 结束上拉加载状态
              that.finished = true;
            }
            that.pageIndex += 1;
          }
        } else {
          that.err = res.errCode;
          Toast.loading({
            message: res.errMessage,
            duration: 1000,
            type: 'fail',
          });
        }
      });
    },
    goDetails(obj) {
      if (this.$store.state.navType === 0) {
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
        window.location.href = obj.materialEnclosureUrl || obj.content;
      }
    },
    // tab切换
    change(index) {
      store.dispatch('SETNACVTYPE', index);
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
      const { type, materal } = this.lists[this.$store.state.navType];
      if (msgType === 'news') {
        Http.post('/scrm/comm/rest/marketing-material/share-marketing-material', {
          [materal]: obj.id,
        }, '').then((res) => {
          if (res.success) {
            data.news = {
              // H5消息页面url 必填
              link: url || `${Config.redirect_uri}/middleH5/details?id=${res.data}`,
              title: obj.title, // H5消息标题
              desc: obj.description, // H5消息摘要
              imgUrl: obj.coverPicUrl, // H5消息封面图片URL
            };
            this.shake = true;
            Toast.loading({
              duration: 1,
            });

            Wechat.sendChatMessage(data, 1);
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
        materialType: this.$store.state.navType + 1,
        materialEnclosureId: obj.materialEnclosureId,
      }, '').then((res) => {
        console.log(res);
        data = {
          msgtype: msgType,
          enterChat: true,
          [msgType]: {
            [type]: type === 'content' ? obj.content : res.data,
          },
        };
        Wechat.sendChatMessage(data, 1);
        this.shake = true;
        Toast.loading({
          duration: 1,
        });
      });
    },
    // 分享
    share(obj) {
      const maxsize = 10 * 1024 * 1024;
      let { msgType } = this.lists[this.$store.state.navType];
      this.shake = false;
      // 判断视频是否超过10m
      if (obj.fileSize >= maxsize && msgType === 'video') {
        msgType = 'news';
        this.uploadFileToWx(obj, msgType, obj.materialEnclosureUrl);
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
    border-bottom: 2px #1890FF solid;
    font-weight: bolder;
  }

  .box-bos {
    overflow: hidden;
  }

  .icon-fasong1 {
    color: #1890FF;
    font-size: 22px;
  }

  .icon-fasong {
    color: #FFFFFF;
    font-size: 10px;
    margin: 2px 2px 0 0;
  }
  li {
    border-bottom: 2px rgba(0, 0, 0, 0) solid;
    text-align: center;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding: 10px 0;
    margin: 0 20px;
  }

  ul {
    height: 44px;
    display: flex;
    align-items: center;
    overflow: auto;
    padding-left: 0;
    list-style: none;
    margin: 0;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }

  .content-box {
    margin-bottom: 80px;
    border-top: 1px solid #F3F3F3;
    padding: 10px 20px 0 20px;
  }

  .tip {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
  }

  .article {
    opacity: 1;
    padding: 10px 0;
    display: flex;
    align-items: flex-start;
    border-bottom: #F3F3F3 1px dashed;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .left img {
    margin: 0 10px 0 8px;
    width: 46px;
    height: 46px;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    margin-top: 3px;
  }

  .name {
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1;
    /** 显示的行数 **/
  }

  .ad {
    margin: 0 8px 8px 0;
    padding: 6px 9px;
    background: rgba(24, 144, 255, 0.05);
    border-radius: 1px;
    opacity: 0.5;
    font-size: 12px;
    color: #275783;
    line-height: 10px;
  }

  .sizi {
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1;
    /** 显示的行数 **/
  }

  .footer {
    display: flex;
    font-size: 14px;
    color: #1890FF;
    letter-spacing: 0;
    text-align: justify;
  }

  .footer div {
    margin: 20px 0 15px 0;
    text-align: center;
    flex: 1;
  }
</style>
