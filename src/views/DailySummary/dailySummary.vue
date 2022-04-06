<template>
  <div class="main" :class="{noBack: active === 2}">
    <tabs
      v-model="active"
      color="#4851FF"
      sticky
      title-active-color="#4851FF"
      title-inactive-color="rgba(0,0,0,0.65)"
    >
      <tab title="昨日概览" title-class="tag_title">
        <yesterday-overview
          v-if="paramsDate"
          :user-info="userInfo"
          :params-date="paramsDate"
        />
      </tab>
      <tab title="数据详情" title-class="tag_title">
        <data-details
          v-if="paramsDate"
          :user-info="userInfo"
          :params-date="paramsDate"
        />
      </tab>
      <tab title="榜单排行" title-class="tag_title">
        <ListRank :params-date="paramsDate" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import { Tabs, Tab } from 'vant';
import util from '@/utils/util';
import { getStaffInfo } from '@/api/dailySummary';
import YesterdayOverview from './components/YesterdayOverview.vue';
import DataDetails from './components/DataDetails.vue';
import ListRank from './components/ListRank.vue';

export default {
  name: 'customer',
  components: {
    Tabs,
    Tab,
    YesterdayOverview,
    DataDetails,
    ListRank,
  },
  data() {
    return {
      active: 0,
      userInfo: {},
      paramsDate: '', // 时间数据
    };
  },
  created() {
    this.paramsDate = util.getUrlOption(window.location.href).batchNo;
    if (this.paramsDate) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      getStaffInfo()
        .then((res) => {
          if (res.success) {
            this.departNameList = res.data.departNameList;
            const depLength = this.departNameList.length - 1;
            this.departNameList.forEach((item, index) => {
              this.departNameList[index] = `${item} ${res.data.position} /`;
              if (index === depLength) {
                this.departNameList[index] = `${item} ${res.data.position}`;
              }
            });
            this.userInfo = res.data;
          }
        });
    },
  },
};
</script>
<style scoped="scoped">
  .main{
    margin:0 auto;
    max-width: 40rem;
    min-height: 100vh;
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
    background-color: #4951FF;
    background-image: url("https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/summary_back.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: top center;
  }

  .noBack {
    background-image: none;
  }
</style>
