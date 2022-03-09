<template>
  <div class="userInfo">
    <div class="img-avatar img-box">
      <img :src="userInfo.avatar">
    </div>
    <div class="userBasic">
      <div class="text-box">
        <div class="font-17">{{userInfo.name}}</div>
        <div class="date">
          {{ paramsDate | formatterTime }}
        </div>
      </div>
      <div class="font-11">
        <span v-for="(item) in userInfo.departNameList" :key="item">
            {{item}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'UserInfo',
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
    paramsDate: {
      type: String,
      default: '',
    },
  },
  filters: {
    formatterTime(value) {
      if (!value) return '';
      return value.replace(/^(\d{4})(\d{2})(\d{2})$/, (_, ...args) => moment(args.slice(0, 3).join('-')).format('M月D日'));
    },
  },
};
</script>

<style scoped>
.userInfo {
  display: flex;
  padding: 2.1rem 1.95rem 1.7rem 3.3rem;
}

.img-box{
  border-radius: 50%;
  overflow: hidden;
  background-color: rgb(238, 238, 238);
  margin-right:1rem;
}

.img-avatar{
  width:4.4rem;
  height: 4.4rem;
}

.img-box img{
  width: 100%;
  height: 100%;
}

.font-17{
  font-size: 1.7rem;
  color: #FFFFFF;
}

.font-11{
  font-size: 1.1rem;
  color: rgba(255,255,255,0.85);
}

.userBasic{
  flex: 1;
}

.text-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.date{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  padding: 0 1.3rem;
  background: #FFFFFF;
  border-radius: 1.25rem;
  color: #4951FF;
  font-size: 1.2rem;
}
</style>
