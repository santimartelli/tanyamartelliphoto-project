<template>
  <div>
    <form @submit.prevent="submitForm">
      <input type="file" multiple @change="handleFileUpload" />
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
    <div
      v-show="categoryID"
      v-for="file in files"
      :key="file.name"
      class="preview-container"
    >
      <div class="preview-pic">
        <p>{{ file.name }}</p>
        <img :src="file.preview" alt="Preview" />
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
    };
  },
  computed: {
    categories() {
      return this.$store.getters["categories/categories"];
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
