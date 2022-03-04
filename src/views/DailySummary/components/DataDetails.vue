<template>
  <div class="dataDetails">
    <user-info
      :user-info="userInfo"
      :depart-name-list="departNameList"
    />
  </div>
</template>

<script>
import UserInfo from './UserInfo.vue';

export default {
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
  name: 'DataDetails',
  components: {
    UserInfo,
  },
};
</script>

<style scoped>
.dataDetails {
  background: #4951FF;
}
</style>
