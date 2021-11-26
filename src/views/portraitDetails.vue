<template>
  <div>
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <div v-else>
      <div class="box">
        <div class="top">
          <img :src="useData.avatar">
          <div>
            <div class="useName">{{useData.name}}</div>
            <div :style="{color:useData.wxType === 1 ? '#00BD5D' : '#1890ff'}">@
              {{useData.wxType === 1 ? '微信' : '企业微信'}}
            </div>
          </div>
        </div>
        <div class="info">
          来源：
          <span class="font-color">
          {{useData.dataFrom === 1 ?'企业微信' :'后台手动添加'}}
          </span>
        </div>
        <div class="info flex">
          <div class="ellipsis">添加时间：
            <span class="font-color">{{useData.gmtCreate || '--'}}</span>
          </div>
          <div class="ellipsis">电话：
            <span class="font-color">{{useData.mobile|| '--'}}</span>
          </div>
          <div class="ellipsis">年龄：
            <span class="font-color">{{useData.age|| '--'}}</span>
          </div>
          <div class="ellipsis">邮箱：
            <span class="font-color">{{useData.email|| '--'}}</span>
          </div>
          <div>企业标签：</div>
          <div class="label-box" v-for="(item,index) in TagDTO" :key="index">
            {{item.name}}
          </div>
        </div>
        <!-- 客户评分 -->
        <div class="board">
          <div class="generalization-border">
            <div>客户评分</div>
            <div class="font">{{useData.grade}}</div>
          </div>
          <div class="generalization-border">
            <div>可用积分</div>
            <div class="font">{{useData.score}}</div>
          </div>
          <div class="generalization-border">
            <div>跟进状态</div>
            <div class="font">{{useData.followStatusName}}</div>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <!-- tab标签 -->
      <div class="top-nav">
        <div v-for="(item,index) in nav" :key="index">
          <div :class="{active: tabIndex === index}" @click="change(index)">
            {{item}}
          </div>
        </div>
      </div>
      <!-- 客户动态 -->
      <div class="distance">
        <div>{{tabIndex === 0 ? '动态' : '消费概览'}}</div>
      </div>
      <PullRefresh v-model="refreshing" @refresh="onRefresh">
        <List v-model="loading" :finished="finished" offset="100"
        @load="onLoad" finished-text="没有更多了"
          :immediate-check="false">
          <!-- 动态部分 -->
          <div v-for="(item,index) in list" :key="index" v-show="tabIndex === 0">
            <div class="date">
              <div>{{item.dateStr}}</div>
            </div>
            <div class="dynamic-magrin">
              <div class="content" v-for="(obj,subscript) in
              item.customerTrendDTOList" :key="subscript">
                <div class="content-left">{{obj.timeStr}}</div>
                <div>
                  <div class="content-title">
                    <i class="iconfont icon-jiedian"></i>
                    <span>{{obj.eventName}}</span>
                  </div>
                  <div class="event" :style=" subscript + 1 ===
                item.customerTrendDTOList.length ?'border: none;':''" v-html="obj.content">
                  </div>
                </div>
              </div>
            </div>
            <div class="hr" v-if="index + 1 !== list.length"></div>
          </div>
          <!-- 全量消费部分 -->
          <div v-show="tabIndex !== 0">
            <div class="generalization">
              <div class="generalization-border">
                <div>消费总金额</div>
                <div class="font">¥
                  {{tofixed(overview.totalConsumption) || 0}}
                </div>
              </div>
              <div class="generalization-border">
                <div>消费总次数</div>
                <div class="font">{{overview.numberOfPurchases || 0}}</div>
              </div>
              <div class="generalization-border">
                <div>最近消费时间</div>
                <div class="font">{{overview.lastPurchaseTime || '无'}}</div>
              </div>
            </div>
            <div class="distance">
              <div>订单详情</div>
            </div>
            <!-- 订单列表 -->
            <div class="order-box" v-for="(item,index) in list" :key="index">
              <div class="order-margin">
                <i class="iconfont icon-shangpu"></i>
                <span class="shopName">{{item.sellerNick}}</span>
              </div>
              <div class="order-introduce" v-for="(val,key) in
              item.platformSubOrderDTOList" :key="key">
                <img :src="val.picPath || require('../assets/default.png')">
                <div class="order-title">
                  {{val.title}}
                </div>
              </div>
              <div class="order-address">
                <i class="iconfont icon-shou collect"></i>
                <div class="ellipsis">
                  {{item.receiverState+item.receiverCity+item.receiverDistrict+
                item.receiverAddress}}
                </div>
              </div>
              <div class="order-money" v-if="item.platformSubOrderDTOList">
                <div>订单金额 <span>¥ {{add(item)}}</span></div>
                <div>实付金额 <span>¥ {{tofixed(item.payment)}}</span></div>
              </div>
            </div>
          </div>
        </List>
      </PullRefresh>
    </div>
  </div>
