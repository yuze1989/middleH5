<template>
  <div class="workbench">
    <div v-if="err !== '0100000006'">
      <div class="top">
        <span class="span">待办事项 ({{totalCount}})</span>
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
    <div class="errWrap" v-if="err"><jurisdiction :err="err"></jurisdiction></div>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-else class="pull">
      <div class="content">
        <List v-model="loading" :finished="finished" offset="100" @load="onLoad"
          finished-text="没有更多了">
          <div class="content-block" v-for="(item,index) in dataList" :key="index"
           @click="go(item.batchNo)">
            <div class="tite">
              <div class="state" v-if="item.overdueFlag">
                <div class="stateBg"></div>逾期
              </div>
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
import store from '@/store';
import jurisdiction from '../../../common/jurisdiction.vue';
import Http from '../../../utils/http';
import '../workbench.less';

export default {
  name: 'workbench',
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
      dataList: [],
      err: '',
      pageIndex: 1,
      totalPages: 1,
      sopType: {
        1: '群SOP',
        2: '客户SOP',
        3: '朋友圈SOP',
      },
      // 提示数量
      totalCount: 0,
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
      // 清除下拉刷新状态
      that.refreshing = false;
      if (that.pageIndex > that.totalPages) {
        // 结束上拉加载状态
        that.finished = true;
        that.loading = false;
        return;
      }
      Http.post('/scrm/comm/rest/sop/page-group-chat-sop-task-batch', {
        taskStatus: that.$store.state.type,
        pageIndex: that.pageIndex,
        pageSize: 20,
      }, '').then((res) => {
        that.err = '';
        if (res.success && res.totalCount !== 0) {
          that.dataList.push(...res.data);
          that.totalCount = res.totalCount;
          that.totalPages = res.totalPages;// 总页码
          that.loading = false;
          that.pageIndex += 1;
        } else {
          // 停止上拉加载
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
