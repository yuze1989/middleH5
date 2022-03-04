<template>
  <div :id="id" style="width: 100%; height: 21.8rem;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    id: {
      type: String,
      default: 'main',
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  name: 'Charts.vue',
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    options(val) {
      if (this.chart) {
        this.chart.setOption(val);
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.chart = echarts.init(document.getElementById(this.id));
    },
  },
};
</script>

<style scoped>
#main {
  width: 100%;
  height: 21.8rem;
}
</style>
