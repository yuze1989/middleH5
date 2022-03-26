<template>
  <div class="box">
    <jurisdiction :err="err" v-if="err"></jurisdiction>
    <div v-else>
      <div class="top-box">
        <div class="title">
          <div class="task-name">{{dataList.sopRuleName}}</div>
          <div class="state" v-if="dataList.overdueFlag">逾期</div>
        </div>
        <div class="task" v-if="sopType[`s${dataList.sopType}`]">
          {{sopType[`s${dataList.sopType}`].name}}任务
        </div>
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
      <div
        class="box-margin"
        :style="{flexDirection: refer ? 'column' : 'column-reverse'}"
        v-if="dataList"
      >
        <!-- 推送内容 -->
        <div class="block-box">
          <div class="content">
            <div class="content-tip">推送内容</div>
            <div class="flex" v-for="(item,index) in dataList.sopTaskContentList" :key="index">
              <WorkText
                :refer="refer"
                :content="item"
                @send="singleSend"
                v-if="item.msgType === 'text'"
              />
              <WorkImage
                :refer="refer"
                :content="item"
                @send="singleSend"
                v-if="item.msgType === 'image'"
              />
              <WorkLink
                :refer="refer"
                :content="item"
                @send="singleSend"
                v-if="item.msgType === 'link'"
              />
              <WorkVideo
                :refer="refer"
                :content="item"
                @send="singleSend"
                v-if="item.msgType === 'video'"
              />
              <WorkFile
                :refer="refer"
                :content="item"
                @send="singleSend"
                v-if="item.msgType === 'file'"
              />
              <WorkWechat
                :refer="refer"
                :content="item"
                @send="singleSend"
                v-if="item.msgType === 'miniProgram'"
              />
            </div>
          </div>
        </div>
        <!-- 推送群聊 -->
        <div class="block-box" v-if="dataList.sopType !== 3">
          <div class="content content-margin">
            <div class="content-tip" v-if="sopType[`s${dataList.sopType}`]">
              推送{{sopType[`s${dataList.sopType}`].name}}
              <span
                class="content-all"
                @click="cancel"
                v-if="!dataList.overdueFlag && dataList.taskStatus === 2 && refer === 'bench'"
              >全部完成</span>
            </div>
            <div
              class="list" v-for="(item,index) in dataList.sopTaskList"
              :key="index"
              :style="{display: refer || showMore || index < 3 ? 'flex' : 'none'}"
              @click.stop="share(item)"
            >
              <div class="list-flex">
                <div class="list-choose"
                  v-if="!dataList.overdueFlag && dataList.taskStatus !== 3 && refer === 'bench'"
                  @click.stop="change(item)"
                >
                  <i
                    class="iconfont"
                    :class="[
                      !item.isSelect && item.taskStatus === 2 ? 'icon-weixuanze' : 'icon-xuanze',
                      item.taskStatus !== 2 ? 'choose-disable' : ''
                    ]"
                  />
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
              <div>
                <i class="iconfont icon-xiayibu"></i>
              </div>
            </div>
            <div
              class="more"
              v-show="!showMore"
              v-if="dataList.sopTaskList && dataList.sopTaskList.length > 3 && !refer"
              @click="showMore = true"
            >
              展开更多
              <i class="iconfont icon-xiala" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="dataList.taskStatus !== 3 && dataList.sopType === 3 && refer === 'bench'">
        <div class="footer-right" @click="WechatSOP">立即发布</div>
      </div>
    </div>
    <van-dialog
      v-model="showDialog"
      :title="'是否已完成' + (selectAll ? '所有' : '该') + '客户推送？'"
      show-cancel-button
      @confirm="getFinishTask"
      confirmButtonText="已完成"
      confirmButtonColor="#2F9BFF"
    >
      <div v-if="!selectAll" class="dialog-con" @click="isWarnAgain = !isWarnAgain">
        <i
          class="iconfont icon-font-cus"
          :class="isWarnAgain ? 'icon-xuanze' : 'icon-weixuanze'"
        >
          <span class="dialog-text">本次任务不再提醒</span>
        </i>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Toast } from 'vant';
import moment from 'moment';
import Http from '../../utils/http';
import Wechat from '../../utils/wechat';
import jurisdiction from '../../common/jurisdiction.vue';
import WorkFile from './components/file.vue';
import WorkText from './components/text.vue';
import WorkImage from './components/image.vue';
import WorkVideo from './components/video.vue';
import WorkLink from './components/link.vue';
import WorkWechat from './components/wechat.vue';

