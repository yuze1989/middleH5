<template>
  <div class="box">
    <img src="../assets/error.png" v-if="type === '1'"/>
    <img src="../assets/jurisdiction.png" v-else />
    <div>{{msg}}</div>
    <div v-if="type !== '1'">请联系贵公司管理员</div>
  </div>
</template>

<script>

export default {
  name: 'jurisdiction',
  data() {
    return {
      msg: '',
      type: 0,
    };
  },
  mounted() {
    this.msg = this.$route.query.msg;
    this.type = this.$route.query.type;
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
