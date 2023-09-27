<template>
  <div>
    <h2 v-if="picturesForCategory.length > 0">{{ picturesForCategory[0].categoryName }}</h2>
    <h3 v-else>There are no pictures of this category</h3>
    <div v-for="picture in picturesForCategory" :key="picture.pictureId">
      <img
        :src="picture.picturePath"
        :alt="'Foto com ID: ' + picture.pictureId"
      />
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
img {
  width: 500px;
  height: auto;
}
</style>
