<template>
  <div class="main">
    <audio :src="detail.voiceUrl" controls="controls" class="audio">
      暂不支持
    </audio>
    <div class="chat-detail">
      <div
        v-for="(item, index) in detail.phoneLogs"
        :key="index"
      >
        <div v-if="item.speaker === 'AI'" class="message">
          <span class="icon-service">
            <span class="iconfont icon-kehu4" />
          </span>
          <span class="dialog-box dialog-service">
           {{item.content}}
          </span>
        </div>
        <div v-else class="message message-customer">
          <span class="dialog-box dialog-user">
            {{item.content}}
          </span>
          <span class="icon-service">
            <span class="iconfont icon-yonghu" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../../utils/http';

export default {
  data() {
    return {
      taskResultId: 0,
      detail: {},
    };
  },
  mounted() {
    this.taskResultId = this.$route.params.taskResultId;
    this.getAiCallDetail();
  },
  methods: {
    getAiCallDetail() {
      http.post('/scrm/comm/rest/ai-call-manual-allot/get-ai-call-record', { taskResultId: this.taskResultId }).then((res) => {
        if (res.success) {
          this.detail = res.data;
        }
      });
    },
  },
};
</script>

<style scoped>
.audio {
  width: 100%;
  border-radius: 0;
}
.main {
  background: #F2F3F7;
  min-height: 100vh;
}
.chat-detail {
  padding: 1.5rem;
}
.dialog-box {
  background: #fff;
  max-width: 22rem;
  display: inline-block;
  padding: .8rem;
  font-size: 1.4rem;
  color: rgba(0,0,0,.65);
  margin: 0 1rem;
  position: relative;
}
.dialog-box::before {
  position: absolute;
  top: 1.4rem;
  content: '';
  border-top: .6rem solid transparent;
  border-bottom: .6rem solid transparent;
  border-left: 1.2rem solid transparent;
  border-right: .6rem solid #fff;
}
.dialog-service::before {
  left: -1.6rem;
}
.dialog-user::before  {
  right: -1.6rem;
  border-right: 1.2rem solid transparent;
  border-left: .6rem solid #fff;
}
.message {
  display: flex;
  padding-bottom: 1.4rem;
}
.icon-service {
  display: inline-block;
  width: 3.6rem;
  height: 3.6rem;
  background: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 3.6rem;
}
.icon-service .iconfont {
  font-size: 2.2rem;
  color: #88C6FF;
}
.message-customer {
  justify-content: flex-end;
}
.message-customer .icon-service {
  margin-left: .5rem;
}
</style>
