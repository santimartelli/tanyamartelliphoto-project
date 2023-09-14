import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";


export default {
state() {
  return {
    user: null,
    token: null,
    didAutoLogout: false,
  };
},
mutations,
actions,
getters
};