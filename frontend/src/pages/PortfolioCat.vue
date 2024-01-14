<template>
  <div class="container">
    <h2 v-if="picturesForCategory.length > 0">{{ picturesForCategory[0].categoryName }}</h2>
    <div class="container2">
    <h3 v-if="picturesForCategory.length === 0">There are no pictures of this category</h3>
    <div v-for="picture in picturesForCategory" :key="picture.pictureId">
      <img
        :src="picture.picturePath"
        :alt="'Foto com ID: ' + picture.pictureId"
      />
    </div>
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("pictures", ["pictures"]),
    picturesForCategory() {
      return this.pictures.filter(
        (picture) => picture.categoryId == this.$route.params.id
      );
    },
  },
};
</script>

<style scoped>
.container {
  width: 95%;
  margin: 0 auto; /* Center the container */
  padding: 20px; /* Add some padding for spacing */
}

.container2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

h2 {
  text-align: center;
  padding-bottom: 1rem;
}

img {
  width: 500px;
  height: 500px;
  object-fit: cover;
  padding: 10px;
}

/* media queries */
@media (max-width: 855px) {
  .container{
    width: 98%;
  }
  img{
    width: 100%;
    height: auto;
    float: none;
    object-fit: cover;
    padding: .5rem 0;
  }
}
</style>
