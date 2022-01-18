<template>
  <div class="main">
      <div class="top">
          <div class="portrait">
            <div class="flex">
                <div class="left">
                    <div class="img-box"><img :src="userdetail.avatar" alt=""></div>
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
          </div>
          <div class="customer">
              <div class="total">
                  <div class="sum">
                    <img src="../assets/touxiang.png" alt="">
                    <div style="color: rgba(0,0,0,0.85);font-size:14px">我的客户数量</div>
                  </div>
                  <div class="sum-box">
                      <div class="item">
                          <div class="number">{{userdetail.newCustomerSum}}</div>
                          <div class="text">新增客户数</div>
                      </div>
                      <div class="item">
                          <div class="number">{{userdetail.lostCustomerSum}}</div>
                          <div class="text">流失客户数</div>
                      </div>
                      <div class="item">
                          <div class="number">{{userdetail.newGroupCustomerCount}}</div>
                          <div class="text">新增群客户数</div>
                      </div>
                  </div>
                  <div class="sum" style="margin-top:30px">
                    <img src="../assets/weixin.png" alt="">
                    <div style="color: rgba(0,0,0,0.85);font-size:14px">我的群聊数量</div>
                  </div>
                  <div class="sum-box">
                      <div class="item">
                          <div class="number">{{userdetail.newGroupSum}}</div>
                          <div class="text">新增群聊数</div>
                      </div>
                      <div class="item">
                          <div class="number">{{userdetail.dissolveGroupSum}}</div>
                          <div class="text">解散群聊数</div>
                      </div>
                      <div class="item">
                          <div class="number">{{userdetail.groupSum}}</div>
                          <div class="text">跟进群聊总数</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="under">
        <div class="monthly">
            <div class="img-flex">
              <img src="../assets/monthly.png" alt="">
              <div><img src="../assets/TOP5.png" alt=""></div>
              <img class="king" src="../assets/king.png" alt="">
            </div>
            <div class="button-box">
              <div v-for="(item,index) of navList"
                :key="index"
                class="button-item"
                :class="{activeButtom: status === index}"
                @click="change(index)">
                  {{item}}
              </div>
            </div>
            <div v-if="status===0">
              <div style="margin-top:13px;">
                <div class="self">
                  <div class="record">{{customerRank.myRank.rank}}</div>
                  <div class="avatar img-box"><img :src="customerRank.myRank.avatar" alt=""></div>
                  <div class="name">{{customerRank.myRank.name}}</div>
                  <div class="amount">{{customerRank.myRank.sum}}</div>
                </div>
              </div>
              <div class="self self-item" v-for="(item) in customerRank.rankList" :key="item.rank">
                  <div class="record" v-show="item.rank===4 || item.rank===5">
                    {{item.rank}}
                </div>
                  <div class="avatar img-box"><img :src="item.avatar" alt=""></div>
                  <div class="name">{{item.name}}</div>
                  <div class="amount">{{item.sum}}</div>
              </div>
              <div class="no-more">- 没有更多了 -</div>
            </div>
            <div v-if="status===1">
              <div style="margin-top:13px;">
                <div class="self">
                  <div class="record">{{groupRank.myRank.rank}}</div>
                  <div class="avatar img-box"><img :src="groupRank.myRank.avatar" alt=""></div>
                  <div class="name">{{groupRank.myRank.name}}</div>
                  <div class="amount">{{groupRank.myRank.sum}}</div>
                </div>
              </div>
              <div class="self self-item" v-for="(item,index) in groupRank.rankList" :key="index">
                  <div class="record" v-show="item.rank===4 || item.rank===5">
                    {{item.rank}}
                </div>
                  <div class="avatar img-box"><img :src="item.avatar" alt=""></div>
                  <div class="name">{{item.name}}</div>
                  <div class="amount">{{item.sum}}</div>
              </div>
              <div class="no-more">- 没有更多了 -</div>
            </div>
        </div>
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
      customerRank: {},
      groupRank: {},
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
      console.log(index);
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
        if (res.success) {
          this.userdetail = res.data;
          this.userdetailDate = res.data.date.split('-');
        }
      });
    },
    getCustomerRank() {
      Http.post('scrm/comm/rest/daily-summary/add-customer-rank', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success) {
          this.customerRank = res.data;
        }
      });
    },
    getGroupRank() {
      Http.post('scrm/comm/rest/daily-summary/add-group-rank', {
        date: this.parmasDate,
      }).then((res) => {
        if (res.success) {
          this.groupRank = res.data;
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
    max-width: 414px;
    padding: 14px 15px;
  }
  .portrait{
    width:100%;
    background: #4851FF;
    border-radius: 10px;
  }
  .flex{
    display: flex;
    padding: 21px 18px 31px 18px;
    justify-content: space-between;
  }
  .left{
    display: flex;
  }
  .img-box{
    width:44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    background-color: rgb(238, 238, 238);
    margin-right:10px;

  }
  .img-box >img{
    width:100%;
    height:100%;
  }
  .font-17{
    font-size: 17px;
    color: #FFFFFF;
    margin-bottom:05px;
  }
  .font-11{
    font-size: 11px;
    color: rgba(255,255,255,0.85);
  }
  .right{
    width: 68.08px;
    height: 20px;
    opacity: 0.88;
    background: #FFFFFF;
    border-radius: 12.5px;
    text-align: center;
    line-height: 20px;
    color: #4951FF;
    font-size: 14px;
  }
  .customer{
    background: #FFFFFF;
    border-radius: 10px;
    margin-top:-10px;
    padding: 21px 18px 31px 18px;
  }
  .sum{
    display: flex;
    align-items: center;
    margin-bottom:20px;
  }
  .sum>img{
    width:15px;
    height: 15px;
    margin-right: 10px;
  }
  .sum-box{
      display: flex;
  }
  .sum-box>.item{
      width:33%;
  }
  .sum-box>.item>.number{
    font-size: 24px;
    color: rgba(0,0,0,0.85);
  }
  .sum-box>.item>.text{
    font-size: 12px;
    color: rgba(0,0,0,0.45);
  }
  .under{
    margin-top:10px;
    background-image: linear-gradient(179deg, #D2DEFF 2%, #FFFFFF 100%);
    border-radius: 10px;
  }
  .monthly{
    padding: 21px 18px 21px 18px;
  }
  .img-flex{
    position:relative;
  }
  .img-flex div{
    margin-left: 5px;
    position: absolute;
    z-index: 1000;
    top: 10px;
    display: inline-block;
    text-align: center;
    width: 78.5px;
    height: 20px;
    line-height: 20px;
    background: #4851FF;
    border-radius: 11.5px;
  }
  .img-flex .king{
    position: absolute;
    right: -18px;
    top:-10px;
  }
  .button-box{
    position: relative;
    margin-top: 20px;
    font-size:14px;
    display: flex;
  }
  .button-box>div{
    text-align: center;
    width:50%;
    height: 34px;
    line-height: 34px;
    color: #4851FF;
    display: block;
    background-color: #ffffff;
  }
  .button-box>div:first-child{
    border-radius: 5px 0 0 5px;
  }
  .button-box>div:last-child{
    border-radius: 0 5px 5px 0;
  }
  .activeButtom{
    background: #4851FF !important;
    color: #fff !important;
  }
  .self{
    padding:0 15px;
    display: flex;
    height: 50px;
    line-height: 50px;
    background: #C0C8FF;
    border-radius: 5px;
    margin-bottom:8px;
  }
  .record{
    color: rgba(0,0,0,0.65);
    width: 15px;
    margin-left:05px;
    margin-right: 5%;
    height: 26px;
    font-size:14px;
  }
  .self-item{
    background: #FFFFFF;
    border-radius: 5px;
  }
  .self-item:nth-child(2)::before{
    content: "";
    display: inline-block;
    width:20px;
    height:26px;
    margin-right: 5%;
    margin-top:10px;
    background: url('../assets/frist.png');
    background-size: contain;
  }
  .self-item:nth-child(3)::before{
    content: "";
    display: inline-block;
    width:20px;
    height:26px;
    margin-right: 5%;
    margin-top:10px;
    background: url('../assets/second.png');
    background-size: contain;
  }
  .self-item:nth-child(4)::before{
    content: "";
    display: inline-block;
    width:20px;
    height:26px;
    margin-right: 5%;
    margin-top:10px;
    background: url('../assets/third.png');
    background-size: contain;
  }
  .avatar{
    width:29px !important;
    height: 29px !important;
    margin-top: 10px;
  }
  .name{
    font-size: 15px;
    width:62%;
    color: rgba(0,0,0,0.85);
  }
  .amount{
    font-size: 18px;
    color: #4851FF;
  }
  .no-more{
    font-size: 12px;
    color: rgba(0,0,0,0.45);
    text-align: center;
  }
</style>
