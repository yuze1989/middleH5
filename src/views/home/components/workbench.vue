<template>
  <div class="workbench">
    <div v-if="err !== '0100000006'">
      <div class="top">
        <span class="span">办事事项 ({{totalCount}})</span>
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
<style scoped="scoped">
  .workbench {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .top {
    padding: 1.4rem 1.5rem;
    font-size: 1.4rem;
    text-align: center;
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  .span {
    font-size: 1.6rem;
    color: #343845;
    font-weight: 500;
  }

  .hr {
    width: 100%;
    height: 1rem;
    background-color: #F2F3F7;
  }

  .top-nav {
    height: 5rem;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    font-weight: 500;
    color: #333333;
    text-align: center;
    justify-content: space-evenly;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .nav-box {
    height: 5rem;
    line-height: 5rem;
  }

  .active {
    color: #4066D4;
    position: relative;
  }

  .active:after {
    content: '';
    position: absolute;
    width: 100%;
    border-bottom: 0.2rem #4066D4 solid;
    left: 0;
    bottom: 0;
    border-radius: 1.25px;
  }

  .errWrap {
    margin-top: 20px;
  }

  .pull {
    flex: 1;
    overflow: auto;
  }

  .content {
    margin-bottom: 5rem;
    padding-left: 15px;
    /* min-height: calc(100vh - 14rem); */
  }

  .content-block {
    padding: 1.5rem 1.5rem 1.5rem 0;
    font-size: 1.4rem;
    color: #7D8394;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .task-name {
    font-size: 1.4rem;
    color: #343845;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 500;
  }

  .tite {
    display: flex;
    align-items: center;
  }

  .task {
    margin-top: 0.8rem;
  }

  .push-date {
    margin-top: 0.6rem;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .state {
    position: relative;
    text-align: center;
    padding: 0.2rem 0.5rem;
    font-size: 1.2rem;
    color: #F3301E;
    margin-right: 0.9rem;
  }

  .stateBg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #E77878;
    opacity: 0.1;
    border-radius: 0.2rem;
  }

  .overdue {
    font-size: 1.2rem;
    color: #FA5252;
    margin-left: 1.5rem;
  }

  .surplus {
    color: #1890FF;
    margin-left: 1.5rem;
  }
</style>
