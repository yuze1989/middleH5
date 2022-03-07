<template>
  <div class="listRank">
    <div class="main_title">
      <img
        style="width: 9.86rem; margin-left: 0.5rem;"
        src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/rank_list.svg"
      >
      <div v-show="status !== 2" class="selectTime" @click="selectShow = true">
        <span class="select_text">{{ rankTimeList[rankTimeActive] }}</span>
        <icon name="arrow-down" size="1.5rem" color="#fff" />
      </div>
      <popup
        v-model="selectShow"
        position="bottom"
        style="border-radius: 1rem 1rem 0 0; background: #F7F8FA;"
      >
        <div class="popup_main">
          <div class="select_box">
            <div
              v-for="(item, index) in rankTimeList"
              :key="item"
              class="select_item"
              :class="{active: index === rankTimeActive}"
              @click="changeTime(index)"
            >
              {{ item }}
            </div>
          </div>
          <div class="cancel" @click="selectShow = false">
            取消
          </div>
        </div>
      </popup>
    </div>
    <div class="vigilant">
      <span>距离NO.1 你还差一丢丢的努力！</span>
      <div class="rules" @click="rulesShow = true">
        规则
      </div>
      <van-dialog
        v-model="rulesShow"
        width="29.1rem"
        :show-confirm-button="false"
      >
        <div class="dialog_main">
          <div class="dialog_title">排行规则</div>
          <div class="dialog_content">
            <p>【本周排行榜】统计企业内员工一个自然周内的累计数据（周一至昨日24:00）并按照数值从大到小排行；</p>
            <p>注：每周一统计上一个自然周的累计数据；每周二开始统计当周累计数据</p>
            <p>【本月排行榜】统计企业内员工一个自然月内的累计数据（本月1号至昨日24:00）并按照数值从大到小排行；</p>
            <p>注：每月一号统计上一个自然月的累计数据；每月二号开始统计当月累计数据</p>
            <p>【客户总数】截至昨日24:00的客户总数</p>
          </div>
          <button class="dialog_confirm" @click="rulesShow = false">
            我知道了
          </button>
        </div>
      </van-dialog>
    </div>
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
    <div class="my-rank">
      <div class="self">
        <div class="record">{{myRank.rank}}</div>
        <div class="avatar img-box"><img :src="myRank.avatar" alt=""></div>
        <div class="name">{{myRank.name}}</div>
        <div class="amount">{{myRank.sum}}</div>
      </div>
    </div>
    <div class="selectDep" @click="selectContact">
      <div class="search">
        <i class="iconfont icon-shaixuan1" style="color: #4851FF; font-size: 1.1rem" />
        <div class="search_text">
          {{ checkName || '全部员工' }}
        </div>
      </div>
      <icon
        :name="checkName ? 'cross' : 'arrow-down'"
        color="#9C9EA5"
        size="1.5rem"
        @click.stop="checkName && clearCheck()"
      />
    </div>
    <List
      v-model="loading"
      :finished="finished"
      offset="100"
      @load="onLoad"
      finished-text="没有更多了"
      :immediate-check="false"
      style="margin-top: 0.8rem;"
    >
      <div
        :class="`self-item${[item.rank]}`"
        class="self self-item"
        v-for="(item, index) in list"
        :key="index"
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
</template>

<script>
import {
  List,
  Dialog,
  Popup,
  Icon,
} from 'vant';
import { getMyRank, getRankList } from '@/api/dailySummary';
import Wechat, { defaultOptions } from '@/utils/wechat';

