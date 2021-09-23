<template>
  <div class="box">
    <div class="top">
      <i class="iconfont icon-huashu2"></i>
      <span class="span">办事事项</span>
      <span>(10)</span>
    </div>
    <div class="hr"></div>
    <div class="top-nav">
      <div v-for="(item,index) in nav" :key="index">
        <div :class="{active: type === index}" @click="change(index)">
          {{item}}
        </div>
      </div>
    </div>
    <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <div class="content">
      <List v-model="loading" :finished="finished"
      offset="100" @load="onLoad" finished-text="没有更多了">
      <div class="content-tip">日常任务提醒</div>
      <div class="content-block" v-for="(item,index) in 5" :key="index">
        <div class="tite">
          <div class="state" v-if="index === 1">逾期</div>
          <div class="task-name">SOP任务名称SOP任务名称</div>
        </div>
        <div class="task">群SOP任务</div>
        <div class="push-date">
          <div>推送时间：2021-09-21 16：30</div>
          <div :class="{surplus: index !== 1}" class="overdue">
            （{{index === 1 ? '逾期' : '剩余'}}时间：23小时34分）</div>
        </div>
        <div class="task">完成时间：2021-09-21 16：30</div>
      </div>
     </List>
    </div>
     </PullRefresh>
  </div>
</template>

<script>
import { List, PullRefresh } from 'vant';

export default {
  components: {
    List,
    PullRefresh,
  },
  name: 'workbench',
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      dataList: [],
      pageIndex: 1,
      // 提示数量
      sum: 0,
      // 头部选项卡
      nav: ['未完成', '已完成'],

      // 选中的样式下标
      type: 0,
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
    // tab切换
    change(index) {
      this.type = index;
      console.log(index);
    },
  },
};
</script>
<style scoped="scoped">
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
  .span {
    margin: 0 10px;
    font-size: 16px;
    color: #333333;
  }

  .hr {
    width: 100%;
    height: 5px;
    background-color: #E5E5E5;
  }
  .top-nav {
    height: 44px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    justify-content: space-evenly;
    border-bottom: 1px solid #F3F3F3;
  }

  .top-nav div {
    height: 40px;
    line-height: 40px;
  }
  .active {
    color: #1890FF;
    border-bottom: 2px #1890FF solid;
  }
  .content{
    margin: 10px 0 10px 15px;
     margin-bottom: 50px;
  }
  .content-tip{
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #F3F3F3;
  }
  .content-block{
   padding: 12px 15px 12px 0;
   font-size: 12px;
   color: #999999;
   letter-spacing: 0;
   border-bottom: 1px solid #F3F3F3;
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
  .tite{
    display: flex;
    align-items: center;
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
    border-radius: 2px;
    text-align: center;
    padding: 2px 5px;
    font-size: 12px;
    color: rgba(250,82,82,1);
    letter-spacing: 0;
    margin-right: 10px;
  }
  .overdue{
    font-size: 12px;
    color: #FA5252;
    letter-spacing: 0;
  }
  .surplus{
    color: #1890FF;
  }
</style>
