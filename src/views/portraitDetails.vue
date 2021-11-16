<template>
  <div>
    <div v-if="!err">
      <div class="box">
        <div class="top">
          <img :src="useData.avatar">
          <div>
            <div>{{useData.name}}</div>
            <div :style="{color:useData.wxType === 1 ? '#00BD5D' : '#1890ff'}">@
              {{useData.wxType === 1 ? '微信' : '企业微信'}}
            </div>
          </div>
        </div>
        <div class="info">
          来源：{{useData.dataFrom === 1 ?'企业微信' :'后台手动添加'}}
        </div>
        <div class="info flex">
          <div class="overf">添加时间：{{useData.gmtCreate}}</div>
          <div class="overf">电话：{{useData.mobile}}</div>
        </div>
        <div class="info flex">
          <div class="overf">年龄：{{useData.age}}</div>
          <div class="overf">邮箱：{{useData.email}}</div>
        </div>
        <div class="info label">
          <div class="overf">企业标签：</div>
          <div class="label-box" v-for="(item,index) in TagDTO" :key="index">
            {{item.name}}
          </div>
        </div>
        <!-- 客户评分 -->
        <div class="board">
          <div>
            <div>客户评分</div>
            <div class="font overf">{{useData.grade}}</div>
          </div>
          <div>
            <div>客户积分</div>
            <div class="font overf">{{useData.score}}</div>
          </div>
          <div style="border: none;">
            <div>跟进状态</div>
            <div class="font overf">{{useData.followStatusName}}</div>
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
        <div class="tite">
          <div class="border"></div>
          <div>{{tabIndex === 0 ? '动态' : '消费概览'}}</div>
        </div>
      </div>
      <PullRefresh v-model="refreshing" @refresh="onRefresh">
        <List v-model="loading" :finished="finished" offset="100" @load="onLoad"
        finished-text="没有更多了"
          :immediate-check="false">
          <!-- 动态部分 -->
          <div v-for="(item,index) in list" :key="index" v-show="tabIndex === 0">
            <div class="tate">
              <div>{{item.dateStr}}</div>
            </div>
            <div style="margin: 8px 0;">
              <div class="content"
              v-for="(obj,subscript) in item.customerTrendDTOList" :key="subscript">
                <div class="content-left">{{obj.timeStr}}</div>
                <div>
                  <div class="content-tite">
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
              <div>
                <div>消费总金额</div>
                <div class="font">¥
                {{tofixed(overview.totalConsumption) || 0}}</div>
              </div>
              <div>
                <div>消费总次数</div>
                <div class="font">{{overview.numberOfPurchases || 0}}</div>
              </div>
              <div style="border: none;">
                <div>最近消费时间</div>
                <div class="font">{{overview.lastPurchaseTime || '无'}}</div>
              </div>
            </div>
            <div class="distance">
              <div class="tite">
                <div class="border"></div>
                <div>订单详情</div>
              </div>
            </div>
            <!-- 订单列表 -->
            <div class="order-box" v-for="(item,index) in list" :key="index">
              <div style="margin-bottom: 9.5px;">
                <i class="iconfont icon-shangpu"></i>
                <span class="shopName">{{item.sellerNick}}</span>
              </div>
              <div class="order-introduce" v-for="(val,idx) in
              item.platformSubOrderDTOList" :key="idx">
                <img :src="val.picPath">
                <div class="order-tite">
                  {{val.title}}
                </div>
              </div>
              <div class="order-address">
                <div class="collect">收</div>
                <div class="overf">
                {{item.receiverState+item.receiverCity+item.receiverDistrict+
                item.receiverAddress}}</div>
              </div>
              <div class="order-money" v-if="item.platformSubOrderDTOList">
                <div>订单金额:  <span>¥ {{add(item)}}</span></div>
                <div>实付金额:  <span>¥ {{tofixed(item.payment)}}</span></div>
              </div>
            </div>
          </div>
        </List>
      </PullRefresh>
    </div>
    <jurisdiction :err="err" v-show="err"></jurisdiction>
  </div>
