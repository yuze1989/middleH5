<template>
  <div class="main">
    <div class="top">
      <div class="flex">
        <div class="img-avatar img-box"><img :src="userdetail.avatar" alt=""></div>
        <div class="right">
          <div class="text-box">
            <div class="font-17">{{userdetail.name}}</div>
            <div class="date">
            {{userdetailDate.length>0?`${userdetailDate[1]}月${userdetailDate[2]}日`:''}}
            </div>
          </div>
          <div class="font-11">
            <span v-for="(item) in departNameList" :key="item">
              {{item}}
            </span>
          </div>
        </div>
      </div>
      <div class="customer">
        <div class="sum">
          <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/touxiang.png" alt="">
          <div class="sum-text">我的客户数量</div>
        </div>
        <div class="sum-box">
          <div class="sum-item">
            <div class="sum-number">{{userdetail.newCustomerSum}}</div>
            <div class="sum-item-text">新增客户数</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{userdetail.lostCustomerSum}}</div>
            <div class="sum-item-text">流失客户数</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{userdetail.newGroupCustomerCount}}</div>
            <div class="sum-item-text">新入群客户数</div>
          </div>
        </div>
        <div class="sum sum-botttom">
          <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/weixin.png" alt="">
          <div class="sum-text">我的群聊数量</div>
        </div>
        <div class="sum-box">
          <div class="sum-item">
            <div class="sum-number">{{userdetail.newGroupSum}}</div>
            <div class="sum-item-text">新增群聊数</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{userdetail.dissolveGroupSum}}</div>
            <div class="sum-item-text">解散群聊数</div>
          </div>
          <div class="sum-item">
            <div class="sum-number">{{userdetail.groupSum}}</div>
            <div class="sum-item-text">跟进群聊总数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="under">
      <img style="width:16rem" src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/monthly.svg" alt="">
      <div class="button-box">
        <div v-for="(item,index) of navList"
          :key="index"
          class="button-item"
          :class="{active: status === index}"
          @click="change(index)">
            {{item}}
        </div>
      </div>
      <div v-if="status===0">
        <div class="my-rank">
          <div class="self">
            <div class="record">{{mycustomerRank.rank}}</div>
            <div class="avatar img-box"><img :src="mycustomerRank.avatar" alt=""></div>
            <div class="name">{{mycustomerRank.name}}</div>
            <div class="amount">{{mycustomerRank.sum}}</div>
          </div>
        </div>
      </div>
      <div v-if="status===1">
        <div class="my-rank">
          <div class="self">
            <div class="record">{{myGroupRank.rank}}</div>
            <div class="avatar img-box"><img :src="myGroupRank.avatar" alt=""></div>
            <div class="name">{{myGroupRank.name}}</div>
            <div class="amount">{{myGroupRank.sum}}</div>
          </div>
        </div>
      </div>
        <PullRefresh v-model="refreshing" @refresh="onRefresh">
          <List v-model="loading"
            :finished="finished" offset="100"
            @load="onLoad" finished-text="没有更多了"
            :immediate-check="false">
              <div
                :class="`self-item${[item.rank]}`"
                class="self self-item"
                v-for="(item) in list" :key="item.rank">
                <div class="record" v-show="item.rank>3">
                  {{item.rank}}
                </div>
                <div class="avatar img-box"><img :src="item.avatar" alt=""></div>
                <div class="name">{{item.name}}</div>
                <div class="amount">{{item.sum}}</div>
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
  Toast,
} from 'vant';
import Http from '../utils/http';
import util from '../utils/util';

