<template>
  <div>
    <div>
      <div>00099999999999999999</div>
      <p>id:{{id}}</p>
      <p>unionId:{{unionId}}</p>
      <p>userId:{{userId}}</p>
    </div>
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
    console.log(999988888);
    this.id = this.$route.query.radarId;
    console.log(this.id, 1233321);
    this.unionId = localStorage.getItem('unionId');
    this.userId = localStorage.getItem('userId');

    alert(this.id);
    this.judge();
  },
  methods: {
    judge() {
      console.log(this.id);
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
