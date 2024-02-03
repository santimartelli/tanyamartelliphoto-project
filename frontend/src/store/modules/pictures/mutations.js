/**
 * Las mutaciones de Vuex para el módulo de imágenes.
 */
export default {
  /**
   * Establece las imágenes del estado.
   * @param {Object} state - El estado de Vuex del módulo de imágenes.
   * @param {Object[]} pictures - Las imágenes a establecer.
   */
  setPictures(state, pictures) {
    state.pictures = pictures;
  },

  /**
   * Elimina una imagen del estado.
   * @param {Object} state - El estado de Vuex del módulo de imágenes.
   * @param {string} pictureId - El ID de la imagen a eliminar.
   */
  deletePicture(state, pictureId) {
    state.pictures = state.pictures.filter(
      p => p.id !== pictureId
    );
  }
}