<template>
  <div class="box">
    <!-- <img src="../assets/error.png" v-if="err === 'errCode'"/> -->
    <img src="../assets/jurisdiction.png" v-if="err !== 'errCode'"/>
    <div>{{errorList[err]}}</div>
  </div>
</template>

<script>

export default {
  name: 'jurisdiction',
  data() {
    return {
      msg: '',
      errorList: {
        '0100000004': '请重新登录',
        '0100000005': '您没有操作权限，请联系您所在企业的管理员',
        '0100000006': '您没有账户席位，请联系您所在企业的管理员',
        '0100000007': '您的SCRM会员过期，请联系您所在企业的管理员',
        '0100000009': '巨准SCRM会员过期，请联系巨准SCRM客服续费',
        errCode: '检查网络情况后,再尝试访问',
      },
    };
  },
  props: {
    err: {
      type: String,
      default: '',
    },
  },
  mounted() {
    // console.log(this.errorList[this.err]);
  },
  methods: {

  },
};
</script>
<style scoped="scoped">
  .box{
    text-align: center;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
  }
  img{
    width: 289.5px;
    height: 156.5px;
    margin-top: 89px;
  }
</style>
