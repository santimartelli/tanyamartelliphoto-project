export default {
  onResize({ commit }) {
    commit('updateScreenWidth');
  },
};