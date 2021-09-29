import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    corpid: '',
  },
  mutations: {
    SETCORPID(state, data) {
      state.corpid = data;
    },
  },
  actions: {
    SETCORPID({ commit }, data) {
      commit('SETCORPID', data);
    },
  },
  modules: {
  },
});