</template>
<script>
import { List, PullRefresh } from 'vant';
import moment from 'moment';
import Http from '../utils/http';
// import Wechat from '../utils/wechat';
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
      list: [],
      nav: ['客户动态', '全量消费'],
      overview: '',
    };
  },
  mounted() {
    const that = this;
    // Wechat.setAgentConfig('', 'getCurExternalContact', () => {
    that.getDetails();// 客户动态数据||订单详情
    that.getList();// 列表
    that.getTag();// 标签
    // });
  },
  methods: {
    add(item) {
      let totalPrice = 0;
      item.platformSubOrderDTOList.forEach((subOrder) => {
        totalPrice += parseInt((subOrder.price * 1000), 0) / 1000;
      });
      return totalPrice.toFixed(2);
    },
    tofixed(price) {
      let totalPrice = 0;
      totalPrice = parseInt((price * 1000), 0) / 1000;
      return totalPrice.toFixed(2);
    },
    onLoad() {
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
      // 还没有数据还在加载不让切换
      if (!this.useData.name) {
        return;
      }

      this.tabIndex = index;
      this.pageIndex = 1;
      this.list = [];
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
      Http.post('/scrm/customer/getCustomerDetailForSidebar', {
        externalUserId: sessionStorage.getItem('userId'),
      }, '').then((res) => {
        if (res.success) {
          this.err = '';
          this.useData = res.data;
          this.useData.gmtCreate = this.time(this.useData.gmtCreate);
          this.getOverview();// 客户订单展示-消费概览
        } else {
          this.err = res.errCode;
        }
      })
        .catch(() => {
          this.err = 'errCode';
        });
    },
    onRefresh() {
      this.pageIndex = 1;
      this.list = [];
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    getList() {
      const that = this;
      const url = that.tabIndex === 0
        ? '/scrm/customer/listCustomerTrendForSidebar' : '/scrm/comm/rest/consumption-order/list-page-order';
      let data = {};
      if (that.tabIndex === 0) {
        data = {
          externalUserId: sessionStorage.getItem('userId'),
        };
      } else {
        data = {
          platformCode: 'ALL',
          pageIndex: that.pageIndex,
          pageSize: 20,
          mobile: that.useData.mobile, // that.useData.mobile,
        };
      }
      Http.post(url, data, '').then((res) => {
        if (res.success) {
          // 判断获取数据条数若等于0
          if (res.totalCount === 0) {
            // 停止上拉加载
            that.refreshing = false;
            that.finished = true;
            that.loading = false;
          } else {
            that.list.push(...res.data);
            if (that.pageIndex === 1) {
              that.sum = res.totalCount;
            }
            // 清除下拉刷新状态
            that.refreshing = false;
            that.loading = false;
            if (that.list.length === res.totalCount) {
              // 结束上拉加载状态
              that.finished = true;
              that.loading = false;
            }
            that.pageIndex += 1;
          }
        } else {
          // 停止上拉加载
          that.refreshing = false;
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
    padding: 15px 15px 0 15px;
  }
  .order-money{
    padding-top: 15px;
    border-top: 1px solid #F3F3F3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #999999;
  }
  .order-money span{
    font-size: 14px;
    color: #333333;
  }
  .collect{
    min-width: 16px;
    min-height: 16px;
    border: 0.5px solid #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 4.5px;
    font-size: 9px;
  }
  .order-address{
    padding: 15px 0;
    border-top: 1px solid #F3F3F3;
    font-size: 12px;
    color: #999999;
    display: flex;
    align-items: center;
  }
  .order-introduce{
    display: flex;
    padding: 15px 0;
    border-top: 1px solid #F3F3F3;
    align-items: flex-start;
  }
  .order-introduce img{
    width: 44px;
    margin-right: 12px;
  }
  .overf{
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1;
  }
  .order-tite{
    font-size: 14px;
    color: #333333;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 2;
  }
  .icon-shangpu{
    font-size: 15px !important;
    color: #999999;
  }
  .order-box{
    border: 0.5px solid #EEEEEE;
    border-radius: 4px;
    margin: 0 15px 15px 15px;
    padding: 10px;
  }
  .shopName{
    margin-left: 7.5px;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
  }
  .icon-jiedian {
    font-size: 16px;
    color: #1890FF;
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

  .active {
    color: #1890FF;
    border-bottom: 2px #1890FF solid;
  }

  .top-nav div {
    height: 40px;
    line-height: 40px;
  }

  .top {
    display: flex;
    font-family: PingFangSC-Medium;
    align-items: center;
    font-size: 13px;
    color: #333333;
    margin-bottom: 4px;
  }

  .top img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .info {
    padding: 4px 0;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
  }

  .flex {
    display: flex;
  }

  .flex div {
    flex: 1;
  }

  .label {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .label-box {
    width: 45px;
    height: 20px;
    background: rgba(24, 144, 255, 0.05);
    border: 0.5px solid rgba(24, 144, 255, 0.25);
    border-radius: 1px;
    line-height: 20px;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
    text-align: center;
    margin: 6px 6px 0px 0;
  }

  .board {
    margin: 12px 0;
    height: 74px;
    background: #F3F9FF;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
  }

  .generalization {
    border: 0.5px solid #EEEEEE;
    display: flex;
    align-items: center;
    height: 68px;
    margin: 0 15px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }

  .generalization>div,
  .board>div {
    flex: 1;
    text-align: center;
    border-right: solid #DDDDDD 1px;
  }

  .font {
    font-size: 16px;
    margin-top: 8px;
    color: #333333;
  }

  .hr {
    height: 8px;
    margin: 4px 0;
    background: #F5F5F5;
  }

  .distance {
    padding: 20px 15px 15px 15px;
  }

  .tite {
    font-size: 16px;
    color: #333333;
    display: flex;
    align-items: center;
  }

  .border {
    background-color: #1890FF;
    height: 12px;
    width: 3px;
    margin-right: 12px;
    border-radius: 1.5px;
  }

  .tate {
    padding: 8px 15px;
    border-top: 1px solid #F3F3F3;
    border-bottom: 1px solid #F3F3F3;
    font-size: 12px;
    color: #999999;
    display: flex;
    align-items: center;
  }

  .content {
    display: flex;
    padding: 0 15px;
  }

  .content-left {
    font-size: 12px;
    color: #999999;
    margin-right: 12px;
  }

  .content-tite {
    font-size: 14px;
    color: #333333;
  }

  .content-tite span {
    margin-left: 10px;
  }

  .event {
    font-size: 14px;
    padding: 8px 0px 8px 18px;
    margin: 4px 7px;
    border-left: 1px solid #1890FF;
    color: rgba(0, 0, 0, 0.65);
  }
</style>
