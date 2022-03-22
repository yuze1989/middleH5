<template>
  <div class="customer-item">
    <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.redocn.com%2Fsheying%2F20140927%2Fxiongmaoguazaishushangshuijue_3157987.jpg&refer=http%3A%2F%2Fimg.redocn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650526693&t=819ef3c0e3d392fed3fdf125714c84a8" alt="" class="use-head-img" />
    <div class="user-info">
      <div class="user-name">Alan白杨 <span class="user-type">@微信</span></div>
      <div class="follow-up-user">跟进人：Ya六一</div>
      <div>添加时间：2021/06/24</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'customerItem',
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
    color: #52C41A;
    margin-left: 6px;
  }

  .follow-up-user {
    margin: 4px 0;
  }

</style>
