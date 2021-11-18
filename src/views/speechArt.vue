<template>
  <div class="box">
    <div class="top-nav" v-if="err !== '0100000006'">
      <div v-for="(item,index) in nav" :key="index" class="tab-box">
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
      Wechat.setAgentConfig(data, 'sendChatMessage', this.Statistics(item.id));
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
    margin: 0.8rem 0;
    font-size: 1.2rem;
    color: rgba(0,0,0,0.65);
    text-align: justify;
  }
  .mask-top img{
    width: 3.9rem;
    height: 3.9rem;
    margin-right: 1rem;
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
    padding: 1rem 0 1rem 2rem;
    border-bottom: #F3F3F3 0.1rem dashed;
  }

  .right {
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    text-align: justify;
    padding: 0 1.5rem 0 1rem;
  }

 .icon-fasong1 {
  color: #1890FF;
   font-size: 2.2rem;
 }
  .content {
    padding: 1rem 0 1rem 1rem;
  }

  .icon-fasong {
    color: #FFFFFF;
    font-size: 1rem;
    margin: 0.2rem 0.2rem 0 0;
  }

  .icon-xiayibu2,
  .icon-xiala2 {
    font-size: 0.8rem;
    color: #999999;
  }

  .icon-wenjianjia1 {
    color: #1890FF;
    margin: 0 0.8rem;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .content-box {
    font-size: 1.4rem;
    color: #333333;
    padding-bottom: 1.2rem;
  }

  .collapse-item {
    color: red;
    padding-bottom: 1rem;
  }

  .top-nav {
    height: 4.4rem;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    justify-content: space-evenly;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .tab-box {
    height: 4rem;
    line-height: 4rem;
  }

  .active {
    color: #1890FF;
    border-bottom: 0.2rem #1890FF solid;
  }
  .box{
    margin-bottom: 8rem;
  }
</style>
