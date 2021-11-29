<template>
  <div>

  </div>
</template>

<script>
import Http from '../utils/http';

export default {
  data() {
    return {
      id: '',
      unionId: '',
      userId: '',
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.unionId = localStorage.getItem('unionId');
    this.userId = localStorage.getItem('userId');
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
          window.location.href = url;
        }
      });
    },
  },
};
</script>
<style >
</style>
