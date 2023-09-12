<template>
  <div class="panel-container">
    <div class="left-menu">
      <ul>
        <li>
          <a href="#">Manage Images</a>
        </li>
        <li>
          <a href="#">Manage Categories</a>
        </li>
        <li>
          <a href="#">Manage Requests</a>
        </li>
      </ul>
    </div>
    <div class="content">
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
.panel-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.left-menu {
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100vh;
  background-color: #000;
  color: #fff;
}
.left-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.left-menu ul li {
  padding: 1rem;
}
.left-menu ul li a {
  color: #fff;
  text-decoration: none;
}
.left-menu ul li a:hover {
  color: #ccc;
}
.content {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 100%;
  padding: 1rem;
}
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
}
input[type="file"] {
  margin-bottom: 1rem;
}
select {
  margin-bottom: 1rem;
}
button {
  margin-bottom: 1rem;
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
