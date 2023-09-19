export default {
  setPictures(state, pictures) {
    state.pictures = pictures;
  },
  deletePicture(state, pictureID) {
    state.pictures = state.pictures.filter(
      p => p.id !== pictureID
    );
  }
}