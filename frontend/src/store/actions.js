//Root actions

export default {
  onResize({ commit }) {
    commit('updateScreenWidth');
  },
};