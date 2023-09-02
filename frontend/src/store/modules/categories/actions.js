import axios from 'axios';

export default {
  getCategories({ commit }) {
    axios
      .get("http://localhost:3000/api/categories")
      .then((res) => {
        commit("setCategories", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
}
