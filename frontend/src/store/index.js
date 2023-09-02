// Vuex Store

import { createStore } from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

const store = createStore({
  state: {
    screenWidth: window.innerWidth,
    mobile: window.innerWidth <= 854,
    primerNav: window.innerWidth >= 1235,
    segundoNav: window.innerWidth < 1235 && window.innerWidth > 854,
  },
  mutations,
  actions,
  getters,
});

export default store;
