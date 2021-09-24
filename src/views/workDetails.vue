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
    <div class="content">
      <div class="content-tip">推送内容</div>
      <!-- 文本 -->
      <div class="flex">
        <div class="left">
          <i class="iconfont icon-xinjianwenjianjia"></i>
        </div>
        <div class="right">
          <div class="right-top">
            <div>文本</div>
            <div>复制</div>
          </div>
          <div class="right-content">
            9月开学季大促--第一部预热：鞋、包、配饰 全场4折起，前100名有大礼包，送完为止...
           </div>
        </div>
      </div>
      <!-- 图片 -->
      <!-- 链接 -->
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
     margin-bottom: 50px;
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
    border-top: 1px solid #F3F3F3;
    padding: 12px 15px 12px 0;
    align-items: baseline;
  }
  .right{
    margin-left: 10px;
  }
  .left{
    display: flex;
    align-items: flex-start;
  }
  .iconfont{
    font-size: 14px;
    color: #999999;
  }
</style>
