<template>
  <div class="box">
    <img src="../assets/jurisdiction.png"/>
    <div>{{msg}}</div>
    <div>请联系贵公司管理员</div>
  </div>
</template>

<script>

export default {
  name: 'jurisdiction',
  data() {
    return {
      msg: '',
    };
  },
  mounted() {
    this.msg = this.$route.query.msg;
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
