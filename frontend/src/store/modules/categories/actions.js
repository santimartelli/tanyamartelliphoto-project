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
  updateCategory({ commit, dispatch }, { categoryId, categoryName }) {
    return axios
      .put(`http://localhost:3000/api/categories/${categoryId}`, {
        categoryName,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch("getCategories");
          commit("updateCategory", { categoryId, categoryName });
        } else {
          console.error(`Edit request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Edit request failed with error:", error);
      });
  },

  addNewCategory({ commit, dispatch }, newCategoryName) {
    return axios
      .post(`http://localhost:3000/api/categories`, {
        categoryName: newCategoryName,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const responseData = response.data; // capture the response data
          dispatch("getCategories");
          commit("addNewCategory", { categoryName: responseData.categoryName });
        } else {
          console.error(`Add request failed with status: ${response.status}`);
          throw new Error(`Add request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        console.error("Add request failed with error:", error);
        throw error;
      });
  },
  deleteCategory({ commit, dispatch }, categoryId) {
    return axios
      .delete(`http://localhost:3000/api/categories/${categoryId}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Successfully deleted, commit the mutation and dispatch any necessary actions
          console.log("Successfully deleted category with ID:", categoryId);
          commit("deleteCategory", categoryId);
          dispatch("getCategories");
        } else {
          // Handle unexpected status codes (e.g., 404, 500, etc.)
          console.error(
            `Delete request failed with status: ${response.status}`
          );
        }
        return response;
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Delete request failed with error:", error);
      });
  },
};
