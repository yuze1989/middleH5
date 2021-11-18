<template>
  <div class="box">
    <div v-if="!err">
    <div class="top-box">
      <div class="tite">
        <div class="task-name">{{dataList.sopRuleName}}</div>
        <div class="state" v-if="dataList.overdueFlag">逾期</div>
      </div>
      <div class="task">{{dataList.sopType === 1 ? '群SOP' : '客户SOP'}}任务</div>
      <div class="push-date">
        <div>推送时间：{{taskTime}}</div>
        <div v-if="dataList.taskStatus !== 3">
          <div class="overdue" v-if="dataList.overdueFlag">
            (逾期时间：{{dataList.taskOverdueTimeStr}})</div>
          <div class="surplus" v-else>(剩余时间：{{dataList.taskSurplusTimeStr}})</div>
        </div>
      </div>
      <div class="task" v-if="dataList.taskStatus === 3">完成时间：{{ finishTime}}</div>
    </div>
    <div class="hr"></div>
    <!-- 推送内容 -->
    <div class="content">
      <div class="content-tip" style="border: none;">推送内容</div>
      <div class="flex" v-for="(item,index) in dataList.sopRuleContentList" :key="index"
      >
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
            <div class="copy" @click="copy(item)">
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
      <div class="content-tip">推送{{dataList.sopType === 1 ? '群聊' : '客户'}}</div>
      <div class="list" v-for="(item,index) in dataList.sopTaskList" :key="index"
      @click.stop="change(item)">
        <div class="list-flex">
          <div v-if="dataList.taskStatus !== 3">
            <div v-if="item.taskStatus === 2">
              <i :class="!item.isSelect ? 'icon-weixuanze' : 'icon-xuanze'"
              class="iconfont"></i>
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
              <div class="list-content">{{item.targetName}}</div>
              <div :class="item.taskStatus === 3 ? 'yes' : 'no'">
              {{item.taskStatus === 3 ? '已完成' : '未完成'}}</div>
            </div>
            <div class="date" v-if="item.taskStatus === 3">
              完成时间：{{time(item.taskFinishTime)}}
            </div>
          </div>
        </div>
        <div class="icon" @click.stop="share(item)"><i class="iconfont icon-fasong"></i>
        </div>
      </div>
    </div>
    <div class="footer" v-if="dataList.taskStatus !== 3">
      <div class="footer-left" @click="cancel">全选</div>
      <div class="footer-right" @click="determine">完成</div>
    </div>
    </div>
    <jurisdiction :err="err" v-show="err"></jurisdiction>
  </div>
</template>

<script>
import { Toast } from 'vant';
import moment from 'moment';
import Http from '../utils/http';
import Wechat from '../utils/wechat';
import jurisdiction from '../common/jurisdiction.vue';

