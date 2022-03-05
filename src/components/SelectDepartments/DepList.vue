<template>
  <div class="checkbox">
    <checkbox-group v-model="result" ref="checkboxGroup" @change="change">
      <checkbox name="a" v-model="test">复选框 a</checkbox>
      <checkbox name="b">复选框 b</checkbox>
      <checkbox name="c">复选框 c</checkbox>
    </checkbox-group>

    <button type="primary" @click="checkAll">全选</button>
    <button type="info" @click="toggleAll">反选</button>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant';

export default {
  props: {
    depList: {
      type: Array,
      default: () => [],
    },
  },
  name: 'DepList',
  components: {
    Checkbox,
    CheckboxGroup,
  },
  watch: {
    depList(val) {
      this.list = val;
    },
    result: {
      deep: true,
      handler: (val) => {
        console.log(val);
      },
    },
  },
  data() {
    return {
      list: [],
      result: [],
      test: false,
    };
  },
  methods: {
    checkAll() {
      this.$refs.checkboxGroup.toggleAll(true);
    },
    toggleAll() {
      this.$refs.checkboxGroup.toggleAll();
    },
    change() {
      console.log(this.test);
    },
  },
};
</script>

<style scoped>

</style>
