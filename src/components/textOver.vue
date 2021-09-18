<template>
  <div class="text-box">
    <div :class="['', { 'over-hidden': !unfold }]" ref="textBox">
      <span ref="spanBox">{{content}}</span>
    </div>
    <div class="btn" v-if="ifOver" @click="unfold = !unfold">
      {{!unfold?'展开':'收起'}}
      <i class="iconfont icon-xiala" v-if="!unfold"></i>
      <i class="iconfont icon-shangla" v-else></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'textOver',
  data() {
    return {
      // 文本是否超出四行，默认否
      ifOver: false,

      // 文本是否是展开状态 默认为收起
      unfold: false,
    };
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  mounted() {
    // 判断是否显示展开收起按钮
    this.ifOver = this.$refs.spanBox.offsetHeight > this.$refs.textBox.offsetHeight;
  },
};
</script>
<style scoped>
  .over-hidden {
   overflow: hidden;
   text-overflow: ellipsis;
   /* 超出部分省略号 */
   display: -webkit-box;
   /** 对象作为伸缩盒子模型显示 **/
   -webkit-box-orient: vertical;
   /** 设置或检索伸缩盒对象的子元素的排列方式 **/
   -webkit-line-clamp: 4;
   /** 显示的行数 **/
  }
.icon-xiala,.icon-shangla{
    font-size: 5px;
    color: #999999;
  }
  .btn {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    margin: 5px 0;
  }
</style>
