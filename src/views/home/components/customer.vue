<template>
  <div class="customer">
    <div v-if="err !== '0100000006'">
      <div class="top">
        <span class="span">全部客户 ({{totalCount}})</span>
      </div>
      <div class="hr"></div>
    </div>
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-else class="pull">
      <div class="content">
        <List v-model="loading" :finished="finished" offset="100" @load="onLoad"
        finished-text="没有更多了">
          <div class="item" v-for="(item,index) in [0, 1, 2]" :key="index">
            <CustomerItem />
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
import Http from '../../../utils/http';
import jurisdiction from '../../../common/jurisdiction.vue';
import CustomerItem from '../../components/customerItem.vue';

export default {
  name: 'customer',
  components: {
    List,
    PullRefresh,
    jurisdiction,
    CustomerItem,
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
      // this.finished = false;
      // this.loading = true;
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
        // 清除下拉刷新状态
        that.refreshing = false;
        that.loading = false;
        if (res.success && res.totalCount !== 0) {
          that.dataList.push(...res.data);
          that.totalCount = res.totalCount;
          that.totalPages = res.totalPages;// 总页码
          that.pageIndex += 1;
        } else {
          // 停止上拉加载
          that.totalCount = 0;
          that.finished = true;
          that.err = res.errCode;
          if (res.errMessage) {
            Toast(res.errMessage);
          }
        }
      }).catch(() => {
        that.err = 'errCode';
      });
    },
  },
};
</script>
<style scoped="scoped">
  .customer {
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

  .pull {
    flex: 1;
  }

  .content {
    margin-bottom: 5rem;
    padding: 17px 15px;
    /* min-height: calc(100vh - 14rem); */
  }

  .item {
    margin-bottom: 18px;
  }

  .item:last-child {
    margin-bottom: 0;
  }
</style>
