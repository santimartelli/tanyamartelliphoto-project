<template>
  <div class="tabs">
    <base-dialog :show="!!error" title="Error" @close="handleError">
      <p>{{ error }}</p></base-dialog
    >
    <!-- Tab 1 -->
    <input type="radio" name="tabs" id="tabone" checked="checked" />
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
            <input
              type="file"
              ref="fileInput"
              multiple
              @change="handleFileUpload"
              @click="resetUpload"
            />
            <select v-model="categoryID" ref="categoryInput">
              <option
                v-for="cat in categories"
                :key="cat.CategoryID"
                :value="cat.CategoryID"
              >
                {{ cat.CategoryName }}
              </option>
            </select>
            <base-button @click="submitForm">Upload</base-button>
            <base-button @click="resetUpload">Cancel</base-button>
          </form>

          <div v-show="feedbackOk === 1" class="feedbackOk">
            {{ feedbackMessage }}
          </div>
          <div v-show="feedbackOk === 2" class="feedbackError">
            {{ feedbackMessage }}
          </div>
          <div v-show="categoryID" class="preview-container">
            <div class="preview-pic" v-for="file in files" :key="file.name">
              <div class="imgCont">
                <img :src="file.preview" alt="Preview" />
              </div>
              <span>{{ file.name }}</span>
            </div>
          </div>
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
              <!-- <td>{{ picture.categoryID }}</td> -->
              <td>{{ picture.categoryName }}</td>
              <td class="actions-container">
                <button
                  class="btn-action"
                  @click="deleteImage(picture.pictureID)"
                >
                  Show
                </button>
                <button
                  class="btn-action"
                  @click="editImage(picture.pictureID)"
                >
                  Edit
                </button>
                <button
                  class="btn-action"
                  @click="deleteImage(picture.pictureID)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="showImageModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <img :src="selectedImage.original" alt="Original Image" />
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
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
      showImageModal: false,
      error: null,
      isLoading: false,
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
        const response = await fetch("http://localhost:3000/api/pictures/log", {
          method: "POST",
          body: formData,
        });
        if (response.status >= 200 && response.status < 300) {
          this.feedbackMessage = "Images uploaded successfully.";
          this.feedbackOk = 1;
          setTimeout(() => {
            this.feedbackMessage = "";
            this.feedbackOk = 3;
          }, 5000);
          // Clear the file input and reset categoryID after successful upload
          //reset inputs
          this.$refs.fileInput.value = "";
          this.$refs.categoryInput.value = "";
          this.files = [];
          this.categoryID = "";
          // Fetch updated pictures data from the server (you may need to implement this)
          this.$store.dispatch("pictures/getPictures"); // Assuming you have a Vuex action for this
        } else {
          this.error = "Failed to upload images, please try again.";
        }
      } catch (err) {
        this.error =
          err.message ||
          "Failed to upload images, please try again.";
        console.err("Error uploading pictures:", err);
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
  },
};
</script>

<style scoped>
.feedbackError {
  color: rgb(136, 1, 1);
  font-size: 0.8rem;
  margin: 0.5rem 0;
}
.feedbackOk {
  color: rgb(30, 98, 28);
  font-size: 0.8rem;
  margin: 0.5rem 0;
}
.buttonAddPic {
  margin-bottom: 1rem;
}
/* Container add images */
.addPics {
  width: 100%;
  height: auto;
  margin: 1.2rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1.2rem;
  max-width: 100%;
}

/* Form add images */
.addPics form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  align-items: center;
}
.addPics .preview-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: left;
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

.imgCont {
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
  justify-content: left;
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
  margin: 0.5rem;
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

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.9);
}

.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  max-height: 80%;
}

.close {
  color: #fff;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
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

.preview-container {
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  width: 150px;
}
.preview-pic {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  height: 100px;
  margin: 1rem;
}

.preview-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
