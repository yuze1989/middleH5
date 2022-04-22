<template>
  <div class="workbench">
    <div v-if="taskData.err !== '0100000006'">
      <div class="top"><span class="span">待办事项 ({{taskData.totalCount}})</span></div>
      <div class="hr"></div>
      <div class="top-nav">
        <div v-for="(item,index) in nav" :key="index" class="nav-box">
          <div :class="{active: (type - 2) === index}"
            @click="change(index)">
            {{item}}
          </div>
        </div>
      </div>
    </div>
    <div class="errWrap" v-if="taskData.err"><jurisdiction :err="taskData.err"></jurisdiction></div>
    <div class="wrap" ref="taskWrapRef" v-else>
      <PullRefresh v-model="taskData.refreshing" @refresh="onRefresh" class="pull">
        <div class="content">
          <List v-model="taskData.loading"
            :finished="taskData.finished" offset="100" @load="getList" finished-text="没有更多了">
            <div v-for="(item,index) in taskData.dataList" :key="index">
              <TaskItem :taskItem="item" :key="index" />
            </div>
          </List>
        </div>
      </PullRefresh>
    </div>
  </div>
</template>

<script>
import { List, PullRefresh, Toast } from 'vant';
import { mapState } from 'vuex';
import jurisdiction from '@/common/jurisdiction.vue';
import Http from '@/utils/http';
import TaskItem from './components/taskItem.vue';
import './workbench.less';

const initData = {
  refreshing: false,
  loading: false,
  finished: false,
  dataList: [],
  err: '',
  pageIndex: 1,
  totalPages: 1,
  scrollTop: 0,
  totalCount: 0,
};
export default {
  name: 'workbench',
  components: {
    List,
    PullRefresh,
    jurisdiction,
    TaskItem,
  },
  data() {
    return {
      data2: initData,
      data3: initData,
      // 头部选项卡
      nav: ['未完成', '已完成'],
    };
  },
  computed: {
    ...mapState({
      type: (state) => state.statusType.type,
    }),
    taskData() {
      return this[`data${this.type}`];
    },
  },
  activated() {
    if (this.$refs.taskWrapRef) {
      this.$nextTick(() => {
        this.$refs.taskWrapRef.scrollTop = this.taskData.scrollTop || 0;
      });
    }
  },
  mounted() {
    if (this.$refs.taskWrapRef) {
      this.$refs.taskWrapRef.addEventListener('scroll', () => {
        this[`data${this.type}`].scrollTop = this.$refs.taskWrapRef.scrollTop;
      });
    }
    const sessionType = parseInt(sessionStorage.getItem('type'), 0);
    if (sessionType) {
      this.$store.dispatch('statusType/SETTYPE', sessionType);
    }
  },
  methods: {
    onRefresh() {
      this[`data${this.type}`] = initData;
      this.getList();
    },
    doneOnRefresh() {
      this.doneData = initData;
      this.getList();
    },
    getList() {
      const that = this;
      if (that.taskData.pageIndex > that.taskData.totalPages) {
        // 结束上拉加载状态
        that[`data${this.type}`].finished = true;
        that[`data${this.type}`].loading = false;
        return;
      }
      Http.post('/scrm/comm/rest/sop/page-group-chat-sop-task-batch', {
        taskStatus: that.type,
        pageIndex: that.taskData.pageIndex,
        pageSize: 20,
      }, '').then((res) => {
        if (res.success && res.totalCount !== 0) {
          const data = {
            refreshing: false,
            loading: false,
            finished: false,
            dataList: [...that.taskData.dataList, ...res.data],
            err: res.errCode,
            pageIndex: that.taskData.pageIndex + 1,
            totalPages: res.totalPages, // 总页码
            scrollTop: 0,
            totalCount: res.totalCount,
          };
          that[`data${this.type}`] = data;
        } else {
          const data = {
            refreshing: false,
            loading: false,
            finished: true,
            dataList: that.taskData.dataList,
            err: res.errCode,
            pageIndex: that.taskData.pageIndex,
            totalPages: that.taskData.totalPages, // 总页码
            scrollTop: that.taskData.scrollTop,
            totalCount: that.taskData.totalCount,
          };
          that[`data${this.type}`] = data;
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
      this.$store.dispatch('statusType/SETTYPE', index + 2);
      sessionStorage.setItem('type', index + 2);
      if (this.$refs.taskWrapRef) {
        this.$nextTick(() => {
          this.$refs.taskWrapRef.scrollTop = this.taskData.scrollTop || 0;
        });
      }
      if (!this.taskData.dataList.length) {
        this.getList();
      }
    },
  },
};
</script>
