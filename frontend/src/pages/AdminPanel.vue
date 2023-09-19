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
        <div v-show="addImages" class="addPics">
          <div v-if="isLoading">
            <p class="authenticating">Uploading images...</p>
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
                    @click="showModal(picture)"
                  />
                </td>
                <td>{{ picture.categoryName }}</td>
                <td class="actions-container">
                  <button class="btn-action" @click="showModal(picture)">
                    Show
                  </button>
                  <button
                    class="btn-action"
                    @click="editPicture(picture.pictureID)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn-action"
                    @click="deletePicture(picture.pictureID)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Modal -->
        <div v-if="showImageModal" class="backdrop" @click="closeModal">
          <div class="modal">
            <div class="modal-content">
              <img :src="selectedImage.picturePath" alt="Original Image" />
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
        <h1>Tab Two Content</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
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
      categoryID: "",
      addImages: false,
      feedbackMessage: "",
      feedbackOk: 3,
      error: null,
      isLoading: false,
      selectedImage: null,
      showImageModal: false,
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
    },
    closeModal() {
      this.showImageModal = false;
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
.addPics {
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1.2rem;
  max-width: 100%;
}

/* Form add images */
.addPics form {
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

.addPics .preview-pic {
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
.addPics .preview-pic img {
  width: 75px;
  height: 75px;
  object-fit: cover;
}

.preview-pic span {
  font-size: 0.5rem;
  margin-top: 0.3rem;
  max-width: 75px;
}

/* Table */
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
  width: 19%;
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

td > img {
  cursor: pointer;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.actions-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  min-height: 70px;
}
.btn-action {
  font-family: Typewriter-light;
  font-weight: 500;
  letter-spacing: 0.05rem;
  font-size: 0.8rem;
  color: #000;
  width: 120px;
  padding: 0.5rem;
  /* margin: 0.5rem; */
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 3px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}
.btn-action:hover {
  border: 1px solid #f79f9f;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 99;
}

.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-height: 80vh;
  width: 70%;
  background-color: #fff;
}

.modal-content {
  position: relative;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.modal-content img {
  object-fit: contain;
  width: auto;
  height: auto;
  max-height: 80vh;
}

.modal-content img.close {
  position: absolute; /* Position the close image absolutely */
  top: 15px; /* Adjust the top position as needed */
  right: 15px; /* Adjust the right position as needed */
  width: 20px;
  height: 20px;
  opacity: .7;
  z-index: 1; /* Ensure the close image is on top */
}

.modal-content .close:hover,
.modal-content .close:focus {
  opacity: 1;
  cursor: pointer;
}
.thumbnail {
  width: 50px;
  height: 50px;
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

/**
 * Responsive
 */
/*media query 1035px*/
@media (max-width: 1035px) {
  .th-1,
  .th-2,
  .th-3 {
    width: 15%;
  }
}
@media (max-width: 820px) {
  .th-1,
  .th-2,
  .th-3 {
    width: 12%;
  }
}
@media (max-width: 45em) {
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
}
</style>
