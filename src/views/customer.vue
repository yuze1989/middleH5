<template>
  <div class="customer">
    <div v-if="err !== '0100000006'">
      <div class="top">
        <span class="span">全部客户 ({{totalCount}})</span>
      </div>
      <div class="hr"></div>
    </div>
    <div class="errWrap" v-if="err"><jurisdiction :err="err" v-if="err"></jurisdiction></div>
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-else class="pull">
      <div class="content">
        <List v-model="loading" :finished="finished" offset="100" @load="onLoad"
          finished-text="没有更多了">
          <div class="item" v-for="(item) in dataList" :key="item.viewId">
            <CustomerItem :item="item" />
          </div>
        </List>
      </div>
    </PullRefresh>
  </div>
</template>

<script>
import { List, PullRefresh, Toast } from 'vant';
import { getCustomerList } from '@/api/dailySummary';
import jurisdiction from '@/common/jurisdiction.vue';
import CustomerItem from './components/customerItem.vue';

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
      // 是否下拉刷新重置
      isRest: false,
      dataList: [],
      err: '',
      pageIndex: 1,
      totalPages: 1,
      // 提示数量
      totalCount: 0,
    };
  },
  methods: {
    onLoad() {
      this.getList();
    },
    onRefresh() {
      this.pageIndex = 1;
      this.isRest = true;
      this.onLoad();
    },
    getList() {
      const that = this;
      if (that.pageIndex > that.totalPages) {
        // 结束上拉加载状态
        that.finished = true;
        that.loading = false;
        return;
      }
      getCustomerList({
        pageIndex: that.pageIndex,
        pageSize: 20,
        allFlag: true,
      }).then((res) => {
        that.err = '';
        if (res.success) {
          if (that.isRest) {
            that.dataList = res.data;
          } else {
            that.dataList.push(...res.data);
          }
          that.totalCount = res.totalCount;
          that.totalPages = res.totalPages;// 总页码
          that.pageIndex += 1;
        }
        that.err = res.errCode;
        if (res.errMessage) {
          Toast(res.errMessage);
        }
        that.isRest = false;
        // 是否还有更多
        that.finished = res.data.length === 0;
        // 清除下拉刷新状态
        that.refreshing = false;
        that.loading = false;
      }).catch(() => {
        that.err = 'errCode';
      });
    },
  },
};
</script>
<style lang="less" scoped="scoped">
  .customer {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    font-family: "PingFang SC";

    .top {
      padding: 1.4rem 1.5rem;
      font-size: 1.4rem;
      text-align: center;
      display: flex;
      align-items: center;
      font-weight: 500;
    }
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
    overflow: auto;
  }

  .errWrap {
    margin-top: 2rem;
  }

  .content {
    margin-bottom: 5rem;
    padding: 1.7rem 1.5rem;
    /* min-height: calc(100vh - 14rem); */
  }

  .item {
    margin-bottom: 1.7rem;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  ::v-deep .van-pull-refresh__head {
    padding-top: 1.7rem;
    box-sizing: border-box;
    line-height: 3.3rem;
  }
</style>
