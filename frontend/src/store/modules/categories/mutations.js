export default{
  setCategories(state, categories) {
    state.categories = categories;
  },
  updateCategory(state, {categoryID, categoryName}) {
    const index = state.categories.findIndex(c => c.CategoryID === categoryID);
    state.categories[index].categoryName = categoryName;
  }
}