<template>
  <div class="box-bos">
    <ul>
      <li :class="{'active':indexTap === index}" v-for="(item,index) in lists"
      :key="index" @click="change(index)">
        {{item}}
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
          <div class="sizi">{{item.description||item.fileSizeStr}}</div>
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
    <!-- 分享弹窗 -->
    <div class="mask" v-show="isMask">
      <div class="mask-box">
        <div class="mask-tit">
          发送给：
        </div>
        <div class="mask-top">
          <img src="../assets/logo.png">
          <div>我叫中秋</div>
        </div>
        <div class="mask-content">
          三、我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第一、可以帮助企业管理客户的微信帐号…
        </div>
        <div class="mask-input">
          <input type="text" placeholder="留言" v-model="tex" />
        </div>
        <div class="footer">
          <div @click="cancel">取消</div>
          <div @click="send ">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { List, PullRefresh } from 'vant';
import Http from '../utils/http';

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
      lists: ['文章', '链接', '海报', '视频', 'PDF', 'PPT'],

      // 数据
      dataList: [],
      // 是否显示弹窗
      isMask: false,

      // 留言内容
      tex: '',

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
    // 取消
    cancel() {
      this.isMask = !this.isMask;
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
      console.log('点击发送');
    },

    // 分享
    share(str) {
      const obj = str;
      const that = this;
      that.isMask = !that.isMask;
      console.log(obj);
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

  .mask {
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mask-box {
    width: 260px;
    padding: 12px 20px;
    background: #FFFFFF;
    border-radius: 2px;
  }

  .mask-tit {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    text-align: justify;
  }

  .mask-content {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    margin-bottom: 12px;
    background: #F5F5F5;
    padding: 10px;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 4;
    /** 显示的行数 **/
  }

  .mask-inp {
    width: 100%;
    border-bottom: #F3F3F3 1px solid;
    padding-bottom: 5px;
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

  .mask-input input {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    width: 99%;
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
  }

  .mask-top {
    display: flex;
    margin: 8px 0;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    text-align: justify;
  }

  .mask-top img {
    width: 39px;
    height: 39px;
    margin-right: 10px;
  }
</style>
