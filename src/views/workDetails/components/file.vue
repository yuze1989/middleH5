<template>
  <div class="sop-box" v-if="content.file">
    <div class="sop-title">
      <span><i class="iconfont icon-wenjian sop-icon-color"></i> 文件</span>
      <i v-if="refer" class="iconfont icon-fasong1" @click="send({
        msgtype: content.msgType,
        enterChat: true,
        file: {
          mediaid: content.file.mediaid,
        }
      })"></i>
    </div>
    <div class="file-con">
      <div class="file-left">
        <div class="file-name">{{content.file.title}}</div>
        <div class="file-size">{{content.file.fileSize}}</div>
      </div>
      <div class="file-icon">
        <img :src="iconUrl[content.file.title.split('.')[1]] || 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/unknown.png'" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    refer: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      iconUrl: {
        csv: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/excel.png',
        xlsx: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/excel.png',
        xls: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/excel.png',
        ppt: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/ppt.png',
        pptx: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/ppt.png',
        pdf: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/pdf.png ',
        doc: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/word.png',
        docx: 'https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/icon/word.png',
      },
    };
  },
  methods: {
    send(content) {
      this.$emit('send', content);
    },
  },
};
</script>

<style scoped>
  .file-con {
    padding: 1.3rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20.7rem;
    margin-left: 2.2rem;
  }
  .file-left {
    overflow: hidden;
  }
  .file-name {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 1.4rem;
    color: rgba(0,0,0,0.85);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  .file-size {
    font-size: 1.2rem;
    color: rgba(0,0,0,0.45);
    margin-top: 1rem;
  }
  .file-icon {
    margin-left: 1rem;
  }
  .file-icon img {
    width: 2.4rem;
    object-fit: cover;
  }
</style>
