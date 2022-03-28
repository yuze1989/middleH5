<template>
  <div class="my">
    <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/sh5/my-bg.png" class="bg" alt="">
    <div v-if="isLoad" class="loadingWrap"><Loading type="spinner" /></div>
    <div v-else class="myContent">
      <img :src="avatar" class="userHeadImg" alt="">
      <p class="userName">{{name}}</p>
      <p class="companyName">{{companyName}}</p>
      <div class="qrCodeWrap">
        <vueQr
          :text="qrUrl"
          :size="225"
          :margin="10"
        />
        <div class="text">我的二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
import vueQr from 'vue-qr';
import { Toast, Loading } from 'vant';
import { getUserInfo } from '@/api/dailySummary';

export default {
  name: 'my',
  components: {
    Loading,
    vueQr,
  },
  data() {
    return {
      isLoad: true,
      avatar: '',
      name: '',
      companyName: '',
      qrUrl: '',
    };
  },
  mounted() {
    const token = sessionStorage.getItem('token');
    getUserInfo({ token }).then((res) => {
      const { success, errMessage, data } = res;
      if (success) {
        this.qrUrl = data.qrUrl || '';
        this.name = data.name || '/';
        this.companyName = data.companyName || '/';
        this.avatar = data.avatar || '';
      }
      if (!success && errMessage) {
        Toast(errMessage);
      }
    }).catch(() => {
      Toast('服务器错误');
    }).finally(() => {
      this.isLoad = false;
    });
  },
};
</script>
<style lang="less" scoped="scoped">
  .my {
    flex: 1;
    position: relative;
    overflow: auto;
    background-color: #4066D4;

    .bg {
      position: absolute;
      width: 100%;
      top: -55px;
    }

    .loadingWrap {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .myContent {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;

      .userHeadImg {
        margin: 32px auto 0;
        width: 94px;
        height: 94px;
        border-radius: 50%;
        object-fit: cover;
      }

      .userName {
        margin: 15px 0 0;
        text-align: center;
        font-size: 24px;
        line-height: 33px;
        font-weight: 500;
        color: #fff;
      }

      .companyName {
        margin: 7px 0 0;
        text-align: center;
        font-size: 13px;
        line-height: 17px;
        font-weight: 400;
        color: #fff;
      }

      .qrCodeWrap {
        background-color: #fff;
        border-radius: 10px;
        padding: 15px 15px 14px;
        margin: 31px auto 0;
        text-align: center;

        .text {
          color: #333333;
          font-size: 15px;
          line-height: 21px;
          margin-top: 7px;
        }
      }
    }
  }
</style>
