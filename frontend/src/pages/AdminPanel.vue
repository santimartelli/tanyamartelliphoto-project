<template>
  <div>
    <ok-dialog :show="!!okMessage" @close="closeDialog">
      <p><strong>Name:</strong> {{ selectedMessage.messageName }}</p>
      <p><strong>Email:</strong> {{ selectedMessage.messageEmail }}</p>
      <p><strong>Message: </strong>{{ okMessage }}</p>
    </ok-dialog>
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
      <input
        type="radio"
        name="tabs"
        id="tabone"
        v-model="currentTab"
        @click="toggleTab('tabone')"
      />
      <label
        :style="{ background: currentTab === 'tabone' ? '#fff' : '' }"
        for="tabone"
        >Pictures</label
      >
      <div class="tab" v-show="currentTab === 'tabone'">
        <!-- Inside the tab -->
        <!-- Botón para añadir imagenes -->
        <base-button class="buttonAdd" @click="addImages = !addImages"
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
                  <select v-model="categoryId" ref="categoryInput">
                    <option value="" disabled selected hidden>
                      Choose a category
                    </option>
                    <option
                      v-for="cat in categories"
                      :key="cat.categoryId"
                      :value="cat.categoryId"
                    >
                      {{ cat.categoryName }}
                    </option>
                  </select>
                </div>
              </div>
              <div v-show="categoryId" class="preview-container">
                <div class="preview-pic" v-for="file in files" :key="file.name">
                  <div class="img-container">
                    <img :src="file.preview" alt="Preview" />
                  </div>
                  <span>{{ file.name }}</span>
                </div>
              </div>
              <div
                v-show="categoryId && files.length > 0"
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
              <tr v-for="picture in pictures" :key="picture.pictureId">
                <td>{{ picture.pictureId }}</td>
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
                      @click="deletePicture(picture.pictureId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deletePicture(picture.pictureId)"
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
      <!-- Tab 2 Categories -->
      <input
        type="radio"
        name="tabs"
        id="tabtwo"
        v-model="currentTab"
        @click="toggleTab('tabtwo')"
      />
      <label
        :style="{ background: currentTab === 'tabtwo' ? '#fff' : '' }"
        for="tabtwo"
        >Categories</label
      >
      <div class="tab" v-show="currentTab === 'tabtwo'">
        <!-- Inside the tab -->
        <!-- Botón para añadir categorias -->
        <base-button class="buttonAdd" @click="addCategory = !addCategory"
          >Add Category</base-button
        >
        <div v-show="addCategory" class="addItem">
          <div v-if="isLoading">
            <p>Adding category...</p>
            <base-spinner />
          </div>
          <div v-else>
            <form @submit.prevent="addNewCategory">
              <div class="inputs-container-categories">
                <input
                  type="text"
                  name="cateogry"
                  id="category-input"
                  ref="categoryInput"
                  v-model="newCategoryName"
                  class="add-category-input"
                  placeholder="Introduce el nombre de la nueva categoría"
                />
                <div class="buttons-container">
                  <base-button @click="addNewCategory">Add</base-button>
                  <base-button @click="resetCategoryForm">Cancel</base-button>
                </div>
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
              <tr v-for="category in categories" :key="category.categoryId">
                <td>{{ category.categoryId }}</td>
                <td>{{ category.categoryName }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/pen.png"
                      alt="Editar categoria"
                      title="Editar categoria"
                      @click="editCategory(category.categoryId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container edit"
                    @click="editCategory(category.categoryId)"
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
                      @click="deleteCategory(category.categoryId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deleteCategory(category.categoryId)"
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
      <!-- Tab 3 Messages -->
      <input
        type="radio"
        name="tabs"
        id="tabthree"
        v-model="currentTab"
        @click="toggleTab('tabthree')"
      />
      <label
        :style="{ background: currentTab === 'tabthree' ? '#fff' : '' }"
        for="tabthree"
        >Messages</label
      >
      <div class="tab" v-show="currentTab === 'tabthree'">
        <div>
          <table class="messages">
            <thead>
              <tr>
                <th class="th-1">Id</th>
                <th class="th-2">Name</th>
                <th class="th-3">Email</th>
                <th class="th-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="message in messages" :key="message.messageId">
                <td>{{ message.messageId }}</td>
                <td>{{ message.messageName }}</td>
                <td>{{ message.messageEmail }}</td>
                <td class="actions-container">
                  <div v-if="iconsActionsMB">
                    <img
                      class="icon"
                      src="../assets/Icons/view.png"
                      alt="Open message"
                      title="Open message"
                      @click="viewMessage(message)"
                    />
                  </div>
                  <div
                    v-if="!iconsActionsMB"
                    class="icon-container view"
                    @click="viewMessage(message)"
                  >
                    <img src="../assets/Icons/view.png" alt="view message" />
                    <div>OPEN MESSAGE</div>
                  </div>
                  <div v-if="iconsActionsMB">
                    <img
                      class="icon"
                      src="../assets/Icons/responder.png"
                      alt="Answer message"
                      title="Answer message"
                      @click="answerMessage(message.messageEmail)"
                    />
                  </div>
                  <div
                    v-if="!iconsActionsMB"
                    class="icon-container view"
                    @click="answerMessage(message.messageEmail)"
                  >
                    <img
                      src="../assets/Icons/responder.png"
                      alt="Answer message"
                    />
                    <div>REPLY MESSAGE</div>
                  </div>
                  <div v-if="iconsActionsMB">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Delete message"
                      title="Delete message"
                      @click="deleteMessage(message.messageId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActionsMB"
                    class="icon-container delete"
                    @click="deleteMessage(message.messageId)"
                  >
                    <img
                      src="../assets/Icons/delete.png"
                      alt="Delete message"
                    />
                    <div>DELETE MESSAGE</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <input
        type="radio"
        name="tabs"
        id="tabfour"
        v-model="currentTab"
        @click="toggleTab('tabfour')"
      />
      <label
        :style="{ background: currentTab === 'tabfour' ? '#fff' : '' }"
        for="tabfour"
        >Booking Requests</label
      >
      <div class="tab" v-show="currentTab === 'tabfour'">
        <h1>Booking Requests</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OkDialog from "../components/ui/OkDialog.vue";

export default {
  components: {
    OkDialog,
  },
  data() {
    return {
      currentTab: "tabone",
      files: [],
      addImages: false,
      addCategory: false,
      categoryId: "",
      feedbackMessage: "",
      feedbackOk: 3,
      error: null,
      isLoading: false,
      selectedImage: null,
      showImageModal: false,
      iconsActions: false,
      iconsActionsMB: false,
      newCategoryName: "",
      messageEmail: null,
      selectedMessage: null,
      okMessage: null,
    };
  },
  computed: {
    categories() {
      return this.$store.getters["categories/categories"];
    },
    pictures() {
      return this.$store.getters["pictures/pictures"];
    },
    messages() {
      return this.$store.getters["messages/messages"];
    },
    bookings() {
      return this.$store.getters["bookings/bookings"];
    },
  },
  methods: {
    //GENERAL METHODS
    toggleTab(tab) {
      console.log("Clicked tab:", tab);
      // Toggle the value of currentTab
      this.currentTab = this.currentTab === tab ? "" : tab;
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
    showIconsActionsMB() {
      // Get the window width
      const windowWidth = window.innerWidth;
      // If width is less than or equal to 821px, set iconsActions to true
      if (windowWidth <= 1067) {
        this.iconsActionsMB = true;
      } else {
        this.iconsActionsMB = false;
      }
    },
    //PICTURES METHODS
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
      formData.append("categoryId", this.categoryId);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/pictures",
          formData
        );

        if (response.status >= 200 && response.status < 300) {
          this.feedbackMessage = "Pictures uploaded successfully";
          this.feedbackOk = 1;
          // Clear the file input and reset categoryId after successful upload
          this.files = [];
          this.categoryId = "";
          // Dispatch an action to get the pictures again
          this.$store.dispatch("pictures/getPictures");
        } else {
          this.feedbackOk = 2;
          this.feedbackMessage = "Failed to upload pictures, please try again";
        }
      } catch (err) {
        this.error =
          err.message || "Failed to upload images, please try again.";
        this.feedbackOk = 2;
        this.feedbackMessage = "Failed to upload images, please try again.";
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },
    handleError() {
      this.error = null;
      this.$refs.fileInput.value = "";
      this.$refs.categoryInput.value = "";
      this.files = [];
      this.categoryId = "";
    },
    resetUpload() {
      this.feedbackMessage = "";
      this.feedbackOk = 3;
      this.$refs.fileInput.value = "";
      this.$refs.categoryInput.value = "";
      this.files = [];
      this.categoryId = "";
    },
    async deletePicture(pictureId) {
      try {
        const picture = this.pictures.find((p) => p.pictureId === pictureId);
        const picturePath = picture.picturePath;

        const response = await this.$store.dispatch(
          "pictures/deletePicture",
          pictureId
        );
        if (response && response.status >= 200 && response.status < 300) {
          const fileResponse = await fetch(
            `http://localhost:3000/api/pictures/deleteFile?filepath=${picturePath}`,
            {
              method: "DELETE",
            }
          );

          if (fileResponse.status === 200) {
            this.$store.commit("pictures/deletePicture", pictureId);
            this.feedbackMessage = "Picture deleted successfully";
            this.feedbackOk = 1;
          } else {
            this.feedbackOk = 2;
            this.feedbackMessage = "Failed to delete picture, please try again";
          }
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
   //CATEGORIES METHODS
    async editCategory(categoryId) {
      const categoryName = prompt("Enter the new category name");

      if (categoryName) {
        try {
          await this.$store.dispatch("categories/updateCategory", {
            categoryId,
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
    addNewCategory() {
      this.isLoading = true;
      const newCategoryName = this.newCategoryName;
      if (newCategoryName) {
        try {
          this.$store.dispatch("categories/addNewCategory", newCategoryName);
          this.feedbackMessage = "Category added succesfully";
          this.feedbackOk = 1;
          // Clear the ctaegoryInput input after successful upload
          this.newCategoryName = "";
        } catch (error) {
          this.feedbackMessage = "Error adding category, please try again";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      } else {
        this.feedbackMessage = "Please enter a category name";
        this.feedbackOk = 2;
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
      this.isLoading = false;
    },
    resetCategoryForm() {
      this.newCategoryName = "";
      this.addCategory = false;
    },
    deleteCategory(categoryId) {
      // Check if there are pictures with this category
      const picturesWithCategory = this.pictures.filter(
        (picture) => picture.categoryId == categoryId
      );
      if (picturesWithCategory.length > 0) {
        this.feedbackMessage =
          "There are pictures with this category, please delete them first";
        this.feedbackOk = 2;
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      } else {
        try {
          this.$store.dispatch("categories/deleteCategory", categoryId);
          this.feedbackMessage = "Category deleted succesfully";
          this.feedbackOk = 1;
        } catch (error) {
          this.feedbackMessage = "Error deleting category, please try again";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },
    //MESSAGES METHODS
    viewMessage(message) {
      console.log(message);
      this.selectedMessage = message;
      this.okMessage = message.messageContent;
    },
    closeDialog() {
      this.okMessage = null;
      this.selectedMessage = null;
    },
    answerMessage(messageEmail) {
      // A implementar en el futuro
      console.log(`Sending email to: ${messageEmail}`);
    },
    deleteMessage(messageId) {
        try {
          this.$store.dispatch("messages/deleteMessage", messageId);
          this.feedbackMessage = "Message deleted succesfully";
          this.feedbackOk = 1;
        } catch (error) {
          this.feedbackMessage = "Error deleting the message, please try again";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
  },
  created() {
    this.showIconsActions();
    this.showIconsActionsMB();
  },
  watch: {
    // Watch for changes in the window width
    "$store.getters.screenWidth"() {
      this.showIconsActions();
      this.showIconsActionsMB();
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
  z-index: 100;
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

.buttonAdd {
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

.inputs-container-categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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

.add-category-input {
  width: 40%;
  border-radius: 4px;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  letter-spacing: 0.02rem;
  padding: 8px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  margin: 0.5rem;
}

.add-category-input:focus {
  outline: none;
  border: 1px solid #f79f9f;
}

#category-input {
  text-align: center;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/*space between buttons*/
.buttons-container div {
  margin: 0.5rem;
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
  flex-grow: 1;
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
  padding: 1rem;
  background: #fff;
}
.tabs input[type="radio"] {
  display: none;
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

/*Table messages*/
.messages .th-1 {
  width: 10%;
}

.messages .th-2,
.messages .th-3 {
  width: 20%;
}

/**
 * Responsive
 */
@media (max-width: 1067px) {
  .messages .actions-container {
    justify-content: space-evenly;
  }
}
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

  .add-category-input {
    width: 90%;
  }

  .actions-container {
    justify-content: space-evenly;
  }
}
</style>
