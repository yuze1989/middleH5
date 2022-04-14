<template>
  <div>
    <Tabs @change="changeTab" color="#3875C5">
      <Tab :title="`全部线索(${calculateNum.total})`" name=""/>
      <Tab :title="`未添加(${calculateNum.noFriendNum})`" name="0" />
      <Tab :title="`已成功(${calculateNum.isFriendNum})`" name="1" />
    </Tabs>
    <List
      :finished="finished"
      @load="onLoad"
      finished-text="没有更多了"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="list-item"
        @click="$router.push(`/thread-record/${item.taskResultId}`)"
      >
        <div class="item-title">
          <span class="iconfont icon-dianhua icon-tel" />
          <div>
            <div class="phone">{{item.mobile}}
              <span
                @click.stop=""
                class="copy-btn"
                v-clipboard:copy="item.mobile"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >复制</span>
            </div>
            <div v-if="item.level" class="intention">抖店订单 {{item.level}}意向</div>
          </div>
        </div>
        <div class="item-right">
          <div class="status-success" v-if="item.isFriend">已成功</div>
          <div class="status" v-else>未添加</div>
          <div class="detail-text">通话详情<span class="iconfont icon-xiayibu icon-arrows" /></div>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
import {
  Tab, Tabs, List, Toast,
} from 'vant';
import http from '../../utils/http';

export default {
  components: {
    Tab,
    Tabs,
    List,
  },
  mounted() {
    document.title = '添加客户线索为企微好友';
    this.getList();
    this.getCalculateNum();
  },
  data() {
    return {
      list: [],
      calculateNum: {
        total: 0,
        noFriendNum: 0,
        isFriendNum: 0,
      },
      finished: false,
      loading: false,
      searchParam: {
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  methods: {
    onCopy() {
      Toast('复制成功');
    },
    onError() {
      Toast('复制失败，请手动复制');
    },
    changeTab(status) {
      if (status) {
        this.searchParam.status = status;
      } else {
        delete this.searchParam.status;
      }
      this.finished = false;
      this.loading = false;
      this.searchParam.pageIndex = 1;
      http.post('/scrm/comm/rest/ai-call-manual-allot/search', this.searchParam).then((res) => {
        this.list = res.data;
      });
    },
    getList() {
      this.loading = true;
      http.post('/scrm/comm/rest/ai-call-manual-allot/search', this.searchParam).then((res) => {
        // if (res.success) {
        this.loading = false;
        this.list = this.list.concat(res.data);
        if (res.totalCount <= this.list.length) this.finished = true;
        // }}
      });
    },
    getCalculateNum() {
      http.post('/scrm/comm/rest/ai-call-manual-allot/calculate-num').then((res) => {
        if (res.success) {
          this.calculateNum = res.data;
        }
      });
    },
    onLoad() {
      if (this.loading || this.finished) return;
      this.searchParam.pageIndex += 1;
      this.getList();
    },
  },
};
</script>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  margin: 0 1.5rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(0,0,0,.08);
  font-size: 1.2rem;
}
.item-title {
  display: flex;
}
.icon-tel {
  color: #ccc;
  margin: .2rem .8rem 0 0;
  font-size: 1.6rem;
}
.phone {
  font-size: 1.6rem;
}
.intention {
  margin-top: .6rem;
  color: rgba(0,0,0,.45);
}
.status {
  color: rgba(0,0,0,.65);
  margin-bottom: .8rem;
}
.status-success {
  color: #52C41A;
  margin-bottom: .8rem;
}
.item-right {
  text-align: right;
}
.detail-text {
  color: rgba(0,0,0,.45);
}
.icon-arrows {
  font-size: 1rem;
}
.copy-btn {
  background: #F3F3F3;
  font-size: 1.2rem;
  padding: .2rem .5rem;
  color: rgba(0,0,0,.45);
  border-radius: 2rem;
  margin-left: 1rem;
}
.van-tabs {
  border-bottom: 1px solid rgba(0,0,0,.08);
}
.van-tabs__line {
  background-color: #3875C5;
}
</style>
