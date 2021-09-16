<template>
  <div class="box">
    <div class="top-nav">
      <div v-for="(item,index) in nav" :key="index">
        <div :class="{active: type===index}" @click="change(index)">
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
        <div :class="item.isShow?'yes':'no'" v-for="(item2,index2) in item.body" :key="index2">
          <div class="left">
            <div class="share" @click.stop="share(item2)">
              <i class="iconfont icon-fasong"></i>
            </div>
          </div>
          <div class="right" @click.stop="stop">
            <div class="article">
              {{item2.tex}}
            </div>
            <div @click="wbe()" class="text">
            {{!isWbe?'展开':'收起'}}
            <i class="iconfont icon-xiala" v-if="!isWbe"></i>
            <i class="iconfont icon-shangla" v-else></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分享弹窗 -->
    <div class="mask" v-show="isMask">
      <div class="mask-box">
        <div class="mask-tit">
          发送给：
        </div>
        <div class="mask-top">
          <img src="../assets/logo.png" >
          <div>我叫中秋</div>
        </div>
        <div class="mask-content">
          三、我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第一、可以帮助企业管理客户的微信帐号…
        </div>
        <div class="mask-input">
          <input type="text" placeholder="留言" v-model="tex"/>
        </div>
        <div class="foot">
          <div @click="cancel">取消</div>
          <div @click="send ">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isWbe: false,
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
        isShow: true,
        body: [
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: ' 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
          { tex: '一、客服过滤的高机X总，您好，我是巨准SC我们巨准SCRM基于微信，做了一个客户管理和营销的系统；第       一、可以帮助企业管理客户的微信帐号资料； 第二、 可以监控、 指导销售聊天， 防止销售飞防止销售飞防止销售飞' },
        ],
      }],
      // 是否显示弹窗
      isMask: false,
      // 留言内容
      tex: '',
    };
  },
  methods: {
    // 是否展开文本
    wbe() {
      this.isWbe = !this.isWbe;
    },
    // 阻止冒泡
    stop() {},
    // 取消
    cancel() {
      console.log(123);
      this.isMask = !this.isMask;
    },
    // 发送
    send() {
      console.log('点击发送');
    },
    // 分享
    share(item) {
      const obj = item;
      const that = this;

      that.isMask = !that.isMask;
      console.log(obj);
    },
    // 展开开关
    open(list) {
      const obj = list;
      if (obj.isShow) {
        obj.isShow = !obj.isShow;
      } else {
        // 先让所有状态变成false再让自己选中的状态变成true
        this.itemList.forEach((res) => {
          const e = res;
          e.isShow = false;
        });
        obj.isShow = !obj.isShow;
      }
    },
    // tab切换
    change(idx) {
      this.type = idx;
      console.log(idx);
    },
  },
};
</script>
<style type="text/css" scoped>
  .icon-xiala,.icon-shangla{
    font-size: 5px;
    color: #999999;
  }
  .text{
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    margin: 5px 0;
  }
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

  .article {
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 4;
    /** 显示的行数 **/
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

  .share {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1890FF;
    border-radius: 50%;
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
    font-size: 5px;
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
  .mask{
    background-color: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mask-box{
    width: 260px;
    padding:12px 20px;
    background: #FFFFFF;
    border-radius: 2px;
  }
  .mask-tit{
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    text-align: justify;
  }
  .mask-content{
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    margin-bottom: 12px;
    background: #F5F5F5;
    padding: 10px;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 4;
    /** 显示的行数 **/
  }
  .mask-inp{
    width: 100%;
    border-bottom: #F3F3F3 1px solid;
    padding-bottom: 5px;
  }
  .foot{
    display: flex;
    font-size: 14px;
    color: #1890FF;
    letter-spacing: 0;
    text-align: justify;
  }
  .foot div{
     margin: 20px 0 15px 0;
    text-align: center;
    flex:1;
  }
  .mask-input input{
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    width: 99%;
    border: none;
    outline:none;
    margin: 0;
    padding: 0;
  }
</style>
