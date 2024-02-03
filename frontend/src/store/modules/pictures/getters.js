/**
 * Define los getters del módulo de imágenes.
 */
export default {
  /**
   * Devuelve las imágenes del estado.
   * @param {Object} state - El estado de Vuex del módulo de imágenes.
   * @returns {Object[]} - Las imágenes del estado.
   */
  pictures: (state) => state.pictures,

  /**
   * Devuelve un valor booleano que indica si el usuario tiene imágenes o no.
   * @param {Object} state - El estado de Vuex del módulo de imágenes.
   * @returns {boolean} - Un valor booleano que indica si el usuario tiene imágenes o no.
   */
  hasPictures: (state) => state.pictures.length > 0,
};