<template>
  <div class="box">
    <div class="top-nav">
      <div v-for="(item,index) in nav" :key="index">
        <div :class="{active: type === index}" @click="change(index)">
          {{item}}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content-box" v-for="(item, index) in itemList" :key="index"
      @click.stop="open(item)">
        <div class="flex">
          <i class="iconfont icon-xiayibu2" v-if="!item.isShow"></i>
          <i class="iconfont icon-xiala2" v-else></i>
          <i class="iconfont icon-wenjianjia1"></i>
          <div>{{item.head}}</div>
        </div>
        <!-- 隐藏部分 -->
        <div :class="item.isShow ? 'yes' : 'no' " v-for="(str,subscript) in item.body"
        :key="subscript">
          <div class="left">
              <i class="iconfont icon-fasong1" @click.stop="share(str)"></i>
          </div>
          <div class="right" @click.stop="stop">
            <textOver :content="str.tex" v-if="item.isShow"></textOver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import textOver from '../components/textOver.vue';
import Http from '../utils/http';
import Wechat from '../utils/wechat';

export default {
  components: {
    textOver,
  },
  data() {
    return {
      // 选中的样式下标
      type: 0,

      // 头部选项卡
      nav: ['企业常用语', '个人常用语'],

      // 数据
      itemList: [{
        head: '赏识在于角度的转',
        isShow: false,
        body: [
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: ' 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
        ],
      }, {
        head: '赏识在于角度的转',
        isShow: false,
        body: [
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: ' 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
        ],
      }, {
        head: '赏识在于角度的转',
        isShow: false,
        body: [
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: ' 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
        ],
      }],
    };
  },
  mounted() {
    Wechat.setWxConfig();
  },
  methods: {
    // 阻止冒泡
    stop() {},
    // 分享
    share(item) {
      const obj = item;
      console.log(obj);
    },
    getList() {
      const that = this;
      Http.post('/scrm/comm/rest/sop/page-group-chat-sop-task-batch', {
        taskStatus: that.type + 2,
        pageIndex: that.pageIndex,
        pageSize: 20,
      }, '').then((res) => {
        if (res.success) {
          console.log(res);
        } else {
          Toast(res.errMessage);
        }
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
      console.log(index);
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
