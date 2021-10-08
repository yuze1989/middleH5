import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    corpid: '',
    token: '',
    type: 2,
  },
  mutations: {
    SETCORPID(state, data) {
      state.corpid = data;
    },
    SETTYPE(state, data) {
      state.type = data;
    },
    SETTOKEN(state, data) {
      state.token = data;
    },
  },
  actions: {
    SETCORPID({ commit }, data) {
      commit('SETCORPID', data);
    },
    SETTYPE({ commit }, data) {
      commit('SETTYPE', data);
    },
    SETTOKEN({ commit }, data) {
      commit('SETTOKEN', data);
    },
  },
  modules: {
  },
});
