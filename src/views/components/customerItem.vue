<template>
  <div class="customer-item">
    <img :src="item.avatar" alt="" class="use-head-img" />
    <div class="user-info">
      <div class="user-name">
        {{item.name}}&nbsp;&nbsp;
        <span
          class="user-type"
          :class="item.channelName === '微信' ? 'green' : 'orange'">
          @{{item.channelName}}
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
    getTime(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
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
  }

  .user-name {
    font-weight: 500;
    font-size: 16px;
    color: #343845;
    letter-spacing: 0;
    line-height: 22px;
    display: flex;
    align-items: flex-end;
  }

  .user-type {
    font-size: 13px;
    font-weight: 400;
    margin-left: 6px;
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
