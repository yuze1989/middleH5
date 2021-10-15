<template>
  <div>
    <div class="box">
    <div class="top">
      <img src="../assets/error.png" >
      <div>
        <div>郭藁辉</div>
        <div :style="{color:source === 1 ? '#00BD5D' : '#1890ff'}">@微信</div>
      </div>
    </div>
    <div class="info">
      来源：---
    </div>
    <div class="info flex">
      <div>添加时间：---</div>
      <div>电话：---</div>
    </div>
    <div class="info flex">
      <div>年龄：---</div>
      <div>邮箱：---</div>
    </div>
    <div class="info label">
      <div>企业标签：</div>
      <div class="label-box" v-for="(item,index) in label" :key="index">{{item.name}}</div>
    </div>
    <div class="board">
      <div>
        <div>客户评分</div>
        <div class="font">0</div>
      </div>
      <div>
        <div>客户积分</div>
        <div class="font">0</div>
      </div>
      <div style="border: none;">
        <div>跟进状态</div>
        <div class="font">新客户</div>
      </div>
    </div>
    </div>
    <div class="hr"></div>
    <div class="distance">
      <div class="tite">
        <div class="border"></div>
        <div>动态</div>
      </div>
    </div>
    <!-- 动态部分 -->
    <!-- <PullRefresh v-model="refreshing" @refresh="onRefresh"> -->
     <!-- <List v-model="loading" :finished="finished" offset="100"
       @load="onLoad" finished-text="没有更多了"> -->
    <div v-for="(item,index) in list" :key="index">
      <div class="tate">
        <div>{{item.dateStr}}</div>
      </div>
      <div style="margin: 8px 0;">
      <div class="content" v-for="(obj,subscript) in item.customerTrendDTOList"
        :key="subscript">
          <div class="content-left">{{obj.timeStr}}</div>
          <div>
            <div class="content-tite">
              <i class="iconfont icon-jiedian"></i>
              <span>{{obj.eventName}}</span>
            </div>
            <div class="event" :style=" subscript + 1 ===
            item.customerTrendDTOList.length ?'border: none;':''">
              {{obj.text}}
            </div>
          </div>
      </div>
      </div>
      <div class="hr" v-if="index + 1 !== list.length"></div>
    </div>
  </div>
  <!-- </List> -->
  <!-- </PullRefresh> -->
</template>
<script>
// import Http from '../utils/http';
// import Utils from '../utils/util';
// import { List, PullRefresh } from 'vant';
import Wechat from '../utils/wechat';

export default {
  // components: {
  //   List,
  //   PullRefresh,
  // },
  data() {
    return {
      source: 2,
      label: [{ name: '高意向' }, { name: '低意向' }],
      refreshing: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: [
        {
          dateStr: '星期四 2021-10-14',
          customerTrendDTOList: [
            { eventName: '跟进记录', text: '自定义事件内容', timeStr: '16:27' },
            { eventName: '重要事件', text: '自定义事件内容', timeStr: '16:27' },
            { eventName: '添加评分', text: '自定义事件内容', timeStr: '16:27' }],
        },
        {
          dateStr: '星期四 2021-09-30',
          customerTrendDTOList: [
            { eventName: '跟进记录', text: '自定义事件内容', timeStr: '16:27' }],
        }],
    };
  },
  mounted() {
    Wechat.setWxConfig();
    Wechat.getCurExternalContact();
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
      // const that = this
      // if (that.$store.state.navType === 0) {
      //   that.snapshot = true;
      // }
      // Http.post(`/scrm/material/list-marketing-material/${headType}`, {
      //   materialType: that.$store.state.navType + 1,
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
      //       that.loading = false;
      //     } else {
      //       that.dataList.push(...res.data);
      //       if (that.pageIndex === 1) {
      //         that.sum = res.totalCount;
      //       }
      //       // 清除下拉刷新状态
      //       that.refreshing = false;
      //       that.loading = false;
      //       if (that.dataList.length === res.totalCount) {
      //         // 结束上拉加载状态
      //         that.finished = true;
      //       }
      //       that.pageIndex += 1;
      //     }
      //   } else {
      //     Toast.loading({
      //       message: res.errMessage,
      //       duration: 1000,
      //       type: 'fail',
      //     });
      //   }
      // })
    },
  },
};
</script>
<style scoped>
  .box{
    padding: 15px 15px 0 15px;
  }
  .icon-jiedian{
    font-size: 16px;
    color: #1890FF;
  }
  .top{
    display: flex;
    font-family: PingFangSC-Medium;
    align-items: center;
    font-size: 16px;
    color: #333333;
    margin-bottom: 4px;
  }
  .top img{
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .info{
    padding: 4px 0;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
  }
  .flex{
    display: flex;
  }
  .flex div{
    flex: 1;
  }
  .label{
    display: flex;
    align-items:center;
    flex-wrap: wrap;
  }
  .label-box{
    width: 45px;
    height: 20px;
    background: rgba(24,144,255,0.05);
    border: 0.5px solid rgba(24,144,255,0.25);
    border-radius: 1px;
    line-height: 20px;
    font-size: 11px;
    color: rgba(0,0,0,0.65);
    line-height: 20px;
    text-align: center;
    margin-right: 6px;
  }
  .board{
    margin: 8px 0;
    height: 74px;
    background: #F3F9FF;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
  }
  .board >div{
    flex: 1;
    text-align: center;
    border-right:solid #DDDDDD 1px;
  }
  .font{
    font-size: 16px;
    margin-top: 8px;
    color: #333333;
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
  }
  .hr{
    height: 8px;
    margin: 4px 0;
    background: #F5F5F5;
  }
  .distance{
    padding: 8px 15px;
    border-bottom: 1px solid #F3F3F3;
  }
  .tite{
    font-size: 16px;
    color: #333333;
    display: flex;
    align-items: center;
  }
  .border{
    background-color: #1890FF;
    height: 12px;
    width: 3px;
    margin-right: 12px;
    border-radius: 1.5px;
  }
  .tate{
    padding: 8px 15px;
    border-bottom: 1px solid #F3F3F3;
    font-size: 12px;
    color: #999999;
    display: flex;
    align-items: center;
  }
  .content{
    display: flex;
    padding: 0 15px;
  }
  .content-left{
    font-size: 12px;
    color: #999999;
    margin-right: 12px;
  }
  .content-tite{
    font-size: 14px;
    color: #333333;
  }
  .content-tite span{
    margin-left: 10px;
  }
  .event{
    font-size: 14px;
    padding: 8px 0px 8px 18px;
    margin:4px 7px;
    border-left: 1px solid #1890FF;
    color: rgba(0,0,0,0.65);
  }
</style>
