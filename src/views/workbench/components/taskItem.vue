<template>
  <div v-if="taskItem.batchNo" class="content-block" @click="go(taskItem.batchNo)">
    <div class="tite">
      <div class="state" v-if="taskItem.overdueFlag">
        <div class="stateBg"></div>逾期
      </div>
      <div class="task-name">{{taskItem.sopRuleName}}</div>
    </div>
    <div class="task">{{sopType[taskItem.sopType]}}任务</div>
    <div class="push-date">
      <div>推送时间：{{ time(taskItem.taskTime) }}</div>
      <div v-if="taskItem.taskStatus !== 3">
        <div class="overdue" v-if="taskItem.overdueFlag">
          (逾期时间：{{taskItem.taskOverdueTimeStr}})</div>
        <div class="surplus" v-else>(剩余时间：{{taskItem.taskSurplusTimeStr}})</div>
      </div>
    </div>
    <div class="task" v-if="taskItem.taskStatus === 3">
      完成时间：{{time(taskItem.finishTime)}}</div>
  </div>
</template>
<script>

import moment from 'moment';

export default {
  name: 'taskItem',
  props: {
    taskItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      sopType: {
        1: '群SOP',
        2: '客户SOP',
        3: '朋友圈SOP',
      },
    };
  },
  methods: {
    time(value) {
      return moment(value).format('YYYY-MM-DD HH:mm');
    },
    go(id) {
      this.$router.push({
        name: 'workDetails',
        query: {
          batchNo: id,
          refer: 'bench',
        },
      });
    },
  },
};
</script>
<style scoped="scoped">
  .content-block {
    padding: 1.5rem 1.5rem 1.3rem 0;
    font-size: 1.4rem;
    color: #7D8394;
    border-bottom: 0.1rem solid #F3F3F3;
  }

  .task-name {
    font-size: 1.4rem;
    color: #343845;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 500;
    flex: 1;
  }

  .tite {
    display: flex;
    align-taskItem: center;
  }

  .task {
    margin-top: 0.8rem;
  }

  .push-date {
    margin-top: 0.6rem;
    font-size: 1.2rem;
    display: flex;
    align-taskItem: center;
  }

  .state {
    position: relative;
    text-align: center;
    padding: 0.2rem 0.5rem;
    font-size: 1.2rem;
    color: #F3301E;
    margin-right: 0.9rem;
  }

  .stateBg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #E77878;
    opacity: 0.1;
    border-radius: 0.2rem;
  }

  .overdue {
    font-size: 1.2rem;
    color: #FA5252;
    margin-left: 1.5rem;
  }

  .surplus {
    color: #1890FF;
    margin-left: 1.5rem;
  }
</style>
