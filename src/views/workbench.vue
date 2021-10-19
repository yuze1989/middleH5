<template>
  <div class="box">
    <div v-if="err !== '0100000006'">
    <div class="top">
      <i class="iconfont icon-huashu2"></i>
      <span class="span">办事事项</span>
      <span>({{sum}})</span>
    </div>
    <div class="hr"></div>
    <div class="top-nav">
      <div v-for="(item,index) in nav" :key="index">
        <div :class="{active: ($store.state.type-2) === index}" @click="change(index)">
          {{item}}
        </div>
      </div>
    </div>
     </div>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-if="!err">
    <div class="content" :style="'min-height:' + height + 'px'">
       <div class="content-tip">日常任务提醒</div>
      <List v-model="loading" :finished="finished"
      offset="100" @load="onLoad" finished-text="没有更多了">
      <div class="content-block" v-for="(item,index) in dataList" :key="index"
      @click="go(item.batchNo)">
        <div class="tite">
          <div class="state" v-if="item.overdueFlag">逾期</div>
          <div class="task-name">{{item.sopName}}</div>
        </div>
        <div class="task">{{item.sopRuleName}}</div>
        <div class="push-date">
          <div>推送时间：{{ getyyyyMMdd(item.taskTime) }}</div>
          <div v-if="item.taskStatus !== 3">
            <div class="overdue" v-if="item.overdueFlag">
              (逾期时间：{{item.taskOverdueTimeStr}})</div>
            <div class="surplus" v-else>(剩余时间：{{item.taskSurplusTimeStr}})</div>
          </div>
        </div>
        <div class="task" v-if="item.taskStatus === 3">
          完成时间：{{getyyyyMMdd(item.finishTime)}}</div>
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
import store from '@/store';
import jurisdiction from '../common/jurisdiction.vue';

export default {
  components: {
    List,
    PullRefresh,
    jurisdiction,
  },
  name: 'workbench',
  data() {
    return {
      height: 0,
      refreshing: false,
      loading: false,
      finished: false,
      dataList: [],
      err: '',
      pageIndex: 1,
      // 提示数量
      sum: 0,
      // 头部选项卡
      nav: ['未完成', '已完成'],
    };
  },
  mounted() {
    const type = parseInt(sessionStorage.getItem('type'), 0);
    if (type) {
      store.dispatch('SETTYPE', type);
    }
    this.height = document.documentElement.clientHeight - 140;
  },
  methods: {
    getyyyyMMdd(time) {
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? (`0${m}`) : m;
      let d = date.getDate();
      d = d < 10 ? (`0${d}`) : d;
      let h = date.getHours();
      h = h < 10 ? (`0${h}`) : h;
      let minute = date.getMinutes();
      // 分
      minute = minute < 10 ? (`0${minute}`) : minute;
      // 秒
      // let second = date.getSeconds();
      // second = second < 10 ? (`0${second}`) : second;
      return `${y}-${m}-${d} ${h}:${minute}`;
    },
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
    go(id) {
      this.$router.push({
        path: 'workDetails',
        query: {
          batchNo: id,
        },
      });
    },
    getList() {
      const that = this;
      Http.post('/scrm/comm/rest/sop/page-group-chat-sop-task-batch', {
        taskStatus: that.$store.state.type,
        pageIndex: that.pageIndex,
        pageSize: 20,
      }, '').then((res) => {
        that.err = '';
        if (res.success) {
          // 判断获取数据条数若等于0
          if (res.totalCount === 0) {
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
            if (that.dataList.length === res.totalCount) {
              // 结束上拉加载状态
              that.finished = true;
              that.loading = false;
            }
            // 清除下拉刷新状态
            that.refreshing = false;
            that.loading = false;
            that.pageIndex += 1;
          }
        } else {
          that.err = res.errCode;
          Toast(res.errMessage);
        }
      })
        .catch(() => {
          that.err = 'errCode';
        });
    },
    // tab切换
    change(index) {
      store.dispatch('SETTYPE', index + 2);
      sessionStorage.setItem('type', index + 2);
      this.pageIndex = 1;
      this.dataList = [];
      if (!this.finished) {
        this.onLoad();
      }
      this.finished = false;
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
