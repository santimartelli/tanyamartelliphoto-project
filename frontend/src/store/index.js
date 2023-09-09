// Vuex Store

import { createStore } from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import categoriesModule from "./modules/categories/index.js";
import picturesModule from "./modules/pictures/index.js";
import authModule from "./modules/auth/index.js";

const store = createStore({
  modules: {
    categories: categoriesModule,
    pictures: picturesModule,
    auth: authModule,
  },
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
