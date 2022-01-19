<template>
  <div class="main">
    <div class="top">
      <div class="flex">
        <div class="left">
          <div class="img-avatar img-box"><img :src="userdetail.avatar" alt=""></div>
          <div>
            <div class="font-17">{{userdetail.name}}</div>
              <div class="font-11">
                <span v-for="(item) in userdetail.departNameList" :key="item">
                  {{item}}
                  {{userdetail.position}}
                </span>
              </div>
            </div>
          </div>
        <div class="right">{{`${userdetailDate[1]}月${userdetailDate[2]}日`}}</div>
      </div>
      <div class="customer">
        <div class="sum">
          <img src="../assets/touxiang.png" alt="">
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
            <div class="sum-item-text">新增群客户数</div>
          </div>
        </div>
        <div class="sum sum-botttom">
          <img src="../assets/weixin.png" alt="">
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
      <div class="img-flex">
        <img src="../assets/monthly.png" alt="">
        <div class="top-record"><img src="../assets/TOP5.png" alt=""></div>
          <img class="img-king" src="../assets/king.png" alt="">
      </div>
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
        <div class="self">
          <div class="record">{{mycustomerRank.rank}}</div>
          <div class="avatar img-box"><img :src="mycustomerRank.avatar" alt=""></div>
          <div class="name">{{mycustomerRank.name}}</div>
          <div class="amount">{{mycustomerRank.sum}}</div>
        </div>
        <div
          :class="`self-item${[item.rank]}`"
          class="self self-item"
          v-for="(item) in mycustomerRankList" :key="item.rank">
          <div class="record" v-show="item.rank===4 || item.rank===5">
            {{item.rank}}
          </div>
          <div class="avatar img-box"><img :src="item.avatar" alt=""></div>
          <div class="name">{{item.name}}</div>
          <div class="amount">{{item.sum}}</div>
        </div>
      </div>
      <div v-if="status===1">
        <div class="self">
          <div class="record">{{myGroupRank.rank}}</div>
          <div class="avatar img-box"><img :src="myGroupRank.avatar" alt=""></div>
          <div class="name">{{myGroupRank.name}}</div>
          <div class="amount">{{myGroupRank.sum}}</div>
        </div>
        <div
          class="self self-item"
          :class="`self-item${[item.rank]}`"
          v-for="(item,index) in myGroupRankList" :key="index">
          <div class="record" v-show="item.rank===4 || item.rank===5">
            {{item.rank}}
          </div>
          <div class="avatar img-box"><img :src="item.avatar" alt=""></div>
          <div class="name">{{item.name}}</div>
          <div class="amount">{{item.sum}}</div>
        </div>
      </div>
      <div class="no-more">- 没有更多了 -</div>
  </div>
  </div>
</template>

<script>
import Http from '../utils/http';
import util from '../utils/util';

export default {
  name: 'customer',
  data() {
    return {
      status: 0,
      navList: ['新增客户', '新增群聊'],
      userdetail: {},
      userdetailDate: [],
      mycustomerRank: {},
      mycustomerRankList: [],
      myGroupRank: {},
      myGroupRankList: [],
      parmasDate: '',
    };
  },
  mounted() {
    this.parmasDate = util.getUrlOption(window.location.href).date;
    console.log(this.parmasDate);
    this.getDetail();
    this.getCustomerRank();
  },
  methods: {
    change(index) {
      this.status = index;
      if (index === 0) {
        this.getCustomerRank();
      } else {
        this.getGroupRank();
      }
    },
    getDetail() {
      Http.post('scrm/comm/rest/daily-summary/detail', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success && res.data.date) {
          this.userdetail = res.data;
          this.userdetailDate = res.data.date.split('-');
        }
      });
    },
    getCustomerRank() {
      Http.post('scrm/comm/rest/daily-summary/add-customer-rank', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success && res.data) {
          this.mycustomerRank = res.data.myRank;
          this.mycustomerRankList = res.data.rankList;
        }
      });
    },
    getGroupRank() {
      Http.post('scrm/comm/rest/daily-summary/add-group-rank', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success && res.data) {
          this.myGroupRank = res.data.myRank;
          this.myGroupRankList = res.data.rankList;
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
    max-width: 37.6rem;
    padding: 1.4rem 1.5rem;
    height: 100%;
  }
  .top{
    width:100%;
    background: #4851FF;
    border-radius: 1rem;
  }
  .flex{
    display: flex;
    padding: 2.1rem 1.8rem 3.1rem 1.8rem;
    justify-content: space-between;
  }
  .left{
    display: flex;
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
      width:33%;
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
    background-image: linear-gradient(179deg, #D2DEFF 2%, #FFFFFF 100%);
    border-radius: 1rem;
    padding: 2.1rem 1.8rem 2.1rem 1.8rem;
  }
  .img-flex{
    position:relative;
  }
  .top-record{
    margin-left: 0.5rem;
    position: absolute;
    z-index: 1000;
    bottom: 0;
    display: inline-block;
    text-align: center;
    width: 7.85rem;
    height: 2rem;
    line-height: 2rem;
    background: #4851FF;
    border-radius: 1.15rem;
  }
  .img-king{
    position: absolute;
    right: -1.8rem;
    top:-1rem;
  }
  .button-box{
    position: relative;
    margin-top: 2rem;
    font-size:1.4rem;
    display: flex;
    height: 3.4rem;
    line-height: 3.4rem;
    text-align: center;
  }
  .button-item{
    width: 50%;
    color: #4851FF;
    background: #fff;
  }
  .button-item:first-child{
    border-radius: 0.5rem 0 0 0.5rem;
  }
  .button-item:last-child{
    border-radius: 0 0.5rem 0.5rem 0;
  }
  .active{
    background: #4851FF;
    color: #fff;
  }
  .self{
    margin-top:1.3rem;
    padding:0 1.5rem;
    display: flex;
    height: 5rem;
    line-height: 5rem;
    background: #C0C8FF;
    border-radius: 0.5rem;
    margin-bottom:0.8rem;
  }
  .record{
    color: rgba(0,0,0,0.65);
    width: 1.5rem;
    margin-left:0.5rem;
    margin-right: 5%;
    height: 2.6rem;
    font-size:1.4rem;
  }
  .self-item{
    background: #FFFFFF;
  }
  .self-item1::before,
  .self-item2::before,
  .self-item3::before{
    content: "";
    display: inline-block;
    width:2rem;
    height:2.6rem;
    margin-right: 5%;
    margin-top:1rem;
  }
  .self-item1::before{
    background: url('../assets/frist.png');
    background-size: contain;
  }
  .self-item2::before{
    background: url('../assets/second.png');
    background-size: contain;
  }
  .self-item3::before{
    background: url('../assets/third.png');
    background-size: contain;
  }
  .avatar{
    width:2.9rem;
    height: 2.9rem;
    margin-top: 1rem;
  }
  .name{
    font-size: 1.5rem;
    width:62%;
    color: rgba(0,0,0,0.85);
  }
  .amount{
    font-size: 1.8rem;
    color: #4851FF;
  }
  .no-more{
    font-size: 1.2rem;
    color: rgba(0,0,0,0.45);
    text-align: center;
  }
</style>
