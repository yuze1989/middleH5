<template>
  <div class="box-bos">
    <ul>
      <li :class="{'active':indexTap === index}" v-for="(item,index) in lists"
      :key="index" @click="change(index)">
        {{item.name}}
      </li>
    </ul>
    <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <div class="content-box">
      <div class="tip">(共有{{sum}}个文章素材)</div>
      <List v-model="loading" :finished="finished"
      offset="100" @load="onLoad" finished-text="没有更多了">
      <div class="article" v-for="(item,index) in dataList" :key="index"
      @click="go(item)">
        <div class="left">
          <i class="iconfont icon-fasong1" @click.stop="share(item)"></i>
          <img :src="item.coverPicUrl">
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
import { List, PullRefresh } from 'vant';
import Http from '../utils/http';
import Wechat from '../utils/wechat';

export default {
  components: {
    List,
    PullRefresh,
  },
  name: 'about',
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      // 提示数量
      sum: 0,

      // 选中的下标
      indexTap: 0,

      // 头部选项卡
      lists: [
        { name: '文章', msgType: 'news' },
        { name: '链接', msgType: 'news' },
        { name: '海报', msgType: 'image' },
        { name: '视频', msgType: 'video' },
        { name: 'PDF', msgType: 'file' },
        { name: 'PPT', msgType: 'file' }],
      // 数据
      dataList: [],
      snapshot: false,
      pageIndex: 1,
    };
  },
  mounted() {

  },
  methods: {
    onLoad() {
      this.getList();
      this.pageIndex += 1;
    },
    onRefresh() {
      this.finished = false;
      this.onLoad();
    },
    getList() {
      const that = this;
      if (that.indexTap === 0) {
        that.snapshot = true;
      }
      Http.post('/scrm/comm/rest/marketing-material/list-marketing-material', {
        materialType: that.indexTap + 1,
        pageIndex: that.pageIndex,
        pageSize: 20,
        snapshotFlag: that.snapshot,
      }, '').then((res) => {
        if (res.success) {
          // 判断获取数据条数若等于0
          if (res.data.totalCount === 0) {
            // 清空数组
            that.dataList = [];
            // 停止上拉加载
            that.finished = true;
            return;
          }
          that.dataList.push(...res.data);
          that.sum = res.totalCount;
          // 清除上拉刷新状态
          that.refreshing = false;
          if (that.dataList.length >= res.totalCount) {
            // 结束上拉加载状态
            that.finished = true;
          }
        }
      });
    },
    go(str) {
      if (this.indexTap === 0) {
        this.$router.push({
          path: 'details',
          query: {
            id: str.id,
          },
        });
      } else {
        window.location.href = str.materialEnclosureUrl;
      }
    },
    // tab切换
    change(index) {
      this.indexTap = index;
      this.pageIndex = 1;
      this.dataList = [];
      this.getList();
    },
    // 发送
    send() {
      // Wechat.sendChatMessage(this.obj, this.indexTap, this.tex, window.location.href);
      console.log('点击发送');
    },

    // 分享
    share(str) {
      const dataList = str;
      const that = this;
      const { msgType } = that.lists[that.indexTap];
      let data = {};
      const splicing = `{"msgtype":"${msgType}","enterChat":${true},"${msgType}":
       {"mediaid":${dataList.materialEnclosureId}}}`;
      data = JSON.parse(splicing);
      if (msgType === 'news') {
        data = {
          msgtype: msgType,
          enterChat: true,
          news: {
            link: window.location.href, // H5消息页面url 必填
            title: dataList.title, // H5消息标题
            desc: dataList.description, // H5消息摘要
            imgUrl: dataList.coverPicUrl, // H5消息封面图片URL
          },
        };
      }
      console.log(data);
      Wechat.sendChatMessage(data);
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
    margin:0 8px 8px 0;
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
