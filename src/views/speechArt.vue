<template>
  <div class="box">
    <div class="top-nav">
      <div v-for="(item,index) in nav" :key="index">
        <div :class="{active: type === index}" @click="change(index)">
          {{item}}
        </div>
      </div>
    </div>
    <div class="content" v-if="!err">
      <div class="content-box" v-for="(item, index) in itemList" :key="index"
      @click.stop="open(item)">
        <div class="flex">
          <i class="iconfont icon-xiayibu2" v-if="!item.isShow"></i>
          <i class="iconfont icon-xiala2" v-else></i>
          <i class="iconfont icon-wenjianjia1"></i>
          <div>{{item.name}}</div>
        </div>
        <!-- 隐藏部分 -->
        <div :class="item.isShow ? 'yes' : 'no' " v-for="(obj,subscript) in item.speechList"
        :key="subscript">
          <div class="left">
              <i class="iconfont icon-fasong1" @click.stop="share(obj)"></i>
          </div>
          <div class="right" @click.stop="stop">
            <textOver :content="obj.text" v-if="item.isShow"></textOver>
          </div>
        </div>
      </div>
    </div>
    <jurisdiction :err="err" v-show="err"></jurisdiction>
  </div>
</template>

<script>
import { Toast } from 'vant';
import textOver from '../components/textOver.vue';
import Http from '../utils/http';
import Wechat from '../utils/wechat';
import jurisdiction from '../common/jurisdiction.vue';

export default {
  components: {
    textOver,
    jurisdiction,
  },
  data() {
    return {
      // 选中的样式下标
      type: 0,
      err: '',
      // 头部选项卡
      nav: ['企业常用语', '个人常用语'],

      // 数据
      itemList: [],
    };
  },
  mounted() {
    Wechat.setWxConfig();
    this.getList();
  },
  methods: {
    // 阻止冒泡
    stop() {},
    // 记录话术分享次数
    Statistics(id) {
      Http.post('/scrm/comm/rest/speech/speech-send', {
        speechId: id,
      }, '').then(() => {});
    },
    // 分享
    share(item) {
      const data = {
        msgtype: 'text',
        enterChat: true,
        text: {
          content: item.text, // 文本内容
        },
      };
      Wechat.sendChatMessage(data, item.id);
      this.shake = true;
      Toast.loading({
        duration: 1,
      });
    },
    getList() {
      const that = this;
      Http.post('/scrm/comm/rest/speech/list-speech-group-right', {
        speechType: that.type + 1,
      }, '').then((res) => {
        that.err = '';
        if (res.success) {
          res.data.forEach((obj) => {
            const e = obj;
            e.isShow = false;
          });
          that.itemList = res.data;
        } else {
          that.err = res.errCode;
          Toast(res.errMessage);
        }
      })
        .catch(() => {
          that.err = 'errCode';
        });
    },
    // 展开开关
    open(list) {
      const obj = list;
      if (obj.isShow) {
        obj.isShow = !obj.isShow;
      } else {
        // 先让所有状态变成false再让自己选中的状态变成true
        this.itemList.forEach((data) => {
          const e = data;
          e.isShow = false;
        });
        obj.isShow = !obj.isShow;
      }
    },
    // tab切换
    change(index) {
      this.type = index;
      this.getList();
    },
  },
};
</script>
<style type="text/css" scoped>
  .mask-top{
    display: flex;
    margin: 8px 0;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    text-align: justify;
  }
  .mask-top img{
    width: 39px;
    height: 39px;
    margin-right: 10px;
  }
  .no {
    /* transition: all 1s; */
    overflow: hidden;
    height: 0;
    opacity: 0;
  }

  .yes {
    display: flex;
    opacity: 1;
    /* transition: all 1s; */
    align-items: center;
    padding: 10px 0 10px 20px;
    border-bottom: #F3F3F3 1px dashed;
  }

  .right {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    text-align: justify;
    padding: 0 15px 0px 10px;
  }

 .icon-fasong1 {
  color: #1890FF;
   font-size: 22px;
 }
  .content {
    padding: 10px 0 10px 10px;
  }

  .icon-fasong {
    color: #FFFFFF;
    font-size: 10px;
    margin: 2px 2px 0 0;
  }

  .icon-xiayibu2,
  .icon-xiala2 {
    font-size: 8px;
    color: #999999;
  }

  .icon-wenjianjia1 {
    color: #1890FF;
    margin: 0 8px;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .content-box {
    font-size: 14px;
    color: #333333;
    padding-bottom: 12px;
  }

  .collapse-item {
    color: red;
    padding-bottom: 10px;
  }

  .top-nav {
    height: 44px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    justify-content: space-evenly;
    border-bottom: 1px solid #F3F3F3;
  }

  .top-nav div {
    height: 40px;
    line-height: 40px;
  }

  .active {
    color: #1890FF;
    border-bottom: 2px #1890FF solid;
  }
  .box{
    margin-bottom: 80px;
  }
</style>
