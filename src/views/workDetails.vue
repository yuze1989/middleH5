<template>
  <div class="box">
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <div v-else>
      <div class="top-box">
        <div class="title">
          <div class="task-name">{{dataList.sopRuleName}}</div>
          <div class="state" v-if="dataList.overdueFlag">逾期</div>
        </div>
        <div class="task">{{sopType[dataList.sopType]}}任务</div>
        <div class="push-date">
          <div>推送时间：{{taskTime}}</div>
          <div v-if="dataList.taskStatus !== 3">
            <div class="overdue" v-if="dataList.overdueFlag">
              (逾期时间：{{dataList.taskOverdueTimeStr}})</div>
            <div class="surplus" v-else>(剩余时间：{{dataList.taskSurplusTimeStr}})</div>
          </div>
        </div>
        <div class="task" v-if="dataList.taskStatus === 3">完成时间：{{finishTime}}</div>
      </div>
      <div class="box-margin">
        <!-- 推送内容 -->
        <div class="block-box">
          <div class="content">
            <div class="content-tip">推送内容</div>
            <div class="flex"
            v-for="(item,index) in dataList.sopRuleContentList" :key="index">
              <div class="left">
                <i class="iconfont icon-wenzi" v-if="item.contentType === 1"></i>
                <i class="iconfont icon-tupian" v-if="item.contentType === 2"></i>
                <i class="iconfont icon-bianzu" v-if="item.contentType === 3"></i>
              </div>
              <div class="right">
                <div class="right-top">
                  <div class="right-title">
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
                  {{item.text || item.linkUrl}}
                </div>
                <div class="right-content" v-else>
                  <img :src="item.imgUrl">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 推送群聊 -->
        <div class="block-box" v-if="dataList.sopType !== 3">
          <div class="content content-margin">
            <div class="content-tip">推送{{sopType[dataList.sopType]}}</div>
            <div class="list" v-for="(item,index) in dataList.sopTaskList" :key="index"
            @click.stop="change(item)">
              <div class="list-flex">
                <div v-if="dataList.taskStatus !== 3">
                  <div v-if="item.taskStatus === 2">
                    <i :class="!item.isSelect ? 'icon-weixuanze' : 'icon-xuanze'"
                    class="iconfont"></i>
                  </div>
                  <div v-else>
                    <i class="iconfont icon-xuanze"
                    style="color: #E5E5E5 !important;"></i>
                  </div>
                </div>
                <div class="group">
                  <i class="iconfont icon-touxiang"></i>
                </div>
                <div>
                  <div class="list-flex">
                    <div class="list-content">{{item.targetName}}</div>
                    <div :class="item.taskStatus === 3 ? 'yes' : 'no'">
                      {{item.taskStatus === 3 ? '已完成' : '未完成'}}
                    </div>
                  </div>
                  <div class="date" v-if="item.taskStatus === 3">
                    完成时间：{{time(item.taskFinishTime)}}
                  </div>
                </div>
              </div>
              <div class="icon" @click.stop="share(item)">
                <i class="iconfont icon-fasong"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" v-if="dataList.taskStatus !== 3">
        <div class="footer" v-if="dataList.sopType !== 3">
          <div class="footer-left" @click="cancel">全选</div>
          <div class="footer-right" @click="determine">完成</div>
        </div>
        <div class="footer-right" @click="WechatSOP" v-else>立即发布</div>
      </div>
    </div>
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
      title: { content: '' },
      sopType: {
        1: '群SOP',
        2: '客户SOP',
        3: '朋友圈SOP',
      },
    };
  },
  mounted() {
    this.batchNo = this.$route.query.batchNo;
    this.getList();
  },
  methods: {
    WechatSOP() {
      if (this.dataList.overdueFlag) {
        Toast('任务已逾期');
        return;
      }
      const addressArr = [];
      this.dataList.sopRuleContentList.forEach((item) => {
        switch (item.contentType) {
          case 1:
            // 文字
            this.title = { content: item.text };
            break;
          case 2:
            // 图片
            addressArr.push({ msgtype: 'image', image: { imgUrl: item.imgUrl } });
            break;
          case 3:
            // 链接
            addressArr.push({ msgtype: 'link', link: { url: item.linkUrl } });
            break;
          default:
        }
      });
      const data = {
        text: this.title,
        attachments: addressArr,
      };
      Http.post('/scrm/comm/rest/sop/finish-friend-sop-task', { batchNo: this.batchNo }, '').then((res) => {
        if (res.success) {
          Wechat.setAgentConfig(data, 'shareToExternalMoments');
        } else {
          Toast(res.errMessage);
        }
      });
    },
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
      switch (obj.contentType) {
        case 1:
          // 文字
          content = obj.text;
          break;
        case 2:
          // 图片
          content = obj.imgUrl;
          break;
        case 3:
          // 链接
          content = obj.linkUrl;
          break;
        default:
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
      Http.post('/scrm/comm/rest/sop/finish-sop-task', { idList: that.idList }, '').then((res) => {
        if (res.success) {
          Toast('已完成');
          that.getList();
        } else {
          Toast(res.errMessage);
        }
      });
    },
    getList() {
      const that = this;
      Http.post('/scrm/comm/rest/sop/get-sop-task-batch-detail', { batchNo: that.batchNo }, '').then((res) => {
        if (res.success) {
          that.err = '';
          if (res.data.sopTaskList) {
            res.data.sopTaskList.forEach((item) => {
              const data = item;
              data.isSelect = false;
            });
          }

          that.dataList = res.data;
          that.taskTime = that.time(res.data.taskTime);
          that.finishTime = that.time(res.data.finishTime);
        } else {
          that.err = res.errCode;
          Toast(res.errMessage);
        }
      }).catch(() => {
        that.err = 'errCode';
      });
    },
  },
};
</script>
<style scoped="scoped">
  .icon-fuzhi,
  .icon-xuanze {
    color: #1890FF !important;
  }

  .icon-touxiang {
    color: #FFFFFF !important;
    font-size: 3rem !important;
    margin: 0 !important;
  }

  .icon-fasong {
    color: #1890FF !important;
    margin: 0.1rem 0.1rem 0 0 !important;
  }

  .block-box::before {
    display: block;
    content: "";
    width: 100%;
    height: 0.5rem;
    background-color: #E5E5E5;
  }

  .box-margin {
    margin-bottom: 6.4rem;
  }

  .icon {
    padding: 0.4rem;
    background: #DCEEFF;
    box-shadow: 0 0.4rem 3rem 0 rgba(24, 107, 255, 0.16);
    border-radius: 50%;
    text-align: center;
  }

  .content-margin {
    margin-bottom: 6rem;
  }

  .yes {
    min-width: 4.65rem;
    background: #DCEEFF;
    border-radius: 0.9rem;
    font-size: 1rem;
    text-align: center;
    color: #1890FF;
    margin-left: 1rem;
  }

  .no {
    min-width: 4.65rem;
    background: #E5E5E5;
    border-radius: 0.9rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.25);
    text-align: center;
    margin-left: 1rem;
  }

  .top-box {
    margin: 1rem 0 1rem 1.5rem;
    font-size: 1.2rem;
    color: #999999;
  }

  .right-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content-tip {
    font-size: 1.4rem;
    color: #333333;
    padding-bottom: 1.2rem;
  }

  .content {
    margin: 1rem 0 1rem 1.5rem;
  }

  .task {
    margin-top: 0.6rem;
  }

  .push-date {
    margin-top: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .state {
    background: rgba(231, 120, 120, 0.1);
    text-align: center;
    padding: 0.4rem 2.4rem;
    font-size: 1.6rem;
    border-radius: 5rem 0 0 5rem;
    color: rgba(250, 82, 82, 1);
  }

  .top {
    padding: 1.1rem 1.5rem;
    font-size: 1.4rem;
    color: #1890FF;
    text-align: center;
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .task-name {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .overdue {
    font-size: 1.2rem;
    color: #FA5252;
    margin-right: 1rem;
  }

  .surplus {
    color: #1890FF;
  }

  .flex {
    display: flex;
    border-top: 0.1rem solid #E5E5E5;
    padding: 1.2rem 1.5rem 1.2rem 0;
    align-items: baseline;
  }

  .list {
    display: flex;
    justify-content: space-between;
    padding: 1.2rem 1.5rem 1.2rem 0;
    align-items: center;
    border-top: 0.1rem solid #E5E5E5;
  }

  .left {
    display: flex;
    align-items: flex-start;
  }

  .iconfont {
    font-size: 1.4rem;
    color: #999999;
    margin-right: 1rem;
  }

  .right-title {
    font-size: 1.6rem;
    color: #333333;
  }

  .copy {
    font-size: 1.4rem;
    color: #1890FF;
  }

  .right {
    width: 100%;
  }

  .right-content {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 1rem;
  }

  .right-content img {
    width: 10rem;
    height: 10rem;
  }

  .group {
    background: #03C15E;
    padding: 0.8rem;
    border-radius: 0.4rem;
    margin-right: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .list-flex {
    display: flex;
    align-items: center;
  }

  .list-content {
    width: 75%;
    font-size: 1.6rem;
    color: #333333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .date {
    font-size: 1.4rem;
    color: #999999;
    margin-top: 0.6rem;
  }

  .footer {
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

  .footer-left {
    border: 0.05rem solid #E5E5E5;
    color: #333333;
  }

  .footer-left,
  .footer-right {
    flex: 1;
    margin: 0 2rem;
    border-radius: 0.25rem;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.6rem;
  }

  .footer-right {
    color: #FFFFFF;
    background: #1890FF;
  }
</style>
