export default {
  setPictures(state, pictures) {
    state.pictures = pictures;
  },
  deletePicture(state, pictureId) {
    state.pictures = state.pictures.filter(
      p => p.id !== pictureId
    );
  }
}