<template>
  <div class="container-big">
    <div class="hero">
      <transition-group name="fade" tag="div">
        <div
          v-for="(picture, index) in pictures"
          :key="picture.PictureID"
          class="image-container"
          v-show="index === currentImageIndex"
        >
          <img
            :src="picture.PicturePath"
            :alt="'Picture ' + picture.PictureID"
          />
        </div>
      </transition-group>
    </div>
    <div class="container">
      <p>
        Welcome! I'm Tatiana, a passionate photographer based in Spain. From
        family portraits to fashion shots, I specialize in capturing life's most
        precious moments. Take a look at my portfolio and let's create beautiful
        memories together.
      </p>
      <p>
        Book a session or reach out for more information. Let's capture the
        magic together.
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pictures: [],
      currentImageIndex: 0,
    };
  },
  methods: {
    changeImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.pictures.length;
    },
  },
  created() {
    setInterval(this.changeImage, 5000); // Change image every 3 seconds
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

.container-big {
  width: 100%;
}
.hero {
  position: relative;
  height: 750px;
  overflow: hidden; /* Adjust this value to fit your images */
}

.image-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 1s ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: all 1s ease-in-out;
}

.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .hero {
    height: 300px;
  }
}
</style>
