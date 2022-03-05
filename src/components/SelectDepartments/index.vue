<template>
  <popup
    v-model="show"
    position="bottom"
    style="border-radius: 1rem 1rem 0 0; background: #F7F8FA;"
    safe-area-inset-bottom
    :close-on-click-overlay="false"
  >
    <div class="main">
      <div class="header">
        <icon name="arrow-left" size="1.7rem" color="#323233" />
        <span class="title">选择部门</span>
        <icon @click="close" name="cross" size="1.7rem" color="#323233" />
      </div>
      <dep-list />
      <div class="confirm">保存</div>
    </div>
  </popup>
</template>

<script>
import {
  Popup,
  Icon,
} from 'vant';
import DepList from './DepList.vue';
import { getDepartments } from '@/api/dailySummary';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  name: 'SelectDepartments',
  components: {
    Popup,
    Icon,
    DepList,
  },
  data() {
    return {
      grade: 0,
      list: [],
      value: [],
    };
  },
  created() {
    this.getDepartmentsList();
  },
  methods: {
    getDepartmentsList() {
      getDepartments()
        .then((res) => {
          if (!res.success || !res.data.length) return;
          this.list = this.formatDep(res.data[0].departmentList);
          console.log(this.list);
        });
    },
    formatDep(depList) {
      return depList.map((dep) => {
        let childDepList = [];
        if (dep.departmentList && dep.departmentList.length) {
          childDepList = this.formatDep(dep.departmentList);
        }
        return {
          id: dep.id,
          depName: dep.deptName,
          childDepList,
          check: false,
        };
      });
    },
    close() {
      this.$emit('update:show', false);
    },
  },
};
</script>

<style scoped>
.main {
  padding-bottom: 0.6rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.3rem 2rem;
}

.title {
  line-height: 2.4rem;
  font-size: 1.7rem;
  color: #323232;
}

.confirm {
  margin: 0 1.7rem;
  height: 4.15rem;
  line-height: 4.15rem;
  background: #4851FF;
  border: 0.05rem solid #979797;
  border-radius: 2.2rem;
  text-align: center;
  font-size: 1.6rem;
  color: #FFFAF2;
}
</style>
