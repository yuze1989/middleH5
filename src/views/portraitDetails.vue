<template>
  <div>
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
        <div>添加时间：{{useData.gmtCreate}}</div>
        <div>电话：{{useData.mobile}}</div>
      </div>
      <div class="info flex">
        <div>年龄：{{useData.age}}</div>
        <div>邮箱：{{useData.email}}</div>
      </div>
      <div class="info label">
        <div>企业标签：</div>
        <div class="label-box" v-for="(item,index) in useData.TagDTO" :key="index">
          {{item.name}}
        </div>
      </div>
      <div class="board">
        <div>
          <div>客户评分</div>
          <div class="font">{{useData.grade}}</div>
        </div>
        <div>
          <div>客户积分</div>
          <div class="font">{{useData.score}}</div>
        </div>
        <div style="border: none;">
          <div>跟进状态</div>
          <div class="font">新客户</div>
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="distance">
      <div class="tite">
        <div class="border"></div>
        <div>动态</div>
      </div>
    </div>
    <!-- 动态部分 -->
    <PullRefresh v-model="refreshing" @refresh="onRefresh">
      <List v-model="loading" :finished="finished" offset="100"
      @load="onLoad" finished-text="没有更多了">
        <div v-for="(item,index) in list" :key="index">
          <div class="tate">
            <div>{{item.dateStr}}</div>
          </div>
          <div style="margin: 8px 0;">
            <div class="content" v-for="(obj,subscript) in item.customerTrendDTOList"
            :key="subscript">
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
  </List>
  </PullRefresh>
  </div>
</template>
<script>
import { List, PullRefresh, Toast } from 'vant';
import Http from '../utils/http';
import Wechat from '../utils/wechat';

export default {
  components: {
    List,
    PullRefresh,
  },
  data() {
    return {
      source: 2,
      label: [{ name: '高意向' }, { name: '低意向' }],
      useData: {},
      refreshing: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: [],
    };
  },
  async mounted() {
    await Wechat.setWxConfig();
    await Wechat.setAgentConfig('', 'getCurExternalContact');
    this.getDetails();
  },
  methods: {
    onLoad() {
      this.getList();
    },
    getyyyyMMdd(time) {
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? (`0${m}`) : m;
      let d = date.getDate();
      d = d < 10 ? (`0${d}`) : d;
      return `${y}-${m}-${d}`;
    },
    getDetails() {
      if (!sessionStorage.getItem('userId')) {
        this.getDetails();
        return;
      }
      Http.post('/scrm/customer/getCustomerDetailForSidebar', {
        externalUserId: sessionStorage.getItem('userId'),
      }, '').then((res) => {
        if (res.success) {
          this.useData = res.data;
          this.useData.gmtCreate = this.getyyyyMMdd(this.useData.gmtCreate);
        } else {
          Toast(res.errMessage);
        }
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
      if (!sessionStorage.getItem('userId')) {
        that.getList();
        return;
      }
      Http.post('/scrm/customer/listCustomerTrendForSidebar', {
        externalUserId: sessionStorage.getItem('userId'), // 'wmuUNZDwAAABHuwXqYCtn3Gg-EnK7BUQ',
        pageSize: 10,
        pageIndex: that.pageIndex,
      }, '').then((res) => {
        if (res.success) {
          // 判断获取数据条数若等于0
          if (res.totalCount === 0) {
            // 停止上拉加载
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
            }
            that.pageIndex += 1;
          }
        } else {
          Toast(res.errMessage);
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

  .icon-jiedian {
    font-size: 16px;
    color: #1890FF;
  }

  .top {
    display: flex;
    font-family: PingFangSC-Medium;
    align-items: center;
    font-size: 16px;
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
    margin-right: 6px;
  }

  .board {
    margin: 8px 0;
    height: 74px;
    background: #F3F9FF;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
  }

  .board>div {
    flex: 1;
    text-align: center;
    border-right: solid #DDDDDD 1px;
  }

  .font {
    font-size: 16px;
    margin-top: 8px;
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
    -webkit-line-clamp: 1;
  }

  .hr {
    height: 8px;
    margin: 4px 0;
    background: #F5F5F5;
  }

  .distance {
    padding: 8px 15px;
    border-bottom: 1px solid #F3F3F3;
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
