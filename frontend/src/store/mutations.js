export default {
  updateScreenWidth(state) {
    state.screenWidth = window.innerWidth;
    state.mobile = window.innerWidth <= 854;
    state.primerNav = window.innerWidth >= 1235;
    state.segundoNav = window.innerWidth < 1235 && window.innerWidth > 854;
  },
};