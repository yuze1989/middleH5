<template>
  <div class="sop-box" v-if="content">
    <div class="sop-title">
      <span><i class="iconfont icon-wenzi sop-icon-color"></i> 文本</span>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send(content)"></i>
    </div>
    <div class="text-desc">{{content.text.content}}</div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: null,
    },
    refer: {
      type: String,
      default: '',
    },
  },
  methods: {
    send(content) {
      this.$emit('send', content);
    },
  },
};
</script>

<style scoped>
  .text-desc {
    font-size: 1.4rem;
    color: rgba(0,0,0,0.65);
    margin-left: 2.2rem;
  }
</style>
