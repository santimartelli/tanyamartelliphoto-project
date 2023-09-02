import axios from "axios";

export default {
  getPictures({ commit }) {
    axios
      .get("http://localhost:3000/api/pictures")
      .then((response) => {
        commit("setPictures", response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
}