export default {
  props: {
    paramsDate: {
      type: String,
      default: '',
    },
  },
  components: {
    List,
    [Dialog.Component.name]: Dialog.Component,
    Popup,
    Icon,
  },
  name: 'ListRank',
  data() {
    return {
      rankTimeActive: 1,
      rankTimeList: ['昨日', '本周', '本月'],
      status: 0,
      navList: ['新增客户', '新入群客户', '客户总数'],
      rankTypeData: [[1, 3, 5], [2, 4, 6]],
      myRank: {},
      myGroupRank: {},
      list: [], // 排行榜数据
      loading: false, // 上拉加载控件 是否处于加载中
      finished: false, // 是否还有下一页
      pageIndex: 1, // 当前所处第几页
      totalPages: 1, // 总页数

      rulesShow: false,

      selectShow: false,

      checkName: '',
      checkIdList: [],
    };
  },
  created() {
    Wechat.initWeChat();
    if (this.paramsDate) {
      this.getList();
      this.getMyRank();
    }
  },
  methods: {
    changeTime(index) {
      this.rankTimeActive = index;
      this.selectShow = false;
      this.change(this.status);
    },
    change(index) {
      this.list = [];
      if (this.shake) return;
      this.status = index;
      const rankType = this.status === 2 ? 7 : this.rankTypeData[this.status][this.rankTimeActive];
      this.getMyRank(rankType);
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
      if (that.shake) return;
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
        rankType: that.status === 2 ? 7 : that.rankTypeData[that.status][that.rankTimeActive],
      };
      if (this.checkIdList.length) {
        params.wxDeptIdList = this.checkIdList;
      }
      getRankList(params)
        .then((res) => {
          if (res.success && res.totalCount !== 0) {
            that.list = that.pageIndex === 1 ? res.data : that.list.concat(res.data);
            that.totalCount = res.totalCount;
            that.totalPages = res.totalPages;
            that.pageIndex += 1;
          } else {
            that.finished = true;
          }
        })
        .finally(() => {
          that.loading = false;
          that.shake = false;
        });
    },
    getMyRank(type = 3) {
      getMyRank({
        date: this.paramsDate,
        rankType: type,
      }).then((res) => {
        if (res.success && res.data) {
          this.myRank = res.data;
        }
      });
    },
    selectContact() {
      const options = {
        ...defaultOptions,
        selectedDepartmentIds: this.checkIdList,
      };
      Wechat.selectEnterpriseContact(options)
        .then((res) => {
          if (res) {
            const depList = res.departmentList;
            const checkName = [];
            this.checkIdList = depList.map((dep) => {
              checkName.push(dep.name);
              return dep.id;
            });
            this.checkName = checkName.join('、');
            this.resetList();
          }
        });
    },
    resetList() {
      this.pageIndex = 1;
      this.getList();
    },
    clearCheck() {
      this.checkName = '';
      this.checkIdList = [];
      this.resetList();
    },
  },
};
</script>

<style scoped>
.listRank{
  margin: 1rem 1.5rem 0;
  padding: 2.15rem 1.5rem 1.85rem;
  border-radius: 1rem;
  background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/king.png') no-repeat right 1rem,linear-gradient(179deg, #D2DEFF 2%, #FFFFFF 100%);
}
.main_title {
  display: flex;
  align-items: center;
}
.popup_main {

}
.select_item,
.cancel{
  line-height: 5rem;
  background: #fff;
  text-align: center;
  font-size: 1.6rem;
  color: #333333;
}
.select_item.active {
  color: #4851FF;
}
.cancel {
  margin-top: 0.8rem;
}

.selectTime {
  display: flex;
  align-items: center;
  padding: 0.2rem 1.2rem;
  margin-left: 1.3rem;
  background: #4851FF;
  border-radius: 50px;
}
.select_text {
  line-height: 2.1rem;
  margin-right: 0.75rem;
  font-size: 1.5rem;
  color: #FFFFFF;
}

.vigilant {
  margin-left: 0.5rem;
  margin-top: 1.3rem;
  position: relative;
  font-size: 1.4rem;
  line-height: 2rem;
  color: rgba(0, 0, 0, 0.45);
}

.rules {
  width: 5.9rem;
  height: 2.75rem;
  line-height: 2.75rem;
  background: #EDF1FF;
  border-radius: 5rem 0 0 5rem;
  font-size: 1.4rem;
  text-align: center;
  color: #4851FF;
  position: absolute;
  top: -0.5rem;
  right: -1.5rem;
}
.dialog_main {
  padding: 2.1rem 2rem 1.3rem;
}
.dialog_title {
  line-height: 2.1rem;
  font-size: 1.5rem;
  text-align: center;
  color: #333333;
}
.dialog_content {
  line-height: 2.4rem;
  font-size: 1.4rem;
  color: #333333;
}
.dialog_confirm {
  width: 100%;
  height: 4.2rem;
  line-height: 2.25rem;
  background: #4851FF;
  border: 1px solid #979797;
  border-radius: 2.2rem;
  font-size: 1.6rem;
  color: #FFFAF2;
}

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
.button-item.active{
  background: #4851FF;
  color: #fff;
}
.my-rank{
  background-color: rgba(72, 81, 255, 0.53);
  border-radius: 0.5rem;
  padding-bottom: 0.1rem;
  margin-top: 1.35rem;
}
.self{
  padding:0.5rem 1.5rem;
  display: flex;
  background: #C0C8FF;
  border-radius: 0.5rem;
  margin-bottom:0.6rem;
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
.selectDep {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.3rem 0.6rem 1.6rem;
  margin-top: 1.2rem;
  opacity: 0.68;
  background: #FFFFFF;
  border-radius: 0.5rem;
}

.selectDep .search {
  width: 0;
  padding-right: 1.9rem;
  flex: 1;
  display: flex;
  align-items: center;
}
.search_text {
  width: 0;
  flex: 1;
  margin-left: 1.05rem;
  line-height: 1.85rem;
  font-size: 1.3rem;
  color: rgba(0, 0, 0, 0.65);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
