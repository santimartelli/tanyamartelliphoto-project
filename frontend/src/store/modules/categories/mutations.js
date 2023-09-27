export default{
  setCategories(state, categories) {
    state.categories = categories;
  },
  updateCategory(state, {categoryId, categoryName}) {
    const index = state.categories.findIndex(c => c.categoryId === categoryId);
    state.categories[index].categoryName = categoryName;
  },
  addNewCategory(state, { categoryName }) {
    state.categories.push({
      categoryName,
    });
  },
  deleteCategory(state, categoryId) {
    state.categories = state.categories.filter(
      c => c.categoryId !== categoryId
    );
  }
}