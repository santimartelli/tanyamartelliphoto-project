export default{
  user(state){
    return state.user;
  },
  token(state){
    return state.token;
  },
  isAuthenticated(state){
    return !!state.token;
  }
};