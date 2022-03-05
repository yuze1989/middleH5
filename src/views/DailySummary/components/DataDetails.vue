<template>
  <div class="dataDetails">
    <user-info
      :user-info="userInfo"
      :params-date="paramsDate"
    />
    <div class="cell">
      <div class="cell_item">
        <div class="cell_head">
          <div class="cell_title">
            <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/touxiang.png">
            <div class="text">我的客户统计</div>
          </div>
          <div class="time_toggle">
            <div
              class="time_item"
              :class="{active: !customerActive}"
              @click="customerActive && toggleTime('customer')"
            >
              近7日
            </div>
            <div
              class="time_item"
              :class="{active: customerActive}"
              @click="!customerActive && toggleTime('customer')"
            >
              近30日
            </div>
          </div>
        </div>
        <div class="data_main">
          <div class="data-item">
            <div class="data-number">{{customerData.newCustomerSum || 0}}</div>
            <div class="data-item-text">新增客户</div>
          </div>
          <div class="data-item">
            <div class="data-number">{{customerData.lostCustomerSum || 0}}</div>
            <div class="data-item-text">流失客户</div>
          </div>
          <div class="data-item" style="margin-bottom: 0;">
            <div class="data-number">{{customerData.newApplyCnt || 0}}</div>
            <div class="data-item-text">发送申请</div>
          </div>
          <div class="data-item" style="margin-bottom: 0;">
            <div class="data-number">{{customerData.customerSum || 0}}</div>
            <div class="data-item-text">客户总数</div>
          </div>
        </div>
        <charts id="customer" style="margin-top: 2rem;" :options="customerOptions" />
      </div>
      <div class="cell_item">
        <div class="cell_head">
          <div class="cell_title">
            <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/weixin.png">
            <div class="text">我的群聊统计</div>
          </div>
          <div class="time_toggle">
            <div
              class="time_item"
              :class="{active: !groupActive}"
              @click="groupActive && toggleTime('group')"
            >
              近7日
            </div>
            <div
              class="time_item"
              :class="{active: groupActive}"
              @click="!groupActive && toggleTime('group')"
            >
              近30日
            </div>
          </div>
        </div>
        <div class="data_main">
          <div class="data-item">
            <div class="data-number">{{groupData.newGroupSum || 0}}</div>
            <div class="data-item-text">新增群聊</div>
          </div>
          <div class="data-item">
            <div class="data-number">{{groupData.newGroupCustomerSum || 0}}</div>
            <div class="data-item-text">新入群客户</div>
          </div>
          <div class="data-item" style="margin-bottom: 0;">
            <div class="data-number">{{groupData.quitGroupSum || 0}}</div>
            <div class="data-item-text">退群客户</div>
          </div>
          <div class="data-item" style="margin-bottom: 0;">
            <div class="data-number">{{groupData.groupSum || 0}}</div>
            <div class="data-item-text">群聊总数</div>
          </div>
        </div>
        <charts id="group" style="margin-top: 2rem;" :options="groupOptions" />
      </div>
      <div class="cell_item">
        <div class="cell_head">
          <div class="cell_title">
            <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/chat.svg">
            <div class="text">我的聊天统计</div>
          </div>
          <div class="time_toggle">
            <div
              class="time_item"
              :class="{active: !chatActive}"
              @click="chatActive && toggleTime('chat')"
            >
              近7日
            </div>
            <div
              class="time_item"
              :class="{active: chatActive}"
              @click="!chatActive && toggleTime('chat')"
            >
              近30日
            </div>
          </div>
        </div>
        <div class="data_main bisection">
          <div class="data-item">
            <div class="data-number">{{chatData.messageCnt || 0}}</div>
            <div class="data-item-text">发送消息数</div>
          </div>
          <div class="data-item">
            <div class="data-number">{{chatData.chatCnt || 0}}</div>
            <div class="data-item-text">单聊客户数</div>
          </div>
        </div>
      </div>
      <div class="cell_item">
        <div class="cell_head">
          <div class="cell_title">
            <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/ch5/dailySummary/circle_friends.svg">
            <div class="text">我的聊天统计</div>
          </div>
          <div class="time_toggle">
            <div
              class="time_item"
              :class="{active: !wechatActive}"
              @click="wechatActive && toggleTime('wechat')"
            >
              近7日
            </div>
            <div
              class="time_item"
              :class="{active: wechatActive}"
              @click="!wechatActive && toggleTime('wechat')"
            >
              近30日
            </div>
          </div>
        </div>
        <div class="data_main bisection">
          <div class="data-item">
            <div class="data-number">{{wechatData.sendNum || 0}}</div>
            <div class="data-item-text">发送数</div>
          </div>
          <div class="data-item">
            <div class="data-number">{{wechatData.commentNum || 0}}</div>
            <div class="data-item-text">评论数</div>
          </div>
          <div class="data-item">
            <div class="data-number">{{wechatData.likeNum || 0}}</div>
            <div class="data-item-text">点赞数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_about">巨准提醒·每日小结</div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  getCustomerStatistics,
  getGroupStatistics,
  getChatStatistics,
  getWechatStatistics,
} from '@/api/dailySummary';
import UserInfo from './UserInfo.vue';
import Charts from '@/components/Charts.vue';

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
  name: 'DataDetails',
  components: {
    UserInfo,
    Charts,
  },
  data() {
    return {
      nowTime: '',

      // 客户统计
      customerData: {},
      customerActive: false,
      customerOptions: {},

      // 群聊统计
      groupData: {},
      groupActive: false,
      groupOptions: {},

      // 聊天统计
      chatData: {},
      chatActive: false,

      // 朋友圈统计
      wechatData: {},
      wechatActive: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    formatTimes(type) {
      return !type ? {
        startDate: moment(this.nowTime).add(-6, 'days').format('YYYY-MM-DD'),
        endDate: moment(this.nowTime).format('YYYY-MM-DD'),
      } : {
        startDate: moment(this.nowTime).add(-1, 'month').format('YYYY-MM-DD'),
        endDate: moment(this.nowTime).format('YYYY-MM-DD'),
      };
    },
    // 初始化获取所有统计数据
    init() {
      this.nowTime = this.paramsDate.replace(/^(\d{4})(\d{2})(\d{2})$/, (_, ...args) => args.slice(0, 3).join('-'));
      this.getCustomerData();
      this.getGroupData();
      this.getChatData();
      this.getCWechatData();
    },
    // 初始化图表配置
    formatCharts(type, data) {
      const legendData = type === 'customer' ? [{
        name: '新增客户',
        key: 'newCustomerSum',
      }, {
        name: '流失客户',
        key: 'lostCustomerSum',
      }, {
        name: '发送申请',
        key: 'newApplyCnt',
      }] : [{
        name: '新增群聊',
        key: 'newGroupSum',
      }, {
        name: '新入群客户',
        key: 'newGroupCustomerSum',
      }, {
        name: '退群客户',
        key: 'quitGroupSum',
      }];
      const series = [];
      const xAxisData = [];
      data.forEach((item) => {
        legendData.forEach((catItem, catIndex) => {
          if (!series[catIndex]) {
            const obj = {
              name: catItem.name,
              type: 'line',
              stack: 'Total',
              showSymbol: false,
              smooth: true,
              emphasis: {
                focus: 'series',
              },
              data: [],
            };
            series.push(obj);
          }
          if (series[catIndex]) {
            series[catIndex].data.push(item[catItem.key] || 0);
          }
        });
        xAxisData.push(moment(item.date).format('MM/DD'));
      });
      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            crossStyle: {
              color: '#999',
              width: '1',
              type: 'dashed',
            },
          },
          borderWidth: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          textStyle: {
            color: '#fff',
            fontWeight: 'Medium',
            fontSize: 12,
          },
        },
        grid: {
          top: '18%',
          left: '3%',
          right: '5%',
          bottom: '0',
          containLabel: true,
        },
        legend: {
          top: '10',
          right: '5%',
          data: legendData.map((item) => ({ name: item.name, icon: 'roundRect' })),
          itemWidth: 16,
          itemHeight: 4,
          textStyle: {
            fontSize: 10,
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: '10',
            color: '#9AA1A9',
          },
        },
        yAxis: {
          type: 'value',
          name: '人数',
          nameTextStyle: {
            color: '#9AA1A9',
            fontSize: '10',
            align: 'right',
          },
          axisLabel: {
            fontSize: '10',
            color: '#9AA1A9',
          },
        },
        series,
      };
      if (type === 'customer') {
        this.customerOptions = options;
      } else {
        this.groupOptions = options;
      }
    },
    // 客户统计
    getCustomerData() {
      const params = this.formatTimes(this.customerActive);
      getCustomerStatistics(params)
        .then((res) => {
          if (!res.success) return;
          const { data } = res;
          this.customerData = data;
          this.formatCharts('customer', data.dayList);
        });
    },
    // 群聊统计
    getGroupData() {
      const params = this.formatTimes(this.groupActive);
      getGroupStatistics(params)
        .then((res) => {
          if (!res.success) return;
          const { data } = res;
          this.groupData = data;
          this.formatCharts('group', data.dayList);
        });
    },
    // 聊天统计
    getChatData() {
      const params = this.formatTimes(this.chatActive);
      getChatStatistics(params)
        .then((res) => {
          if (!res.success) return;
          const { data } = res;
          this.chatData = data;
        });
    },
    // 微信统计
    getCWechatData() {
      const params = this.formatTimes(this.wechatActive);
      getWechatStatistics(params)
        .then((res) => {
          if (!res.success) return;
          const { data } = res;
          this.wechatData = data;
        });
    },
    // 切换时间
    toggleTime(type) {
      switch (type) {
        case 'customer':
          this.customerActive = !this.customerActive;
          this.getCustomerData();
          break;
        case 'group':
          this.groupActive = !this.groupActive;
          this.getGroupData();
          break;
        case 'chat':
          this.chatActive = !this.chatActive;
          this.getChatData();
          break;
        case 'wechat':
          this.wechatActive = !this.wechatActive;
          this.getCWechatData();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>

.cell{
  margin: 0 1.5rem;
}

.cell_item {
  padding: 1.2rem 1.5rem 1.5rem;
  background: #FFFFFF;
  border-radius: 1rem;
}

.cell_item:not(:last-child) {
  margin-bottom: 1rem;
}

.cell_head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cell_title {
  display: flex;
  align-items: center;
}

.cell_title img {
  width: 1.65rem;
  height: 1.6rem;
  margin-right: 0.7rem;
}

.cell_title .text {
  line-height: 2.25rem;
  font-size:1.4rem;
  color: rgba(0,0,0,0.85);
  font-weight: 500;
}

.time_toggle {
  display: flex;
  width: 12.8rem;
  height: 2.8rem;
  padding: 0.2rem;
  background: #F8F8F8;
  border-radius: 1.4rem;
}

.time_item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  line-height: 2rem;
  font-size: 1.4rem;
  color: rgba(0, 0, 0, 0.45);
}

.time_item.active {
  font-weight: 500;
  color: #4851FF;
  position: relative;
  z-index: 2;
}

.time_item.active:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 2.5rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.data_main {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.data-item {
  width: 50%;
  text-align: center;
  margin-bottom: 2rem;
}

.bisection .data-item {
  width: auto;
  flex: 1;
}

.data-number{
  line-height: 3.35rem;
  font-size: 2.4rem;
  font-width: 500;
  color: rgba(0,0,0,0.85);
}

.data-item-text{
  margin-top: 0.4rem;
  line-height: 1.65rem;
  font-size: 1.2rem;
  color: rgba(0,0,0,0.45);
}

.bottom_about {
  padding: 1.9rem 0 2rem;
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.65rem;
  color: rgba(255, 255, 255, 0.65);
}
</style>
