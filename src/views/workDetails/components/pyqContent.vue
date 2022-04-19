<template>
  <div class="col">
      <div class="content-col" v-for="(item,index) in content" :key="index">
        <span class="text-image-box image-col" v-if="item.contentType==='text/image'">
          <span
            class="content-text image-text"
            v-if="item.msgType === 'text'">
              {{item.text.content}}
          </span>
          <span v-if="item.msgType === 'image'">
            <img
              :class="{imgbox1:index == 1}"
              class="img-box"
              :src="item.image.attachmentPath" alt="">
          </span>
        </span>
      <div class="text-image-box" v-if="item.contentType==='link'">
        <div class="content-text" v-if="item.msgType === 'text'">{{item.text.content}}</div>
        <div v-if="item.msgType === 'link'">
          <div class="link-box">
            <img style="width:8.6rem; height:9.1rem" :src="item.link.imgUrl" alt="">
            <div class="link-title content-text">{{item.link.title}}</div>
          </div>
        </div>
      </div>
      <div class="text-image-box" v-if="item.contentType==='video'">
        <div class="content-text" v-if="item.msgType === 'text'">{{item.text.content}}</div>
        <div v-if="item.msgType === 'video'">
          <a
            class="video-path"
            :href="item.video.attachmentPath"
          >
            <img style="width:100%;height:100%" :src="item.video.picPath" alt="">
          </a>
        </div>
      </div>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: Array,
      default: () => [],
    },
    refer: {
      type: String,
      default: '',
    },
  },
};
</script>
<style scoped>
  .col {
    padding:1rem 0.5rem;
  }
  .content-col{
    display:inline
  }
  .text-image-box {
    padding:0 1.5rem;
    font-size: 1.4rem;
    color: rgba(0,0,0,0.65);
  }
  .image-col{
    padding:0.5rem;
  }
  .content-text {
    margin: 0.5rem 0 1.5rem 0;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .image-text {
    display: block;
    margin-top: -2rem;
    margin-left: 1rem;
  }
  .img-box {
    width: 10rem;
    height: 10rem;
    padding-bottom: 0.5rem;
  }
  .imgbox1{
    margin-left: -0.5rem;
  }
  .link-box{
    display: flex;
    align-items: center;
    border-radius: 0.35rem;
    background: rgba(247,247,247,1);
    padding: 1rem;
  }
  .link-title{
    padding-left:1rem;
  }
  .video-path{
     display: block;
    position: relative;
    width:15rem;
    height:15rem;
  }
  .video-path:before {
    content: '';
    width: 3rem;
    height: 3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/play.png') no-repeat
      center;
    background-size: 100%;
    cursor: pointer;
  }
</style>
