<template>
  <div class="container">
    <div v-for="picture in pictures" :key="picture.PictureID" class="picture-container">
      <img :src="picture.PicturePath" :alt="'Picture ' + picture.PictureID" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pictures: [],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/pictures")
      .then((response) => {
        console.log(response.data);
        this.pictures = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.picture-container {
  max-width: 300px;
  max-height: 200px;
  overflow: hidden;
}

img {
  width: 100%;
}
</style>