</template>
<script>
import {
  List,
  PullRefresh,
} from 'vant';
import moment from 'moment';
import Http from '../utils/http';
import Wechat from '../utils/wechat';
import jurisdiction from '../common/jurisdiction.vue';

export default {
  components: {
    List,
    PullRefresh,
    jurisdiction,
  },
  data() {
    return {
      err: '',
      tabIndex: 0,
      source: 2,
      TagDTO: [],
      useData: {},
      refreshing: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      totalPages: 1,
      list: [],
      nav: ['客户动态', '全量消费'],
      overview: '',
      dateDype: 1, // 1 开始时间 2结束时间
      chartDom: {},
      consumption: [], // 消费
      selectDate: '',
      totalCount: 0,
      shake: false, // 防抖
    };
  },
  mounted() {
    const that = this;
    Wechat.setAgentConfig('', 'getCurExternalContact', () => {
      that.getDetails(); // 客户动态数据||订单详情
      that.getList(); // 列表
      that.getTag(); // 标签
    });
  },
  methods: {

    add(item) {
      let totalPrice = 0;
      item.platformSubOrderDTOList.forEach((subOrder) => {
        totalPrice += Number(subOrder.price);
      });
      return totalPrice;
    },
    tofixed(price) {
      const totalPrice = price ? Number(price) : 0;
      return totalPrice;
    },
    onLoad() {
      this.shake = false;
      this.getList();
    },
    time(value) {
      return moment(value).format('YYYY-MM-DD');
    },
    getOverview() {
      Http.post('/scrm/comm/rest/consumption-order/consumption-overview', {
        mobile: this.useData.mobile,
        platformCode: 'ALL',
      }, '').then((res) => {
        if (res.success) {
          this.overview = res.data;
        }
      });
    },
    // tab切换
    change(index) {
      this.list = [];
      // 还没有数据还在加载不让切换
      if (!this.useData.name) {
        return;
      }
      this.tabIndex = index;
      this.shake = false;
      this.pageIndex = 1;
      this.totalCount = 0;
      this.loading = true;
      if (!this.finished) {
        this.onLoad();
      }
      this.finished = false;
    },
    getTag() {
      Http.post('/scrm/customer/getCustomerTagForSidebar', {
        externalUserId: sessionStorage.getItem('userId'),
      }, '').then((res) => {
        if (res.success) {
          this.TagDTO = res.data.pubTagDTOList;
        }
      });
    },
    getDetails() {
      Http.post('/scrm/customer/getCustomerDetailForSidebar', { externalUserId: sessionStorage.getItem('userId') },
        '').then((res) => {
        if (res.success) {
          this.err = '';
          this.useData = res.data;
          this.useData.gmtCreate = this.time(this.useData.gmtCreate);
          this.getOverview(); // 客户订单展示-消费概览
        } else {
          this.err = res.errCode;
        }
      }).catch(() => {
        this.err = 'errCode';
      });
    },
    onRefresh() {
      this.pageIndex = 1;
      this.list = [];
      this.finished = false;
      this.loading = true;
      this.getOverview(); // 客户订单展示-消费概览
      this.onLoad();
    },
    getList() {
      const that = this;
      if (that.shake) { // 防抖
        return;
      }
      // 清除下拉刷新状态
      that.refreshing = false;
      if (that.pageIndex > that.totalPages) {
        // 结束上拉加载状态
        that.finished = true;
        that.loading = false;
        return;
      }
      const url = that.tabIndex === 0
        ? '/scrm/customer/listCustomerTrendForSidebar' : '/scrm/comm/rest/consumption-order/list-page-order';
      const variable = that.tabIndex === 0 ? 'externalUserId' : 'platformCode';
      const data = {
        [variable]: that.tabIndex === 0 ? sessionStorage.getItem('userId') : 'ALL',
        pageIndex: that.pageIndex,
        pageSize: 20,
        mobile: that.useData.mobile,
      };
      Http.post(url, data, '').then((res) => {
        if (res.success && res.totalCount !== 0) {
          that.list = that.pageIndex === 1 ? res.data : that.list.concat(res.data);
          that.loading = false;
          that.totalCount = res.totalCount;
          that.totalPages = res.totalPages;
          that.pageIndex += 1;
          that.shake = true;
        } else {
          // 停止上拉加载
          that.shake = true;
          that.finished = true;
          that.loading = false;
        }
      });
    },
  },
};
</script>
<style scoped>
  .box {
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
  .useName{
    font-size: 1.6rem;
  }
  .dynamic-magrin {
    margin: 0.8rem 0;
  }

  .order-margin {
    margin-bottom: 0.95rem;
  }
  .icon-xiala {
    font-size: 0.8rem !important;
    color: #999999 !important;
    margin-left: 0.8rem;
  }
  .font-color{
    color: rgba(0, 0, 0, 0.65);
  }
  .color {
    color: rgba(0, 0, 0, 0.45);
  }
  .order-money {
    padding-top: 1.5rem;
    border-top: 0.1rem solid #F3F3F3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    color: #999999;
  }

  .order-money span {
    font-size: 1.4rem;
    color: #333333;
  }

  .collect {
    margin-right: 0.45rem;
  }

  .order-address {
    padding: 1.2rem 0;
    font-size: 1.2rem;
    color: #999999;
    display: flex;
    align-items: center;
  }

  .order-introduce {
    display: flex;
    padding-top: 1.5rem;
    border-top: 0.1rem solid #F3F3F3;
    align-items: flex-start;
  }

  .order-introduce img {
    width: 4.4rem;
    margin-right: 1.2rem;
  }

  .flex .ellipsis{
    width: 50%;
  }

  .ellipsis {
    padding: 0.4rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .order-title {
    font-size: 1.4rem;
    color: #333333;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .icon-shangpu {
    font-size: 1.5rem !important;
    color: #999999;
  }

  .order-box {
    border: 0.05rem solid #EEEEEE;
    border-radius: 0.4rem;
    margin: 0 1.5rem 1.5rem 1.5rem;
    padding: 1rem;
  }

  .shopName {
    margin-left: 0.75rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.65);
  }

  .icon-jiedian {
    font-size: 1.6rem;
    color: #1890FF;
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

  .active {
    color: #1890FF;
    border-bottom: 0.2rem #1890FF solid;
  }

  .top-nav div {
    padding: 1.2rem 0;
  }

  .top {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    color: #333333;
    margin-bottom: 0.6rem;
  }

  .top img {
    width: 5rem;
    height: 5rem;
    margin-right: 1rem;
  }

  .info {
    font-size: 1.4rem;
    color: #999999;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .label-box {
    padding: 0 1rem;
    background: rgba(24, 144, 255, 0.05);
    border: 0.05rem solid rgba(24, 144, 255, 0.25);
    border-radius: 0.1rem;
    font-size: 1.1rem;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    margin: 0.3rem;
  }

  .board {
    margin: 1.2rem 0;
    height: 7.4rem;
    background: #F3F9FF;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    color: #999999;
  }

  .generalization {
    border: 0.05rem solid #EEEEEE;
    display: flex;
    align-items: center;
    height: 6.8rem;
    margin: 0 1.5rem;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.45);
  }

  .generalization-border {
    flex: 1;
    text-align: center;
    border-right: solid #F3F3F3 0.1rem;
  }

  .generalization-border:nth-child(3n) {
    border: none;
  }

  .font {
    font-size: 1.6rem;
    margin-top: 0.8rem;
    color: #333333;
  }

  .hr {
    height: 0.8rem;
    background: #F5F5F5;
  }

  .distance {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    font-size: 1.6rem;
    color: #333333;
    display: flex;
    align-items: center;
  }

  .distance::before {
    background-color: #1890FF;
    height: 1.2rem;
    width: 0.3rem;
    margin-right: 1.2rem;
    border-radius: 0.15rem;
    display: block;
    content: "";
  }

  .date {
    padding: 0.8rem 1.5rem;
    border-top: 0.1rem solid #F3F3F3;
    border-bottom: 0.1rem solid #F3F3F3;
    font-size: 1.2rem;
    color: #999999;
    display: flex;
    align-items: center;
  }

  .content {
    display: flex;
    padding: 0 1.5rem;
  }

  .content-left {
    font-size: 1.2rem;
    color: #999999;
    margin-right: 1.2rem;
  }

  .content-title {
    font-size: 1.4rem;
    color: #333333;
  }

  .content-title span {
    margin-left: 1rem;
  }

  .event {
    font-size: 1.4rem;
    padding: 0.8rem 0px 0.8rem 1.8rem;
    margin: 0.4rem 0.7rem;
    border-left: 0.1rem solid #1890FF;
    color: rgba(0, 0, 0, 0.65);
  }
</style>
