/**
 * Getters generales
 */

export default {
  /**
   * Getter que devuelve el ancho de la pantalla.
   * @param {Object} state - El estado de Vuex.
   * @returns {number} - El ancho de la pantalla.
   */
  screenWidth: (state) => state.screenWidth,
  
  /**
   * Getter que devuelve si la pantalla es móvil o no.
   * @param {Object} state - El estado de Vuex.
   * @returns {boolean} - Un valor booleano que indica si la pantalla es móvil o no.
   */
  mobile: (state) => state.mobile,
  
  /**
   * Getter que devuelve si primerNav (Barra de navegación de escritorio) es visible o no.
   * @param {Object} state - El estado de Vuex.
   * @returns {boolean} - Un valor booleano.
   */
  primerNav: (state) => state.primerNav,

  /**
   * Getter que devuelve si segundoNav (Barra de navegación de tablet) es visible o no.
   * @param {Object} state - El estado de Vuex.
   * @returns {boolean} - Un valor booleano.
   */
  segundoNav: (state) => state.segundoNav,
};