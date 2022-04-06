<template>
  <div class="customer-item">
    <img :src="item.avatar" alt="" class="use-head-img" />
    <div class="user-info">
      <div class="user-name">
        <span>{{item.name}}</span>
        <span
          v-if="item.wxType"
          class="user-type"
          :class="item.wxType === 1 ? 'green' : 'orange'">
          @{{getUserTypeText(item.wxType)}}
        </span>
      </div>
      <div class="follow-up-user">跟进人：{{item.tenantStaffName}}</div>
      <div>添加时间：{{getTime(item.addTime)}}</div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'customerItem',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    // 时间转换
    getTime(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
    },
    // 用户类型
    getUserTypeText(type) {
      switch (type) {
        case 1:
          return '微信';
        case 2:
          return '企微';
        default:
          return '';
      }
    },
  },
};
</script>
<style scoped="scoped">
  .customer-item {
    display: flex;
    align-items: center;
  }

  .use-head-img {
    width: 6rem;
    height: 6rem;
    border-radius: .4rem;
    object-fit: cover;
    margin-right: .6rem;
  }

  .user-info {
    flex: 1;
    color: #7D8394;
    font-size: 1.2rem;
    line-height: 1.7rem;
    font-weight: 400;
    text-align: left;
  }

  .user-name {
    font-weight: 500;
    font-size: 1.6rem;
    color: #343845;
    letter-spacing: 0;
    line-height: 2.2rem;
    display: flex;
    align-items: flex-end;
    font-family: PingFangSC-Medium;
  }

  .user-type {
    font-size: 1.3rem;
    font-weight: 400;
    margin-left: .6rem;
    line-height: 2rem;
    font-family: PingFangSC-Regular;
  }

  .green {
    color: #52C41A;
  }

  .orange {
    color: #FF9211;
  }

  .follow-up-user {
    margin: .4rem 0;
  }

</style>
