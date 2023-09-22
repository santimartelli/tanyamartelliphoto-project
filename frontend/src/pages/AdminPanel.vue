<template>
  <div>
    <!--Feedback message dialog-->
    <transition name="feedback" appear>
      <div class="feedbackOk" v-if="feedbackOk === 1">
        <img src="../assets/Icons/ok.png" alt="ok" />
        <p>
          {{ feedbackMessage }}
        </p>
      </div>
    </transition>
    <transition name="feedback" appear>
      <div class="feedbackError" v-if="feedbackOk === 2">
        <img src="../assets/Icons/error.png" alt="Error" />
        <p>
          {{ feedbackMessage }}
        </p>
      </div>
    </transition>

    <div class="tabs">
      <!-- Tab 1 -->
      <input type="radio" name="tabs" id="tabone" />
      <label for="tabone">Pictures</label>
      <div class="tab">
        <!-- Inside the tab -->
        <!-- Botón para añadir imagenes -->
        <base-button class="buttonAddPic" @click="addImages = !addImages"
          >Add Images</base-button
        >
        <div v-show="addImages" class="addItem">
          <div v-if="isLoading">
            <p>Uploading images...</p>
            <base-spinner />
          </div>
          <div v-else>
            <form @submit.prevent="submitForm">
              <div class="inputs-container">
                <input
                  type="file"
                  ref="fileInput"
                  class="file-select"
                  multiple
                  @change="handleFileUpload"
                  @click="resetUpload"
                />
                <div class="category-select">
                  <select v-model="categoryID" ref="categoryInput">
                    <option value="" disabled selected hidden>
                      Choose a category
                    </option>
                    <option
                      v-for="cat in categories"
                      :key="cat.CategoryID"
                      :value="cat.CategoryID"
                    >
                      {{ cat.CategoryName }}
                    </option>
                  </select>
                </div>
              </div>
              <div v-show="categoryID" class="preview-container">
                <div class="preview-pic" v-for="file in files" :key="file.name">
                  <div class="img-container">
                    <img :src="file.preview" alt="Preview" />
                  </div>
                  <span>{{ file.name }}</span>
                </div>
              </div>
              <div
                v-show="categoryID && files.length > 0"
                class="buttons-container"
              >
                <base-button @click="submitForm">Upload</base-button>
                <base-button @click="resetUpload">Cancel</base-button>
              </div>
            </form>
          </div>
        </div>
        <!-- Table with pictures -->
        <div>
          <table>
            <thead>
              <tr>
                <th class="th-1" @click="sort('id')">Image Id</th>
                <th class="th-2">Preview</th>
                <!-- <th @click="sort('category_id')">Category Id</th> -->
                <th class="th-3" @click="sort('category_name')">Category</th>
                <th class="th-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="picture in pictures" :key="picture.pictureID">
                <td>{{ picture.pictureID }}</td>
                <td>
                  <img
                    :src="picture.picturePath"
                    alt="Thumbnail"
                    class="thumbnail"
                  />
                </td>
                <td>{{ picture.categoryName }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/view.png"
                      alt="Ver imagen"
                      title="Ver imagen"
                      @click="showModal(picture)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container view"
                    @click="showModal(picture)"
                  >
                    <img src="../assets/Icons/view.png" alt="Ver imagen" />
                    <div>VIEW IMAGE</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Borrar imagen"
                      title="Borrar imagen"
                      @click="deletePicture(picture.pictureID)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deletePicture(picture.pictureID)"
                  >
                    <img src="../assets/Icons/delete.png" alt="Borrar imagen" />
                    <div>DELETE IMAGE</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Modal -->
        <div v-if="showImageModal">
          <div class="backdrop" @click="closeModal"></div>
          <div class="modal">
            <div class="modal-content">
              <div class="backdrop2" @click="closeModal"></div>
              <img
                :src="selectedImage.picturePath"
                alt="Original Image"
                class="imagen"
              />
              <img
                src="../assets/Icons/closeB.png"
                class="close"
                @click="closeModal"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Tab 2 -->
      <input type="radio" name="tabs" id="tabtwo" />
      <label for="tabtwo">Categories</label>
      <div class="tab">
        <!-- Inside the tab -->
        <!-- Botón para añadir imagenes -->
        <base-button class="buttonAddPic" @click="addCategory = !addCategory"
          >Add Category</base-button
        >
        <div v-show="addCategory" class="addItem">
          <div v-if="isLoading">
            <p>Adding category...</p>
            <base-spinner />
          </div>
          <div v-else>
            <form @submit.prevent="sendForm">
              <div class="inputs-container">
                <input
                  type="text"
                  name="cateogry"
                  id="category-input"
                  placeholder="Introduce el nombre de la nueva cateogria"
                />
                <base-button @click="sendForm">Upload</base-button>
                <base-button @click="resetForm">Cancel</base-button>
              </div>
            </form>
          </div>
        </div>
        <!-- Table with categories -->
        <div>
          <table class="categories">
            <thead>
              <tr>
                <th class="th-1">Category Id</th>
                <th class="th-2">Category Name</th>
                <th class="th-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.CategoryID">
                <td>{{ category.CategoryID }}</td>
                <td>{{ category.CategoryName }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/pen.png"
                      alt="Editar categoria"
                      title="Editar categoria"
                      @click="editCategory(category.CategoryID)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container edit"
                    @click="editCategory(category.CategoryID)"
                  >
                    <img src="../assets/Icons/pen.png" alt="Editar categoria" />
                    <div>EDIT CATEGORY</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Eliminar categoria"
                      title="Eliminar categoria"
                      @click="deleteCategory(category.CategoryID)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deleteCategory(category.CategoryID)"
                  >
                    <img
                      src="../assets/Icons/delete.png"
                      alt="Eliminar categoria"
                    />
                    <div>DELETE CATEGORY</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Tab 3 -->
      <input type="radio" name="tabs" id="tabthree" />
      <label for="tabthree">Requests</label>
      <div class="tab">
        <h1>Tab Three Content</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      addImages: false,
      addCategory: false,
      categoryID: "",
      feedbackMessage: "",
      feedbackOk: 3,
      error: null,
      isLoading: false,
      selectedImage: null,
      showImageModal: false,
      iconsActions: false,
    };
  },
  computed: {
    categories() {
      return this.$store.getters["categories/categories"];
    },
    pictures() {
      return this.$store.getters["pictures/pictures"];
    },
  },
  methods: {
    handleFileUpload(event) {
      this.files = Array.from(event.target.files).map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          file.preview = reader.result;
        };
        return file;
      });
    },
    async submitForm() {
      this.isLoading = true;
      const formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        formData.append("images", this.files[i]);
      }
      formData.append("categoryID", this.categoryID);

      try {
        const response = await fetch("http://localhost:3000/api/pictures", {
          method: "POST",
          body: formData,
        });
        if (response.status >= 200 && response.status < 300) {
          this.feedbackMessage = "Pictures uploaded successfully";
          this.feedbackOk = 1;
          setTimeout(() => {
            this.feedbackMessage = "";
            this.feedbackOk = 3;
          }, 3000);
          // Clear the file input and reset categoryID after successful upload
          //reset inputs
          this.files = [];
          this.categoryID = "";
          // Fetch updated pictures data from the server (you may need to implement this)
          this.$store.dispatch("pictures/getPictures"); // Assuming you have a Vuex action for this
        } else {
          this.files = [];
          this.categoryID = "";
          this.feedbackOk = 2;
          this.feedbackMessage = "Failed to upload pictures, please try again";
          setTimeout(() => {
            this.feedbackMessage = "";
            this.feedbackOk = 3;
          }, 3000);
        }
      } catch (err) {
        this.files = [];
        this.categoryID = "";
        this.error =
          err.message || "Failed to upload images, please try again.";
        this.feedbackOk = 2;
        this.feedbackMessage = "Failed to upload images, please try again.";
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
      this.$refs.fileInput.value = "";
      this.$refs.categoryInput.value = "";
      this.files = [];
      this.categoryID = "";
    },
    resetUpload() {
      this.feedbackMessage = "";
      this.feedbackOk = 3;
      this.$refs.fileInput.value = "";
      this.$refs.categoryInput.value = "";
      this.files = [];
      this.categoryID = "";
    },
    async deletePicture(pictureID) {
      try {
        const response = await this.$store.dispatch(
          "pictures/deletePicture",
          pictureID
        );
        if (response && response.status >= 200 && response.status < 300) {
          this.$store.commit("pictures/deletePicture", pictureID);
          this.feedbackMessage = "Picture deleted successfully";
          this.feedbackOk = 1;
        } else {
          this.feedbackOk = 2;
          this.feedbackMessage = "Failed to delete picture, please try again";
        }
      } catch (error) {
        this.feedbackOk = 2;
        this.feedbackMessage = "Failed to delete picture, please try again";
        console.log(error);
      }
      setTimeout(() => {
        this.feedbackMessage = "";
        this.feedbackOk = 3;
      }, 3000);
    },
    showModal(picture) {
      this.selectedImage = picture;
      this.showImageModal = true;
      document.body.style.overflow = "hidden";
    },
    closeModal() {
      this.showImageModal = false;
      document.body.style.overflow = "auto";
    },
    showIconsActions() {
      // Get the window width
      const windowWidth = window.innerWidth;
      // If width is less than or equal to 821px, set iconsActions to true
      if (windowWidth <= 821) {
        this.iconsActions = true;
      } else {
        this.iconsActions = false;
      }
    },
    async editCategory(categoryID) {
      const categoryName = prompt("Enter the new category name");

      if (categoryName) {
        try {
          await this.$store.dispatch("categories/updateCategory", {
            categoryID,
            categoryName,
          });
          this.feedbackMessage = "Category updated succesfully";
          this.feedbackOk = 1;
        } catch (error) {
          this.feedbackMessage = "Error updating category, please try again";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },
  },
  created() {
    this.showIconsActions();
  },
  watch: {
    // Watch for changes in the window width
    "$store.getters.screenWidth"() {
      this.showIconsActions();
    },
  },
};
</script>

