<template>
    <div>
        <div  v-for="(item,index) in content" :key="index">
            <div class="text-image-box" v-if="item.contentType==='text/image'">
                <div class="content-text" v-if="item.msgType === 'text'">{{item.text.content}}</div>
                <div v-if="item.msgType === 'image'">
                    <img class="img-box" :src="item.image.attachmentPath" alt="">
                </div>
            </div>
            <div class="text-image-box" v-if="item.contentType==='link'">
            <div class="content-text" v-if="item.msgType === 'text'">{{item.text.content}}</div>
            <div v-if="item.msgType === 'link'">
                <div class="link-box">
                    <img style="width:8.6rem; height:9.1rem" :src="item.link.imgUrl" alt="">
                    <div class="link-title">{{item.link.title}}</div>
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
  data() {
    return {
      aa: 1,
    };
  },
};
</script>
<style scoped>
  .text-image-box {
    padding:0 1.5rem;
    font-size: 1.4rem;
    color: rgba(0,0,0,0.65);
  }
  .content-text {
    padding: 1.5rem 0;
  }
  .img-box {
    width: 10rem;
    height: 10rem;
  }
  .link-box{
    display: flex;
    align-items: center;
    border-radius: 3.49332594871521px;
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
