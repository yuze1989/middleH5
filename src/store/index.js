import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    corpid: '',
    token: '',
  },
  mutations: {
    SETCORPID(state, data) {
      state.corpid = data;
    },
    SETTOKEN(state, data) {
      state.token = data;
    },
  },
  actions: {
    SETCORPID({ commit }, data) {
      commit('SETCORPID', data);
    },
    SETTOKEN({ commit }, data) {
      commit('SETTOKEN', data);
    },
  },
  modules: {
  },
});
