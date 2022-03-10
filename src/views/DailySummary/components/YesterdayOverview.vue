<template>
  <div class="yesterdayMain">
    <user-info
      :user-info="userInfo"
      :params-date="paramsDate"
    />
    <div class="statistics_cell">
      <div class="customer">
        <div class="sum">
          <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/touxiang.png" alt="">
          <div class="sum-text">我的客户统计</div>
        </div>
        <div class="sum-box">
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.newCustomerSum || 0}}</div>
            <div class="sum-item-text">昨日新增</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.lostCustomerSum || 0}}</div>
            <div class="sum-item-text">昨日流失</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.customerSum || 0}}</div>
            <div class="sum-item-text">客户总数</div>
          </div>
        </div>
      </div>
      <div class="group_chat">
        <div class="sum">
          <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/weixin.png" alt="">
          <div class="sum-text">我的群聊统计</div>
        </div>
        <div class="sum-box">
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.newGroupSum || 0}}</div>
            <div class="sum-item-text">昨日新增</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.newGroupCustomerSum || 0}}</div>
            <div class="sum-item-text">昨日新入群</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.groupSum || 0}}</div>
            <div class="sum-item-text">群聊总数</div>
          </div>
        </div>
      </div>
      <div class="chatting">
        <div class="sum">
          <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/chat.svg" alt="">
          <div class="sum-text">我的聊天统计</div>
        </div>
        <div class="sum-box">
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.chatCnt || 0}}</div>
            <div class="sum-item-text">昨日单聊客户数</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.messageCnt || 0}}</div>
            <div class="sum-item-text">昨日发送消息数</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.replyPercentage || 0}}%</div>
            <div class="sum-item-text">已回复聊天占比</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{yesterdayData.avgReplyTime | formatTime}}</div>
            <div class="sum-item-text">平均首次回复时长</div>
          </div>
        </div>
      </div>
    </div>
    <div class="under">
      <img
        style="width:16rem; margin-left: 0.5rem;"
        src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/yesterday_rank.svg"
      >
      <div class="button-box">
        <div
          v-for="(item,index) of navList"
          :key="index"
          class="button-item"
          :class="{active: status === index}" @click="change(index)"
        >
          {{item}}
        </div>
      </div>
      <div v-if="status === 0">
        <div class="my-rank">
          <div class="self">
            <div class="record">{{mycustomerRank.rank}}</div>
            <div class="avatar img-box"><img :src="mycustomerRank.avatar" alt=""></div>
            <div class="name">{{mycustomerRank.name}}</div>
            <div class="amount">{{mycustomerRank.sum}}</div>
          </div>
        </div>
      </div>
      <div v-if="status === 1">
        <div class="my-rank">
          <div class="self">
            <div class="record">{{myGroupRank.rank}}</div>
            <div class="avatar img-box"><img :src="myGroupRank.avatar" alt=""></div>
            <div class="name">{{myGroupRank.name}}</div>
            <div class="amount">{{myGroupRank.sum}}</div>
          </div>
        </div>
      </div>
      <List
        v-model="loading"
        :finished="finished"
        offset="100"
        @load="onLoad"
        finished-text="没有更多了"
        :immediate-check="false"
      >
        <div
          :class="`self-item${[item.rank]}`"
          class="self self-item"
          v-for="(item) in list"
          :key="item.rank"
        >
          <div class="record" v-show="item.rank>3">
            {{item.rank}}
          </div>
          <div class="avatar img-box"><img :src="item.avatar" alt=""></div>
          <div class="name">{{item.name}}</div>
          <div class="amount">{{item.sum}}</div>
        </div>
      </List>
    </div>
  </div>
</template>

