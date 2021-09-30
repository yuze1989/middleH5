<template>
  <div class="box">
    <div class="top-box">
      <div class="tite">
        <div class="task-name">{{dataList.sopName}}</div>
        <div class="state" v-if="dataList.overdueFlag">逾期</div>
      </div>
      <div class="task">{{dataList.sopRuleName}}</div>
      <div class="push-date">
        <div>推送时间：{{taskTime}}</div>
        <div v-if="dataList.taskStatus !== 3">
          <div class="overdue" v-if="dataList.overdueFlag">
            (逾期时间：{{dataList.taskOverdueTimeStr}})</div>
          <div class="surplus" v-else>(剩余时间{{dataList.taskSurplusTimeStr}})</div>
        </div>
      </div>
      <div class="task" v-if="dataList.taskStatus === 3">完成时间：{{ finishTime}}</div>
    </div>
    <div class="hr"></div>
    <!-- 推送内容 -->
    <div class="content">
      <div class="content-tip" style="border: none;">推送内容</div>
      <div class="flex" v-for="(item,index) in dataList.sopRuleContentList" :key="index"
      @click="copy(item)">
        <div class="left">
          <i class="iconfont icon-wenzi" v-if="item.contentType === 1"></i>
          <i class="iconfont icon-tupian" v-if="item.contentType === 2"></i>
          <i class="iconfont icon-bianzu" v-if="item.contentType === 3"></i>
        </div>
        <div class="right">
          <div class="right-top">
            <div class="right-tite">
              <span v-if="item.contentType === 1">文本</span>
              <span v-if="item.contentType === 2">图片</span>
              <span v-if="item.contentType === 3">链接</span>
            </div>
            <div class="copy">
              <i class="iconfont icon-fuzhi"></i>
              <span>复制</span>
             </div>
          </div>
          <div class="right-content" v-if="item.contentType !== 2">
          {{item.text || item.linkUrl}}</div>
          <div class="right-content" v-else>
            <img :src="item.imgUrl" >
          </div>
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <!-- 推送群聊 -->
    <div class="content" style="margin-bottom: 60px;">
      <div class="content-tip">推送群聊</div>
      <div class="list" v-for="(item,index) in dataList.sopTaskList" :key="index"
      @click.stop="change(item)">
        <div class="list-flex">
          <div v-if="dataList.taskStatus !== 3">
            <div v-if="item.taskStatus === 2">
              <i class="iconfont icon-weixuanze" v-show="!item.isSelect"></i>
              <i class="iconfont icon-xuanze" v-show="item.isSelect"></i>
            </div>
            <div v-else>
              <i class="iconfont icon-xuanze" style="color: #E5E5E5 !important;"></i>
            </div>
          </div>
          <div class="group">
            <i class="iconfont icon-touxiang"></i>
          </div>
          <div>
            <div class="list-flex">
              <div class="list-content">{{item.groupChatName}}</div>
              <div :class="item.taskStatus === 3 ? 'yes' : 'no'">
              {{item.taskStatus === 3 ? '已完成' : '未完成'}}</div>
            </div>
            <div class="date" v-if="item.taskStatus === 3">
              完成时间：{{getyyyyMMdd(item.taskFinishTime)}}
            </div>
          </div>
        </div>
        <div class="icon" @click.stop="share(item)"><i class="iconfont icon-fasong"></i></div>
      </div>
    </div>
    <div class="footer" v-if="dataList.taskStatus !== 3">
      <div class="footer-left" @click="cancel">取消</div>
      <div class="footer-right" @click="determine">完成</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import Http from '../utils/http';
import Utils from '../utils/util';
import Wechat from '../utils/wechat';

