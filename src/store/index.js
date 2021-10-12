import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    type: 2,
    navType: 0,
  },
  mutations: {
    SETNACVTYPE(state, data) {
      state.navType = data;
    },
    SETTYPE(state, data) {
      state.type = data;
    },
  },
  actions: {
    SETNACVTYPE({ commit }, data) {
      commit('SETNACVTYPE', data);
    },
    SETTYPE({ commit }, data) {
      commit('SETTYPE', data);
    },
  },
  modules: {
  },
});
