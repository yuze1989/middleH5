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
    width: 60px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 6px;
  }

  .user-info {
    flex: 1;
    color: #7D8394;
    font-size: 12px;
    line-height: 17px;
    font-weight: 400;
    text-align: left;
    font-family: PingFangSC-Regular;
  }

  .user-name {
    font-weight: 500;
    font-size: 16px;
    color: #343845;
    letter-spacing: 0;
    line-height: 22px;
    display: flex;
    align-items: flex-end;
    font-family: PingFangSC-Medium;
  }

  .user-type {
    font-size: 13px;
    font-weight: 400;
    margin-left: 6px;
    line-height: 20px;
    font-family: PingFangSC-Regular;
  }

  .green {
    color: #52C41A;
  }

  .orange {
    color: #FF9211;
  }

  .follow-up-user {
    margin: 4px 0;
  }

</style>
