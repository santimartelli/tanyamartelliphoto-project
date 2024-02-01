/**
 * Mutaciones generales
 */

export default {
  /**
   * Comprueba el ancho de la pantalla y actualiza el estado de mobile, primerNav y segundoNav segun corresponda.
   * @param {Object} state - El estado de Vuex.
   */
  updateScreenWidth(state) {
    state.screenWidth = window.innerWidth;
    state.mobile = window.innerWidth <= 854;
    state.primerNav = window.innerWidth >= 1235;
    state.segundoNav = window.innerWidth < 1235 && window.innerWidth > 854;
  },
};