<script>
import {
  List,
} from 'vant';
import UserInfo from './UserInfo.vue';
import { getDetail, getMyRank, getRankList } from '@/api/dailySummary';

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
    paramsDate: {
      type: String,
      default: '',
    },
  },
  name: 'YesterdayOverview',
  components: {
    List,
    UserInfo,
  },
  data() {
    return {
      status: 0,
      navList: ['新增客户', '新入群客户'],
      yesterdayData: {},
      mycustomerRank: {},
      myGroupRank: {},
      list: [], // 排行榜数据
      loading: false, // 上拉加载控件 是否处于加载中
      finished: false, // 是否还有下一页
      pageIndex: 1, // 当前所处第几页
      totalPages: 1, // 总页数
      shake: false,
    };
  },
  filters: {
    formatTime(value) {
      if (!value) return '00:00:00';
      const hour = Math.floor(value / 60);
      const minute = Math.floor(value - hour * 60);
      return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:00`;
    },
  },
  created() {
    if (this.paramsDate) {
      this.getYesterdayDetail();
      this.getList();
      this.getMyCustomerRank();
    }
  },
  methods: {
    getYesterdayDetail() {
      getDetail({
        date: this.paramsDate,
      })
        .then((res) => {
          if (!res.success) return;
          const { data } = res;
          this.yesterdayData = data;
        });
    },
    change(index) {
      if (!this.userInfo || this.shake) {
        return;
      }
      this.status = index;
      if (index === 0) {
        this.getMyCustomerRank();
      } else {
        this.getMyGroupRank();
      }
      this.loading = true;
      this.pageIndex = 1;
      this.finished = false;
      this.onLoad();
    },
    // 滚动到底部触发
    onLoad() {
      this.getList();
    },
    getList() {
      const that = this;
      if (that.shake) { // 防抖
        return;
      }
      that.shake = true;
      if (that.pageIndex > that.totalPages) {
        that.finished = true;
        that.loading = false;
        that.shake = false;
        return;
      }
      const params = {
        date: that.paramsDate,
        pageIndex: that.pageIndex,
        pageSize: 20,
        rankType: this.status ? 2 : 1,
      };
      getRankList(params)
        .then((res) => {
          if (res.success && res.totalCount !== 0) {
            that.list = that.pageIndex === 1 ? res.data : that.list.concat(res.data);
            that.loading = false;
            that.totalCount = res.totalCount;
            that.totalPages = res.totalPages;
            that.pageIndex += 1;
            that.shake = false;
          } else {
            that.loading = false;
            that.finished = true;
            that.shake = false;
          }
        });
    },
    getMyCustomerRank() {
      getMyRank({
        date: this.paramsDate,
        rankType: 1,
      }).then((res) => {
        if (res.success && res.data) {
          this.mycustomerRank = res.data;
        }
      });
    },
    getMyGroupRank() {
      getMyRank({
        date: this.paramsDate,
        rankType: 2,
      }).then((res) => {
        if (res.success && res.data) {
          this.myGroupRank = res.data;
        }
      });
    },
  },
};
</script>

<style scoped>

.img-box{
  border-radius: 50%;
  overflow: hidden;
  background-color: rgb(238, 238, 238);
  margin-right:1rem;
}

.img-box img{
  width: 100%;
  height: 100%;
}
.statistics_cell{
  margin: 0 1.5rem;
  background: #FFFFFF;
  border-radius: 1rem;
}

.customer {
  padding-top: 2.1rem;
}
.group_chat,
.chatting{
  margin-top: 3rem;
}
.sum{
  display: flex;
  align-items: center;
  padding-left: 1.6rem;
}
.sum img{
  width: 1.65rem;
  height: 1.6rem;
  margin-right: 0.7rem;
}
.sum-text{
  line-height: 2.25rem;
  font-size: 1.6rem;
  color: rgba(0,0,0,0.85);
  font-weight: 500;
}
.sum-box{
  display: flex;
  padding: 0 1.5rem;
  margin-top: 1.3rem;
}
.chatting .sum-box{
  padding: 0 1.6rem;
  flex-wrap: wrap;
}
.sum-item{
  flex:1;
  text-align: center;
}
.chatting .sum-item{
  flex: auto;
  width: 50%;
  margin-bottom: 2rem;
}
.sum-number{
  line-height: 3.35rem;
  font-size: 2.4rem;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}
.sum-item-text{
  margin-top: 0.4rem;
  line-height: 1.65rem;
  font-size: 1.2rem;
  color: rgba(0,0,0,0.45);
}
.under{
  margin: 1rem 1.5rem 0;
  padding: 2.15rem 1.5rem 1.85rem;
  border-radius: 1rem;
  background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/king.png') no-repeat right 1rem,linear-gradient(179deg, #D2DEFF 2%, #FFFFFF 100%);
}
.button-box{
  margin-top: 1.1rem;
  font-size:1.4rem;
  display: flex;
  text-align: center;
  border-radius:5px;
  overflow: hidden;
}
.button-item{
  flex: 1;
  color: #4851FF;
  background: #fff;
  padding: 0.7rem 0;
}
.active{
  background: #4851FF;
  color: #fff;
}
.my-rank{
  background-color: rgba(72, 81, 255, 0.53);
  border-radius: 0.5rem;
  padding-bottom: 0.1rem;
}
.self{
  margin-top:1.3rem;
  padding:0.5rem 1.5rem;
  display: flex;
  background: #C0C8FF;
  border-radius: 0.5rem;
  margin-bottom:0.3rem;
  align-items: center;
  text-align: center;
}
.record{
  color: rgba(0,0,0,0.65);
  width: 2.1rem;
  margin-right: 5%;
  font-size:1.4rem;
}
.self-item{
  background: #FFFFFF;
  border-radius: 0.5rem;
}

.self-item1::before,
.self-item2::before,
.self-item3::before {
  content: "";
  display: inline-block;
  width: 2.1rem;
  height: 2.6rem;
  margin-right: 5%;
}

.self-item1::before {
  background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/frist.png');
  background-size: cover;
}

.self-item2::before {
  background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/second.png');
  background-size: cover;
}

.self-item3::before {
  background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/third.png');
  background-size: cover;
}
.avatar{
  width:2.9rem;
  height: 2.9rem;
}
.name{
  font-size: 1.5rem;
  width:62%;
  text-align: left;
  color: rgba(0,0,0,0.85);
}
.amount{
  font-size: 1.8rem;
  color: #4851FF;
  width: 2rem;
}
</style>
