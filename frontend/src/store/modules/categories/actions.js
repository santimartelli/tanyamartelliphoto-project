import axios from "axios";

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
  updateCategory({ commit, dispatch }, { categoryID, categoryName }) {
    return axios
      .put(`http://localhost:3000/api/categories/${categoryID}`, {
        categoryName,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300){
        dispatch("getCategories");
        commit("updateCategory", { categoryID, categoryName });
        }else{
          console.error(
            `Edit request failed with status: ${response.status}`
          );
        }
        return response;
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Edit request failed with error:", error);
      });
  },
};
