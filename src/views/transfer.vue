<template>
  <div>

  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  mounted() {
    window.location.href = `https://test-scrm.juzhunshuyu.com/scrm-web/#/home?token=${sessionStorage.getItem('token')}`;
  },
  methods: {

  },
};
</script>
<style >
</style>
