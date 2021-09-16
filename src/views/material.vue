<template>
  <div class="box-bos">
    <ul>
      <li :class="{'active':indexTap == index}" v-for="(item,index) in lists" :key="index"
      @click="change(index)">
        {{item}}
      </li>
    </ul>
    <div class="content-box">
      <div class="tip">(共有{{sum}}个文章素材)</div>
      <div class="article" v-for="(item,index) in dataList" :key="index">
        <div class="left">
          <div class="left-vie" @click.stop="share(item)">
            <i class="iconfont icon-fasong"></i>
          </div>
           <img src="../assets/logo.png" >
        </div>
        <div class="right">
            <div class="name">{{item.name}}</div>
            <div class="sizi">{{item.content}}</div>
            <div class="flex">
              <div class="ad" v-for="(item2,index2) in item.label" :key="index2">{{item2}}</div>
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
  name: 'about',
  data() {
    return {
      // 提示数量
      sum: 5,

      // 选中的下标
      indexTap: 0,

      // 头部选项卡
      lists: ['文章', '链接', '海报', '视频', 'FDF', 'PPT'],

      // 数据
      dataList: [
        {
          name: '私域财经第一报道',
          url: '@/assets/logo.png',
          content: '朝廷重新启用曾国藩，曾国藩一改',
          label: ['广告投放', '电销销售'],
        },
        {
          name: '私域财经第一报道',
          url: '../assets/logo.png',
          content: '朝廷重新启用曾国藩，曾国藩一改',
          label: ['广告投放', '电销销售', '电销销售'],
        },
        {
          name: '私域财经第一报道',
          url: '../assets/logo.png',
          content: '朝廷重新启用曾国藩，曾国藩一改',
          label: ['广告投放'],
        }],
      // 是否显示弹窗
      isMask: false,

      // 留言内容
      tex: '',
    };
  },
  methods: {
    // 取消
    cancel() {
      console.log(123);
      this.isMask = !this.isMask;
    },
    // tab切换
    change(idx) {
      this.indexTap = idx;
      console.log(idx);
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
  },
};
</script>
<style scoped="scoped">
  ul::-webkit-scrollbar {
    display: none;
  }

  .active {
    color: #1890FF;
    border-bottom: 2px #1890FF solid;
    font-weight: bolder;
  }

  .box-bos {
    overflow: hidden;
  }

  .left-vie {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1890FF;
    border-radius: 50%;
  }

  .icon-fasong {
    color: #FFFFFF;
    font-size: 10px;
    margin: 2px 2px 0 0;
  }

  li {
    border-bottom: 2px rgba(0,0,0,0) solid;
    text-align: center;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding: 10px 0;
    margin: 0 20px;
  }

  ul {
    height: 44px;
    display: flex;
    align-items: center;
    overflow: auto;
    padding-left: 0;
    list-style: none;
    margin: 0;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }

  .content-box {
    margin-bottom: 80px;
    border-top: 1px solid #F3F3F3;
    margin-top: -2px;
    padding: 10px 20px 0 20px;
  }

  .tip {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
  }
  .article {
    opacity: 1;
    padding: 10px 0;
    display: flex;
    align-items: flex-start;
    border-bottom: #F3F3F3 1px dashed;
  }
  .left{
    display: flex;
    align-items: center;
  }
  .left img{
    margin: 0 10px 0 8px;
    width: 46px;
    height: 46px;
  }
  .flex{
    display: flex;
    flex-wrap: wrap;
    margin-top: 3px;
  }
  .name{
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
  }
  .ad{
    margin-right:8px ;
    padding:6px 9px ;
    background: rgba(24,144,255,0.05);
    border-radius: 1px;
    opacity: 0.5;
    font-size: 12px;
    color: #275783;
    line-height: 10px;
  }
  .sizi{
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1;
    /** 显示的行数 **/
  }
  .mask{
    background-color: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 1;
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
</style>