export default {
  components: {
    jurisdiction, WorkFile, WorkText, WorkImage, WorkVideo, WorkLink, WorkWechat,
  },
  data() {
    return {
      err: '',
      dataList: [],
      batchNo: '',
      refer: '',
      idList: [],
      taskTime: '',
      finishTime: '',
      selectAll: false,
      showDialog: false,
      isWarnAgain: false,
      showMore: false,
      sopType: {
        s1: {
          name: '群SOP',
          invokeName: 'shareToExternalChat',
        },
        s2: {
          name: '客户SOP',
          invokeName: 'shareToExternalContact',
        },
        s3: {
          name: '朋友圈SOP',
          invokeName: 'shareToExternalMoments',
        },
        s4: {
          name: '客户群发',
          invokeName: 'shareToExternalChat',
        },
      },
    };
  },
  mounted() {
    this.batchNo = this.$route.query.batchNo;
    this.refer = this.$route.query.refer;
    this.getList();
  },
  methods: {
    singleSend(data) {
      Wechat.setAgentConfig(data, 'sendChatMessage');
    },
    WechatSOP() {
      if (this.dataList.overdueFlag) {
        Toast('任务已逾期');
        return;
      }
      const addressArr = [];
      let text = {
        content: '',
      };
      this.dataList.sopTaskContentList.forEach((item) => {
        if (item.msgType === 'text') {
          text = item.text;
        } else {
          const obj = {
            msgtype: item.msgType,
            [item.msgType]: item[item.msgType],
          };
          addressArr.push(obj);
        }
      });
      const data = {
        text,
        attachments: addressArr,
      };

      Wechat.setAgentConfig(data, this.sopType[`s${this.dataList.sopType}`].invokeName, () => {
        this.getIdList();
        this.getFinishTask();
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
      if (obj.taskStatus !== 2) return;
      const data = obj;
      data.isSelect = !data.isSelect;
      this.selectAll = false;
      if (data.isSelect) {
        this.determine();
      }
    },
    time(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
    },
    // 取消全选 --- 全选
    cancel() {
      this.idList = [];
      this.selectAll = !this.selectAll;
      this.dataList.sopTaskList.forEach((item) => {
        const data = item;
        data.isSelect = this.selectAll;
      });
      this.determine();
    },
    getIdList() {
      const idList = [];
      this.dataList.sopTaskList.forEach((item) => {
        const data = item;
        if (data.taskStatus === 2 && data.isSelect) {
          idList.push(data.id);
        }
      });
      this.idList = idList;
      return idList;
    },
    // 完成
    determine() {
      const that = this;
      const idList = this.getIdList();
      if (idList.length === 0) {
        Toast.loading({
          message: that.dataList.sopType === 1 ? '请选择完成的群聊' : '请选择完成的客户',
          duration: 1000,
          type: 'fail',
        });
        return;
      }
      if (!this.isWarnAgain) {
        this.showDialog = true;
        return;
      }
      this.getFinishTask();
    },
    getFinishTask() {
      const that = this;
      Http.post('/scrm/comm/rest/sop/finish-sop-task', { idList: that.idList }, '').then((res) => {
        if (res.success) {
          Toast('已完成');
          that.getList();
          return;
        }
        Toast(res.errMessage);
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
    display: flex;
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
    display: flex;
    justify-content: space-between;
  }
  .content-all {
    color: #1890FF;
    padding-right: 2rem;
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
    min-width: 8rem;
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
  }

  .right-title {
    font-size: 1.6rem;
    color: #333333;
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
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
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
  .dialog-con {
    text-align: center;
    padding: 1.5rem 0;
    color: #999999;
  }
  .dialog-text {
    color: #888;
  }
  .icon-xiayibu {
    font-size: 1.3rem;
  }
  .icon-font-cus {
    position: relative;
    padding-left: 0.6rem;
  }
  .icon-font-cus.icon-xuanze::before, .icon-font-cus.icon-weixuanze::before {
    position: absolute;
    left: -1em;
    top: 50%;
    transform: translateY(-50%);
  }
  .more {
    color: #999;
    text-align: center;
    font-size: 1.2rem;
    border-top: 1px solid #E5E5E5;
    line-height: 4rem;
  }
  .more .icon-xiala {
    font-size: 1rem;
  }
  .list-choose {
    padding: 1rem 0.9rem 1rem 0;
  }
  .choose-disable {
    color: #E5E5E5 !important;
  }
</style>
<style>
  .sop-box {
    width: 100%;
  }
  .sop-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    color: #333333;
  }
  .sop-name {
    font-size: 1.6rem;
    font-weight: 400;
  }
  .sop-title .icon-fasong1 {
    color: #1890FF;
    font-size: 2.4rem;
  }
  .sop-icon-color {
    color: #999;
  }
</style>
