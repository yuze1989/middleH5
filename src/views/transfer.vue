<template>
  <div>
  </div>
</template>

<script>
import Http from '../utils/http';
import Util from '../utils/util';

export default {
  data() {
    return {
      id: '',
      unionId: '',
      userId: '',
    };
  },
  mounted() {
    this.unionId = localStorage.getItem('unionId');
    this.userId = localStorage.getItem('userId');
    const options = Util.getUrlOption(window.location.href);
    this.id = options.radarId;
    this.judge();
  },
  methods: {
    judge() {
      if (!this.id) {
        window.location.href = `https://test-scrm.juzhunshuyu.com/scrm-web/#/home?token=
        ${sessionStorage.getItem('token')}`;
      } else {
        this.jump();
      }
    },
    jump() {
      Http.post('/scrm/comm/rest/interactive-radar/browse', {
        radarId: this.id,
        staffId: this.userId,
        customerId: this.unionId,
      }, '').then((res) => {
        if (res.success) {
          this.finish(res.data.contentLink);
        }
      });
    },
    finish(url) {
      Http.post('/scrm/comm/rest/interactive-radar/finish', {
        radarId: this.id,
        staffId: this.userId,
        customerId: this.unionId,
      }, '').then((res) => {
        if (res.success) {
          console.log(url);
          // window.location.href = url;
        }
      });
    },
  },
};
</script>
<style >
</style>