<style scoped>
/**
 * Generic Styling
*/
body {
  background: #eee;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 10vh;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
  line-height: 1.5;
  max-width: 60rem;
  margin: 0 auto;
  font-size: 112%;
}

.feedbackOk,
.feedbackError {
  position: fixed;
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  top: 1rem;
  right: 1rem;
  border-radius: 4px;
  padding: 0 1rem;
  height: 75px;
  font-size: 0.8rem;
  opacity: 0.95;
}

.feedbackOk {
  background-color: #e2efe1;
  color: #016a3b;
}

.feedbackError {
  background-color: #ebd4d4;
  color: #ab0000;
}
.feedbackOk img,
.feedbackError img {
  opacity: 0.7;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.feedbackOk p,
.feedbackError p {
  margin: 0; /* Remove default margin */
  display: flex;
  align-items: center; /* Center horizontally */
}

.feedback-enter-active,
.feedback-leave-active {
  transition: all 0.4s ease;
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
}

.buttonAddPic {
  margin-bottom: 1rem;
}
/* Container add images */
.addItem {
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1.2rem;
  max-width: 100%;
}

/* Form add images */
.addItem form {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inputs-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1re;
}

.file-select {
  width: 300px;
  border-radius: 4px;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  letter-spacing: 0.02rem;
  border: 1px solid #ccc;
  background-color: #f3f2f2;
}

.file-select::file-selector-button {
  border: 1px solid #000;
  border-radius: 4px;
  padding: 8px;
  margin-right: 20px;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  letter-spacing: 0.02rem;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.file-select::file-selector-button:hover {
  border: 1px solid #f79f9f;
}

.category-select select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 8px;
  /* other styles for aesthetics */
  width: 100%;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #000;
  cursor: pointer;
  margin-left: 1rem;
  letter-spacing: 0.02rem;
}
.category-select {
  position: relative;
  width: 300px;
}

.category-select::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-image: url("../assets/Icons/flecha-abajo.png");
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
}