export default {
  name: 'customer',
  components: {
    List,
    PullRefresh,
  },
  data() {
    return {
      status: 0,
      navList: ['新增客户', '新增群聊'],
      userdetail: {},
      userdetailDate: [],
      mycustomerRank: {},
      myGroupRank: {},
      parmasDate: '',
      departNameList: [],
      refreshing: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      totalPages: 1,
    };
  },
  created() {
    this.parmasDate = util.getUrlOption(window.location.href).batchNo;
    if (this.parmasDate) {
      this.getDetail();
      this.getList();
      this.getMyCustomerRank();
    }
  },
  methods: {
    change(index) {
      this.list = [];
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
    onLoad() {
      this.getList();
    },
    onRefresh() {
      this.pageIndex = 1;
      this.list = [];
      this.loading = true;
      this.finished = false;
      if (this.status === 0) {
        this.getMyCustomerRank();
      } else {
        this.getMyGroupRank();
      }
      this.onLoad();
    },
    getList() {
      const that = this;
      that.refreshing = false;
      if (that.pageIndex > that.totalPages) {
        that.finished = true;
        that.loading = false;
        return;
      }
      const url = that.status === 0 ? 'scrm/comm/rest/daily-summary/page-add-customer-rank-month' : 'scrm/comm/rest/daily-summary/page-add-group-rank-month';
      const parmas = {
        date: that.parmasDate,
        pageIndex: that.pageIndex,
        pageSize: 20,
      };
      Http.post(url, parmas).then((res) => {
        if (res.success && res.totalCount !== 0) {
          that.list = that.pageIndex === 1 ? res.data : that.list.concat(res.data);
          that.loading = false;
          that.totalCount = res.totalCount;
          that.totalPages = res.totalPages;
          that.pageIndex += 1;
        } else if (res.errCode === '0100000014') {
          that.loading = true;
          that.finished = false;
          Toast(res.errMessage);
        } else {
          that.loading = false;
          that.finished = true;
        }
      });
    },
    getDetail() {
      Http.post('scrm/comm/rest/daily-summary/detail', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success && res.data.date) {
          this.departNameList = res.data.departNameList;
          const depLength = this.departNameList.length - 1;
          this.departNameList.forEach((item, index) => {
            this.departNameList[index] = `${item} ${res.data.position} /`;
            if (index === depLength) {
              this.departNameList[index] = `${item} ${res.data.position}`;
            }
          });
          this.userdetail = res.data;
          this.userdetailDate = res.data.date.split('-');
        }
      });
    },
    getMyCustomerRank() {
      Http.post('scrm/comm/rest/daily-summary/my-add-customer-rank-month', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success && res.data) {
          this.mycustomerRank = res.data;
        }
      });
    },
    getMyGroupRank() {
      Http.post('scrm/comm/rest/daily-summary/my-add-group-rank-month', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success && res.data) {
          this.myGroupRank = res.data;
        }
      });
    },
  },
};
</script>
<style scoped="scoped">
  .main{
    background-color: #EBECF0;
    margin:0 auto;
    max-width: 40rem;
    padding: 1.4rem 1.5rem;
  }
  .top{
    width:100%;
    background: #434cfb;
    border-radius: 1rem;
  }
  .flex{
    display: flex;
    padding: 2.1rem 1.8rem 3.1rem 1.8rem;
    justify-content: space-between;
  }
  .img-box{
    border-radius: 50%;
    overflow: hidden;
    background-color: rgb(238, 238, 238);
    margin-right:1rem;
  }
  .img-avatar{
    width:4.4rem;
    height: 4.4rem;
  }
  .img-box img{
    width:100%;
    height:100%;
  }
  .font-17{
    font-size: 1.7rem;
    color: #FFFFFF;
    margin-bottom:0.5rem;
  }
  .font-11{
    font-size: 1.1rem;
    color: rgba(255,255,255,0.85);
  }
  .right{
    width: 82%;
  }
  .text-box{
    display: flex;
    justify-content: space-between;
  }
  .date{
    width: 6.808rem;
    height: 2rem;
    opacity: 0.88;
    background: #FFFFFF;
    border-radius: 1.25rem;
    text-align: center;
    line-height: 2rem;
    color: #4951FF;
    font-size: 1.4rem;
  }
  .customer{
    background: #FFFFFF;
    border-radius: 1rem;
    margin-top:-1rem;
    padding: 2.1rem 1.8rem 3.1rem 1.8rem;
  }
  .sum{
    display: flex;
    align-items: center;
    margin-bottom:2rem;
  }
  .sum-botttom{
    margin-top:3rem;
  }
  .sum img{
    width:1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }
  .sum-text{
    color: rgba(0,0,0,0.85);
    font-size:1.4rem;
  }
  .sum-box{
      display: flex;
  }
  .sum-item{
      flex:1;
      text-align: center;
  }
  .sum-number{
    font-size: 2.4rem;
    color: rgba(0,0,0,0.85);
  }
  .sum-item-text{
    font-size: 1.2rem;
    color: rgba(0,0,0,0.45);
  }
  .under{
    margin-top:1rem;
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/king.png') no-repeat right 1rem,linear-gradient(179deg, #D2DEFF 2%, #FFFFFF 100%);
    padding: 2.1rem 1.8rem 2.1rem 1.8rem;
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
  .self-item3::before{
    content: "";
    display: inline-block;
    width:2.1rem;
    height:2.6rem;
    margin-right: 5%;
  }
  .self-item1::before{
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/frist.png');
    background-size: cover;
  }
  .self-item2::before{
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/second.png');
    background-size: cover;
  }
  .self-item3::before{
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/third.png');
    background-size:cover;
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
  .no-more{
    font-size: 1.2rem;
    color: rgba(0,0,0,0.45);
    text-align: center;
    margin-top: 1rem;
  }
</style>