export default {
  components: { jurisdiction },
  data() {
    return {
      err: '',
      dataList: [],
      batchNo: '',
      idList: [],
      taskTime: '',
      finishTime: '',
      selectAll: false,
    };
  },
  mounted() {
    this.batchNo = this.$route.query.batchNo;
    this.getList();
  },
  methods: {
    // 分享
    share(obj) {
      if (obj.taskStatus === 3) {
        // 任务完成不让分享
        return;
      }
      let data;
      if (obj.targetType === 1) {
        data = { chatId: obj.targetThirdId };
        Wechat.setAgentConfig(data, 'openExistedChatWithMsg');
      } else {
        data = {
          externalUserIds: obj.targetThirdId,
          groupName: '',
        };
        Wechat.setAgentConfig(data, 'openEnterpriseChat');
      }
    },
    change(obj) {
      const data = obj;
      data.isSelect = !data.isSelect;
    },
    time(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
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
    // 取消全选 --- 全选
    cancel() {
      this.idList = [];
      this.selectAll = !this.selectAll;
      this.dataList.sopTaskList.forEach((item) => {
        const data = item;
        data.isSelect = this.selectAll;
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
          message: that.dataList.sopType === 1 ? '请选择完成的群聊' : '请选择完成的客户',
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
      Http.post('/scrm/comm/rest/sop/finish-sop-task', { idList: that.idList }, '').then((res) => {
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
      Http.post('/scrm/comm/rest/sop/get-sop-task-batch-detail', { batchNo: that.batchNo }, '').then((res) => {
        if (res.success) {
          that.err = '';
          res.data.sopTaskList.forEach((item) => {
            const data = item;
            data.isSelect = false;
          });
          that.taskTime = that.time(res.data.taskTime);
          that.finishTime = that.time(res.data.finishTime);
          that.dataList = res.data;
        } else {
          that.err = res.errCode;
          Toast(res.errMessage);
        }
      })
        .catch(() => {
          that.err = 'errCode';
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
    font-size: 3rem !important;
    margin: 0 !important;
  }
  .icon-fasong{
    color: #1890FF !important;
    margin: 0.2rem 0.2rem 0 0 !important;
  }
  .icon{
    min-width: 2.4rem;
    height: 2.4rem;
    background: #DCEEFF;
    box-shadow: 0 0.4rem 3rem 0 rgba(24,107,255,0.16);
    border-radius: 50%;
    text-align: center;
    line-height: 2.4rem;
  }
  .yes{
    min-width: 4.65rem;
    height: 1.9rem;
    background: #DCEEFF;
    border-radius: 0.9rem;
    font-size: 1rem;
    text-align: center;
    line-height: 1.9rem;
    color: #1890FF;
    margin-left: 1rem;
  }
  .no{
    min-width: 4.65rem;
    height: 1.9rem;
    line-height: 1.9rem;
    background: #E5E5E5;
    border-radius: 0.9rem;
    font-size: 1rem;
    color: rgba(0,0,0,0.25);
    text-align: center;
    margin-left: 1rem;
  }
  .top-box{
     margin: 1rem 0 1rem 1.5rem;
     font-size: 1.2rem;
     color: #999999;
     letter-spacing: 0;
  }
  .right-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-tip{
    font-size: 1.4rem;
    color: #333333;
    letter-spacing: 0;
    padding-bottom: 1.2rem;
  }
  .content{
    margin: 1rem 0 1rem 1.5rem;
  }
  .task{
    margin-top: 0.6rem;
  }
  .push-date{
    margin-top: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .state{
    background: rgba(231,120,120,0.1);
    text-align: center;
    text-align: center;
    line-height: 3rem;
    font-size: 1.6rem;
    width: 7.9rem;
    height: 3rem;
    border-radius: 5rem 0 0 5rem;
    color: rgba(250,82,82,1);
    letter-spacing: 0;
  }
  .top {
    padding: 1.1rem 1.5rem;
    font-size: 1.4rem;
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
    font-size: 1.4rem;
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
    font-size: 1.2rem;
    color: #FA5252;
    letter-spacing: 0;
    margin-right: 1rem;
  }
  .surplus{
    color: #1890FF;
  }
  .hr {
    width: 100%;
    height: 0.5rem;
    background-color: #E5E5E5;
  }
  .flex{
    display: flex;
    border-top: 0.1rem solid #E5E5E5;
    padding: 1.2rem 1.5rem 1.2rem 0;
    align-items: baseline;
  }
  .list{
    display: flex;
    justify-content: space-between;
    padding: 1.2rem 1.5rem 1.2rem 0;
    align-items: center;
    border-top: 0.1rem solid #E5E5E5;
  }
  .left{
    display: flex;
    align-items: flex-start;
  }
  .iconfont{
    font-size: 1.4rem;
    color: #999999;
    margin-right: 1rem;
  }
  .right-tite{
    font-size: 1.6rem;
    color: #333333;
    letter-spacing: 0;
  }
  .copy{
    font-size: 1.4rem;
    color: #1890FF;
    letter-spacing: 0;
  }
  .right{
    width: 100%;
  }
  .right-content{
    font-size: 1.4rem;
    color: rgba(0,0,0,0.65);
    letter-spacing: 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 1rem;
  }
  .right-content img{
    width: 10rem;
    height: 10rem;
  }
  .group{
    background: #03C15E;
    min-width: 4.6rem;
    height: 4.6rem;
    border-radius: 0.4rem;
    margin-right: 1.2rem;
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
    font-size: 1.6rem;
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
    font-size: 1.4rem;
    color: #999999;
    letter-spacing: 0;
    margin-top: 0.6rem;
  }
  .footer{
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    z-index: 1;
    justify-content: space-evenly;
    border-top: 0.05rem solid #E5E5E5;
    width: 100%;
    padding: 1rem 0;
  }
  .footer-left{
    width: 15.2rem;
    height: 4rem;
    border: 0.05rem solid #E5E5E5;
    border-radius: 0.25rem;
    text-align: center;
    line-height: 4rem;
    font-size: 1.6rem;
    color: #333333;
  }
  .footer-right{
    width: 15.2rem;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 4rem;
    text-align: center;
    height: 4rem;
    background: #1890FF;
    border-radius: 0.25rem;
  }
</style>