select option {
  padding-top: 4px;
  padding-bottom: 4px;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: left;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/*space between buttons*/
.buttons-container div {
  margin: 0 0.5rem;
}

.addItem .preview-pic {
  display: flex;
  width: 75px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 0;
}

.preview-pic + .preview-pic {
  margin-left: 1rem;
}

.img-container {
  width: 75px;
  height: 75px;
}
.addItem .preview-pic img {
  width: 75px;
  height: 75px;
  object-fit: cover;
}

.preview-pic span {
  font-size: 0.5rem;
  margin-top: 0.3rem;
  max-width: 75px;
}

/* Table pictures*/
table {
  border-collapse: collapse;
  width: 100%;
  font-family: Typewriter-extralight;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
}

.th-1,
.th-2,
.th-3 {
  width: 20%;
}
th,
td {
  text-align: left;
  padding: 0.5rem;
}

th {
  background-color: #98bb99;
  color: white;
  cursor: pointer;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.thumbnail {
  width: 50px;
  height: 50px;
}

.actions-container {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;
  min-height: 70px;
}
.icon-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.6rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  opacity: 0.7;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

.icon-container div {
  margin-left: 0.5rem;
}

.icon-container img {
  width: 25px;
  height: 25px;
}
.view:hover {
  opacity: 1;
  background-color: #ddedfb;
}

.delete:hover {
  opacity: 1;
  background-color: #f9d0cd;
}

.icon-container + .icon-container {
  margin-left: 1rem;
}
.icon {
  width: 25px;
  height: 25px;
  opacity: 0.7;
  transition: all 0.2s ease;
  cursor: pointer;
}

.icon {
  margin: 0.5rem;
}

.icon:hover {
  opacity: 1;
}
.icon-container:hover {
  opacity: 1;
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 90;
}

.backdrop2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: transparent;
  z-index: 90;
}

.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-height: 80vh;
  background-color: transparent;
  z-index: 94;
}