export default {
  name: 'workDetails',
  data() {
    return {
      dataList: [],
      batchNo: '',
      idList: [],
      taskTime: '',
      finishTime: '',
    };
  },
  mounted() {
    Wechat.setWxConfig();
    this.batchNo = this.$route.query.batchNo;
    this.getList();
  },
  methods: {
    // 分享
    share(obj) {
      if (obj.taskStatus === 3) {
        return;
      }
      const data = {
        chatId: obj.wxGroupChatId,
      };
      Wechat.openExistedChatWithMsg(data, 2);
    },
    change(obj) {
      const data = obj;
      data.isSelect = !data.isSelect;
    },
    getyyyyMMdd(time) {
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? (`0${m}`) : m;
      let d = date.getDate();
      d = d < 10 ? (`0${d}`) : d;
      let h = date.getHours();
      h = h < 10 ? (`0${h}`) : h;
      let minute = date.getMinutes();
      // 分
      minute = minute < 10 ? (`0${minute}`) : minute;
      // 秒
      // let second = date.getSeconds();
      // second = second < 10 ? (`0${second}`) : second;
      return `${y}-${m}-${d} ${h}:${minute}`;
    },
    // 复制
    copy(obj) {
      let content;
      if (obj.contentType === 1) {
        content = obj.text;
      }
      if (obj.contentType === 2) {
        content = obj.imgUrl;
      }
      if (obj.contentType === 3) {
        content = obj.linkUrl;
      }
      const input = document.createElement('input'); // 直接构建input
      input.value = content; // 设置内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand('Copy'); // 执行复制
      Toast.success('复制成功');
      document.body.removeChild(input); // 删除临时实例
    },
    // 取消
    cancel() {
      this.idList = [];
      this.dataList.sopTaskList.forEach((item) => {
        const data = item;
        data.isSelect = false;
      });
    },
    // 完成
    determine() {
      const that = this;
      that.idList = [];
      that.dataList.sopTaskList.forEach((item) => {
        const data = item;
        if (data.taskStatus === 2 && data.isSelect) {
          that.idList.push(data.id);
        }
      });
      if (that.idList.length === 0) {
        Toast.loading({
          message: '请选择完成的群聊',
          duration: 1000,
          type: 'fail',
        });
        return;
      }
      Toast.loading({
        type: 'loading',
        duration: 0,
        forbidClick: true, // 禁用背景点击
      });
      Http.post('/scrm/comm/rest/sop/finish-sop-task', {
        idList: that.idList,
      }, '').then((res) => {
        if (res.success) {
          that.getList();
          Toast.loading({
            message: res.errMessage,
            duration: 1,
            type: 'success',
          });
        } else {
          Toast.loading({
            message: res.errMessage,
            duration: 1000,
            type: 'fail',
          });
        }
      });
    },
    getList() {
      const that = this;
      Http.post('/scrm/comm/rest/sop/get-sop-task-batch-detail', {
        batchNo: that.batchNo,
      }, '').then((res) => {
        if (res.success) {
          res.data.sopTaskList.forEach((item) => {
            const data = item;
            data.isSelect = false;
          });
          that.taskTime = Utils.getyyyyMMdd(res.data.taskTime);
          that.finishTime = Utils.getyyyyMMdd(res.data.finishTime);
          that.dataList = res.data;
        } else {
          Toast.loading({
            message: res.errMessage,
            duration: 1000,
            type: 'fail',
          });
        }
      });
    },
  },
};
</script>
<style scoped="scoped">
  .icon-fuzhi,.icon-xuanze{
    color: #1890FF !important;
  }
  .icon-touxiang{
    color: #FFFFFF !important;
    font-size: 30px !important;
    margin: 0px !important;
  }
  .icon-fasong{
    color: #1890FF !important;
    margin: 2px 2px 0 0 !important;
  }
  .icon{
    width: 24px;
    height: 24px;
    background: #DCEEFF;
    box-shadow: 0 4px 30px 0 rgba(24,107,255,0.16);
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
  }
  .yes{
    width: 46.5px;
    height: 19px;
    background: #DCEEFF;
    border-radius: 9px;
    font-size: 10px;
    text-align: center;
    line-height: 19px;
    color: #1890FF;
    margin-left: 10px;
  }
  .no{
    width: 46.5px;
    height: 19px;
    line-height: 19px;
    background: #E5E5E5;
    border-radius: 9px;
    font-size: 10px;
    color: rgba(0,0,0,0.25);
    text-align: center;
    margin-left: 10px;
  }
  .top-box{
     margin: 10px 0 10px 15px;
     font-size: 12px;
     color: #999999;
     letter-spacing: 0;
  }
  .right-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-tip{
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    padding-bottom: 12px;
  }
  .content{
    margin: 10px 0 10px 15px;
  }
  .task{
    margin-top: 6px;
  }
  .push-date{
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .state{
    background: rgba(231,120,120,0.1);
    text-align: center;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    width: 79px;
    height: 30px;
    border-radius: 50px 0 0 50px;
    color: rgba(250,82,82,1);
    letter-spacing: 0;
  }
  .top {
    padding: 11px 15px;
    font-size: 14px;
    color: #1890FF;
    letter-spacing: 0;
    text-align: center;
    display: flex;
    align-items: center;
    font-weight: 500;
  }
  .tite{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .task-name{
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .overdue{
    font-size: 12px;
    color: #FA5252;
    letter-spacing: 0;
    margin-right: 10px;
  }
  .surplus{
    color: #1890FF;
  }
  .hr {
    width: 100%;
    height: 5px;
    background-color: #E5E5E5;
  }
  .flex{
    display: flex;
    border-top: 1px solid #E5E5E5;
    padding: 12px 15px 12px 0;
    align-items: baseline;
  }
  .list{
    display: flex;
    justify-content: space-between;
    padding: 12px 15px 12px 0;
    align-items: center;
    border-top: 1px solid #E5E5E5;
  }
  .left{
    display: flex;
    align-items: flex-start;
  }
  .iconfont{
    font-size: 14px;
    color: #999999;
    margin-right: 10px;
  }
  .right-tite{
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
  }
  .copy{
    font-size: 14px;
    color: #1890FF;
    letter-spacing: 0;
  }
  .right{
    width: 100%;
  }
  .right-content{
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 10px;
  }
  .right-content img{
    width: 100px;
    height: 100px;
  }
  .group{
    background: #03C15E;
    width: 46px;
    height: 46px;
    border-radius: 4px;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-flex{
    display: flex;
    align-items: center;
  }
  .list-content{
    width: 75%;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .date{
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    margin-top: 6px;
  }
  .footer{
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    z-index: 1;
    justify-content: space-evenly;
    border-top: 0.5px solid #E5E5E5;
    width: 100%;
    padding: 10px 0;
  }
  .footer-left{
    width: 152px;
    height: 40px;
    border: 0.5px solid #E5E5E5;
    border-radius: 2.5px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #333333;
  }
  .footer-right{
    width: 152px;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
    height: 40px;
    background: #1890FF;
    border-radius: 2.5px;
  }
</style>
