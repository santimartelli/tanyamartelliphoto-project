<template>
  <div class="tabs">
    <input type="radio" name="tabs" id="tabone" checked="checked" />
    <label for="tabone">Pictures</label>
    <div class="tab">
      <!-- Inside the tab -->
      <!-- Botón para añadir imagenes -->
      <base-button class="buttonAddPic" @click="addImages = !addImages">Add Images</base-button>
      <div v-show="addImages" class="addPics">
        <form @submit.prevent="submitForm">
          <input type="file" multiple @change="handleFileUpload" @click="resteUpload"/>
          <select v-model="categoryID">
            <option
              v-for="cat in categories"
              :key="cat.CategoryID"
              :value="cat.CategoryID"
            >
              {{ cat.CategoryName }}
            </option>
          </select>
          <button type="submit">Upload</button>
        </form>
        <div v-show="categoryID" class="preview-container">
          <div class="preview-pic" v-for="file in files" :key="file.name">
            <div class="imgCont"><img :src="file.preview" alt="Preview" /></div>
            <span>{{ file.name }}</span>
          </div>
        </div>
      </div>

      <!-- Table with pictures -->
      <div>
        <table>
          <thead>
            <tr>
              <th @click="sort('id')">Image Id</th>
              <th>Thumbnail</th>
              <th @click="sort('category_id')">Category Id</th>
              <th @click="sort('category_name')">Category Name</th>
              <th>Actions</th>
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
              <td>{{ picture.categoryID }}</td>
              <td>{{ picture.categoryName }}</td>
              <td>
                <button @click="editImage(picture.pictureID)">Edit</button>
                <button @click="deleteImage(picture.pictureID)">Delete</button>
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
      const formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        formData.append("images", this.files[i]);
      }
      formData.append("categoryID", this.categoryID);

      try {
        const response = await fetch("http://localhost:3000/api/pictures/", {
          method: "POST",
          body: formData,
        });
        console.log(await response.text());
      } catch (error) {
        console.error("Error uploading pictures:", error);
      }
    },
  },
};
</script>

<style scoped>

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
}

th,
td {
  text-align: left;
  padding: 8px;
}

th {
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
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