.modal-content {
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 96;
}

.modal-content img {
  position: relative;
  object-fit: contain;
  max-height: 80vh;
  z-index: 98;
}

.modal-content img.close {
  position: absolute; /* Position the close image absolutely */
  top: 15px; /* Adjust the top position as needed */
  right: 15px; /* Adjust the right position as needed */
  width: 20px;
  height: 20px;
  opacity: 0.7;
  z-index: 100; /* Ensure the close image is on top */
}

.modal-content .close:hover,
.modal-content .close:focus {
  opacity: 1;
  cursor: pointer;
}

/**
 * Tabs
 */
.tabs {
  display: flex;
  flex-wrap: wrap; /* make sure it wraps */
}
.tabs label {
  order: 1; /* Put the labels first */
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
  display: block;
  padding: 1rem 2rem;
  margin-right: 0.2rem;
  cursor: pointer;
  background: #eee;
  transition: background ease 0.5s;
}
.tabs .tab {
  order: 99; /* Put the tabs last */
  flex-grow: 1;
  width: 100%;
  display: none;
  padding: 1rem;
  background: #fff;
}
.tabs input[type="radio"] {
  display: none;
}
.tabs input[type="radio"]:checked + label {
  background: #fff;
}
.tabs input[type="radio"]:checked + label + .tab {
  display: block;
}

/*Table categories*/
.categories .th-1,
.categories .th-2 {
  width: 25%;
}

.edit:hover {
  opacity: 1;
  background-color: #fdf6df;
}

/**
 * Responsive
 */
@media (max-width: 821px) {
  .tabs .tab,
  .tabs label {
    order: initial;
  }
  .tabs label {
    width: 100%;
    margin-right: 0;
    margin-top: 0.2rem;
  }

  .th-1,
  .th-2,
  .th-3 {
    width: 25%;
  }

  .categories .th-1,
  .categories .th-2,
  .categories .th-3 {
    width: 30%;
  }

  .modal {
    max-width: 100%;
    width: 100%;
    z-index: 100;
  }

  .modal-content {
    position: relative;
    max-height: 100vh; /* Set the maximum height to 80% of the viewport height */
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0; /* Remove padding to avoid extra space */
    overflow: auto; /* Enable scroll if needed */
  }

  .modal-content img {
    max-height: 100%; /* Allow the image to scale down as needed */
    max-width: 100%; /* Allow the image to scale down as needed */
    width: auto; /* Ensure the image maintains its original aspect ratio */
    height: auto; /* Ensure the image maintains its original aspect ratio */
  }
}
</style>
