/**
 * @fileoverview Este archivo es el encargado de crear el store de Vuex, el cual es el encargado
 * de almacenar los datos de la aplicación.
 */

import { createStore } from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import categoriesModule from "./modules/categories/index.js";
import picturesModule from "./modules/pictures/index.js";
import authModule from "./modules/auth/index.js";
import messagesModule from "./modules/messages/index.js";
import bookingsModule from "./modules/bookings/index.js";

/**
 * Crea el store de Vuex.
 * @returns {Object} - El store de Vuex.
 * @property {Object} modules - Los módulos del store, los cuales son: categorías, imágenes, autenticación, mensajes y reservas.
 * @property {Object} state - El estado del store de Vuex.
 * @property {Object} mutations - Las mutaciones del store.
 * @property {Object} actions - Las acciones del store.
 * @property {Object} getters - Los getters del store.
 */
const store = createStore({
  modules: {
    categories: categoriesModule,
    pictures: picturesModule,
    auth: authModule,
    messages: messagesModule,
    bookings: bookingsModule,
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
