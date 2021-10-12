<template>
  <div class="box">
    <!-- <img src="../assets/error.png" v-if="err === 'errCode'"/> -->
    <img src="../assets/jurisdiction.png" v-if="err !== 'errCode'"/>
    <div>{{errorList[err]}}</div>
    <div v-if="err !== 'errCode'">请联系贵公司管理员</div>
  </div>
</template>

<script>

export default {
  name: 'jurisdiction',
  data() {
    return {
      msg: '',
      errorList: {
        '0100000005': '您没有操作权限，请联系您所在企业的管理员',
        '0100000006': '您没有访问权限，请联系您所在企业的管理员',
        '0100000007': '您没有访问权限，请联系您所在企业的管理员',
        errCode: '检查网络情况后 再尝试访问',
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
