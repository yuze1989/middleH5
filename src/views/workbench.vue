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
        <div v-for="(item,index) in nav" :key="index" class="nav-box">
          <div :class="{active: ($store.state.type - 2) === index}"
          @click="change(index)">
            {{item}}
          </div>
        </div>
      </div>
    </div>
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-else>
      <div class="content">
        <div class="content-tip">日常任务提醒</div>
        <List v-model="loading" :finished="finished" offset="100" @load="onLoad"
        finished-text="没有更多了">
          <div class="content-block" v-for="(item,index) in dataList" :key="index"
           @click="go(item.batchNo)">
            <div class="tite">
              <div class="state" v-if="item.overdueFlag">逾期</div>
              <div class="task-name">{{item.sopRuleName}}</div>
            </div>
            <div class="task">{{sopType[item.sopType]}}任务</div>
            <div class="push-date">
              <div>推送时间：{{ time(item.taskTime) }}</div>
              <div v-if="item.taskStatus !== 3">
                <div class="overdue" v-if="item.overdueFlag">
                  (逾期时间：{{item.taskOverdueTimeStr}})</div>
                <div class="surplus" v-else>(剩余时间：{{item.taskSurplusTimeStr}})</div>
              </div>
            </div>
            <div class="task" v-if="item.taskStatus === 3">
              完成时间：{{time(item.finishTime)}}</div>
          </div>
        </List>
      </div>
    </PullRefresh>
  </div>
</template>

<script>
import { List, PullRefresh, Toast } from 'vant';
import moment from 'moment';
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
      refreshing: false,
      loading: false,
      finished: false,
      dataList: [],
      err: '',
      pageIndex: 1,
      sopType: {
        1: '群SOP',
        2: '客户SOP',
        3: '朋友圈SOP',
      },
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
  },
  methods: {
    time(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
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
        name: 'workDetails',
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
        if (res.success && res.totalCount !== 0) {
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
        } else {
          // 清空数组
          that.dataList = [];
          // 停止上拉加载
          that.refreshing = false;
          that.finished = true;
          that.loading = false;
          that.err = res.errCode;
          if (res.errMessage) {
            Toast(res.errMessage);
          }
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
    padding: 1.1rem 1.5rem;
    font-size: 1.4rem;
    color: #1890FF;
    text-align: center;
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  .span {
    margin: 0 1rem;
    font-size: 1.6rem;
    color: #333333;
  }

  .hr {
    width: 100%;
    height: 0.5rem;
    background-color: #E5E5E5;
  }

  .top-nav {
    height: 4.4rem;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    color: #333333;
    text-align: center;
    justify-content: space-evenly;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .nav-box {
    height: 4rem;
    line-height: 4rem;
  }

  .active {
    color: #1890FF;
    border-bottom: 0.2rem #1890FF solid;
  }

  .content {
    margin: 1rem 0 1rem 1.5rem;
    margin-bottom: 5rem;
    min-height: calc(100vh - 14rem);
  }

  .content-tip {
    font-size: 1.4rem;
    color: #333333;
    padding-bottom: 1.2rem;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .content-block {
    padding: 1.2rem 1.5rem 1.2rem 0;
    font-size: 1.2rem;
    color: #999999;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .task-name {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
   white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tite {
    display: flex;
    align-items: center;
  }

  .task {
    margin-top: 0.6rem;
  }

  .push-date {
    margin-top: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .state {
    background: rgba(231, 120, 120, 0.1);
    border-radius: 0.2rem;
    text-align: center;
    padding: 0.2rem 0.5rem;
    font-size: 1.2rem;
    color: rgba(250, 82, 82, 1);
    margin-right: 1rem;
  }

  .overdue {
    font-size: 1.2rem;
    color: #FA5252;
  }

  .surplus {
    color: #1890FF;
  }
</style>
