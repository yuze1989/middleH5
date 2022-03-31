<template>
  <div class="my">
    <img src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/sh5/my-bg.png" class="bg" alt="">
    <div v-if="isLoad" class="loadingWrap"><Loading type="spinner" /></div>
    <div v-else class="myContent">
      <img :src="avatar" class="userHeadImg" alt="">
      <p class="userName">{{name}}</p>
      <p class="companyName">{{companyName}}</p>
      <div class="qrCodeWrap">
        <!-- <vueQr
          :text="qrUrl"
          :size="225"
          :margin="10"
        /> -->
        <img :src="qrUrl" class="qrImg" alt="" />
        <div class="text">我的二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
// import vueQr from 'vue-qr';
import { Toast, Loading } from 'vant';
import { getUserInfo } from '@/api/dailySummary';

export default {
  name: 'my',
  components: {
    Loading,
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
        this.qrUrl = data.qrCode || '';
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
      top: -5.5rem;
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
        margin: 3.2rem auto 0;
        width: 9.4rem;
        height: 9.4rem;
        border-radius: 50%;
        object-fit: cover;
      }

      .userName {
        margin: 1.5rem 0 0;
        text-align: center;
        font-size: 2.4rem;
        line-height: 3.3rem;
        font-weight: 500;
        color: #fff;
      }

      .companyName {
        margin: .7rem 0 0;
        text-align: center;
        font-size: 1.3rem;
        line-height: 1.7rem;
        font-weight: 400;
        color: #fff;
      }

      .qrCodeWrap {
        background-color: #fff;
        border-radius: 1rem;
        padding: 1.5rem 1.5rem 1.4rem;
        margin: 3.1rem auto 0;
        text-align: center;

        .qrImg {
          width: 22.5rem;
          height: 22.5rem;
        }

        .text {
          color: #333333;
          font-size: 1.5rem;
          line-height: 2.1rem;
          margin-top: .7rem;
        }
      }
    }
  }
</style>
