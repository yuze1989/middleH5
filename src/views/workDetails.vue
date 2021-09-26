<template>
  <div class="box">
    <div class="top-box">
      <div class="tite">
        <div class="task-name">SOP任务名称SOP任务名称</div>
        <div class="state">逾期</div>
      </div>
      <div>群SOP任务</div>
      <div class="push-date">
        <div>推送时间：2021-09-21 16：30</div>
        <div class="overdue">
          (剩余时间：23小时34分）</div>
      </div>
      <div class="task">完成时间：2021-09-21 16：30</div>
    </div>
    <div class="hr"></div>
    <!-- 推送群聊 -->
    <div class="content">
      <div class="content-tip" style="border: none;">推送内容</div>
      <div class="flex" v-for="(item,index) in content" :key="index">
        <div class="left">
          <i :class="item.icon" class="iconfont"></i>
        </div>
        <div class="right">
          <div class="right-top">
            <div class="right-tite">{{item.name}}</div>
            <div class="copy">
              <i class="iconfont icon-fuzhi"></i>
              <span>复制</span>
             </div>
          </div>
          <div class="right-content" v-if="item.type !== 2">
           {{item.content}}
           </div>
           <div class="right-content" v-else>
             <img src="../assets/logo.png" >
           </div>
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <!-- 推送群聊 -->
    <div class="content" style="margin-bottom: 60px;">
      <div class="content-tip">推送内容</div>
      <div class="list" v-for="(item,index) in list" :key="index" @click="change(item)">
        <div class="list-flex">
          <div>
            <i class="iconfont icon-weixuanze" v-show="!item.isSelect"></i>
            <i class="iconfont icon-xuanze" v-show="item.isSelect"
            :style="{'color: #E5E5E5;':item.state}"></i>
          </div>
          <img src="../assets/logo.png" class="img">
          <div>
            <div class="list-flex">
              <div class="list-content">{{item.name}}</div>
              <div :class="item.isComplete ? 'yes' : 'no'">
              {{item.isComplete ? '已完成' : '未完成'}}</div>
            </div>
            <div class="date" v-if="item.date">完成时间：{{item.date}}</div>
          </div>
        </div>
        <div class="icon"><i class="iconfont icon-fasong"></i></div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">取消</div>
      <div class="footer-right">完成</div>
    </div>
  </div>
</template>

<script>
// import { List, PullRefresh } from 'vant';

export default {
  // components: {
  //   List,
  //   PullRefresh,
  // },
  name: 'workDetails',
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      dataList: [],
      content: [
        {
          name: '文本', content: '9月开学季大促--第一部预热：鞋、包、配饰 全场4折起，前100名有大礼包，送完为止...', type: 1, icon: 'icon-wenzi',
        },
        {
          name: '图片', content: '', type: 2, icon: 'icon-tupian',
        },
        {
          name: '链接', content: 'https://www.xjsheggwjq.com/index.html', type: 3, icon: 'icon-bianzu',
        }],
      list: [
        {
          isSelect: false,
          name: '老会员权益发放群1号',
          isComplete: true,
          date: '2021-09-21 16：35',
          state: true,
        },
        {
          isSelect: false, name: '老会员权益发放群1号', isComplete: false, date: '', state: false,
        },
        {
          isSelect: true, name: '老会员权益发放群1号', isComplete: false, date: '', state: false,
        },
      ],
      pageIndex: 1,
      // 提示数量

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
    change(obj) {
      const data = obj;
      data.isSelect = !data.isSelect;
    },
    getList() {
      const that = this;
      // Http.post('/scrm/comm/rest/marketing-material/list-marketing-material', {
      //   materialType: that.indexTap + 1,
      //   pageIndex: that.pageIndex,
      //   pageSize: 20,
      //   snapshotFlag: that.snapshot,
      // }, '').then((res) => {
      //   if (res.success) {
      //     // 判断获取数据条数若等于0
      //     if (res.data.totalCount === 0) {
      //       // 清空数组
      //       that.dataList = [];
      //       // 停止上拉加载
      //       that.finished = true;
      //       return;
      //     }
      //     that.dataList.push(...res.data);
      //     that.sum = res.totalCount;
      //     // 清除上拉刷新状态
      that.refreshing = false;
      //     if (that.dataList.length >= res.totalCount) {
      //       // 结束上拉加载状态
      that.finished = true;
      //     }
      //   }
      // });
    },
  },
};
</script>
<style scoped="scoped">
  .icon-fuzhi,.icon-xuanze{
    color: #1890FF !important;
  }
  .icon-fasong{
    color: #1890FF !important;
    margin: 2px 2px 0 0 !important;
  }
  .icon{
    width: 24px;
    height: 24px;
    background: #DCEEFF;
    box-shadow: 0 4px 30px 0 rgba(24,107,255,0.16);
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
  }
  .yes{
    width: 46.5px;
    height: 19px;
    background: #DCEEFF;
    border-radius: 9px;
    font-size: 10px;
    text-align: center;
    line-height: 19px;
    color: #1890FF;
    margin-left: 10px;
  }
  .no{
    width: 46.5px;
    height: 19px;
    line-height: 19px;
    background: #E5E5E5;
    border-radius: 9px;
    font-size: 10px;
    color: rgba(0,0,0,0.25);
    text-align: center;
    margin-left: 10px;
  }
  .top-box{
     margin: 10px 0 10px 15px;
     font-size: 12px;
     color: #999999;
     letter-spacing: 0;
  }
  .right-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-tip{
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    padding-bottom: 12px;
  }
  .content{
    margin: 10px 0 10px 15px;
  }
  .task{
    margin-top: 6px;
  }
  .push-date{
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .state{
    background: rgba(231,120,120,0.1);
    text-align: center;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    width: 79px;
    height: 30px;
    border-radius: 50px 0 0 50px;
    color: rgba(250,82,82,1);
    letter-spacing: 0;
  }
  .top {
    padding: 11px 15px;
    font-size: 14px;
    color: #1890FF;
    letter-spacing: 0;
    text-align: center;
    display: flex;
    align-items: center;
    font-weight: 500;
  }
  .tite{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .task-name{
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .overdue{
    font-size: 12px;
    color: #FA5252;
    letter-spacing: 0;
    margin-right: 10px;
  }
  .surplus{
    color: #1890FF;
  }
  .hr {
    width: 100%;
    height: 5px;
    background-color: #E5E5E5;
  }
  .flex{
    display: flex;
    border-top: 1px solid #E5E5E5;
    padding: 12px 15px 12px 0;
    align-items: baseline;
  }
  .list{
    display: flex;
    justify-content: space-between;
    padding: 12px 15px 12px 0;
    align-items: center;
    border-top: 1px solid #E5E5E5;
  }
  .left{
    display: flex;
    align-items: flex-start;
  }
  .iconfont{
    font-size: 14px;
    color: #999999;
    margin-right: 10px;
  }
  .right-tite{
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
  }
  .copy{
    font-size: 14px;
    color: #1890FF;
    letter-spacing: 0;
  }
  .right{
    width: 100%;
  }
  .right-content{
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 10px;
  }
  .right-content img{
    width: 100px;
    height: 100px;
  }
  .img{
    width: 46px;
    height: 46px;
    border-radius: 4px;
    margin-right: 12px;
  }
  .list-flex{
    display: flex;
    align-items: center;
  }
  .list-content{
    width: 75%;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .date{
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    margin-top: 6px;
  }
  .footer{
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    z-index: 1;
    justify-content: space-evenly;
    border-top: 0.5px solid #E5E5E5;
    width: 100%;
    padding: 10px 0;
  }
  .footer-left{
    width: 152px;
    height: 40px;
    border: 0.5px solid #E5E5E5;
    border-radius: 2.5px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #333333;
  }
  .footer-right{
    width: 152px;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
    height: 40px;
    background: #1890FF;
    border-radius: 2.5px;
  }
</style>
