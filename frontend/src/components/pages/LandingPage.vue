<template>
  <div class="container-hero">
    <section class="hero">
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
    </section>
    <section class="welcome-message">
      <div class="text">
        <h2><span class="highlight">Welcome!</span></h2>
        <p>
          I'm Tatiana, a passionate photographer based in Spain. From family
          portraits to fashion shots, I specialize in capturing life's most
          precious moments. Take a look at my portfolio and let's create
          beautiful memories together. Book a session or reach out for more
          information.
        </p>
        <div class="text-links">
          <router-link to="/portfolio">View Portfolio</router-link>
          <router-link to="/booking">Book a Session</router-link>
          <router-link to="/contact">Contact Me</router-link>
        </div>
      </div>
    </section>
    <section class="featured-images">
      <div class="title-wrapper">
        <h2 class="highlight">Featured Images</h2>
      </div>
      <div class="images">
        <div v-for="picture in pictures" :key="picture.PictureID" class="image">
          <img
            :src="picture.PicturePath"
            :alt="'Picture ' + picture.PictureID"
          />
        </div>
      </div>
    </section>
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
    setInterval(this.changeImage, 9000); // Change image every 3 seconds
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
.container-hero {
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

.image-container img {
  width: 100%;
}

.welcome-message {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  width: 60%;
  text-align: center;
}

.text p {
  text-align: justify;
  line-height: 2.8rem;
  font-size: 1rem;
  font-weight: 400;
}

.text h2 {
  text-align: left;
  margin-bottom: 2rem;
  letter-spacing: 0.2rem;
  font-weight: 400;
}

.text-links {
  display: flex;
  justify-content: right;
  gap: 2rem;
  margin-top: 2rem;
}
.text-links a {
  text-decoration: none;
  color: black;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.1rem;
  transition: all 0.5s ease;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  background: linear-gradient(120deg, #ecebeb 0%, #fcfcfc 100%);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 0 100%;
}

.text-links a:hover {
  background: linear-gradient(120deg, #fae8e8 0%, #f7f7f7 100%);
}

.highlight {
  background: linear-gradient(120deg, #fae8e8 0%, #faf5f5 100%);
  background-repeat: no-repeat;
  background-size: 100% 40%;
  background-position: 0 100%;
}

/* code for present the images side by side with a gap of 1 rem */
.featured-images {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}

.title-wrapper {
  width: 60%;
  display: flex;
  align-items: center;
}
.featured-images h2 {
  text-align: left;
  margin-bottom: 2rem;
  letter-spacing: 0.2rem;
  font-weight: 400;
}

.featured-images h2 {
  margin-bottom: 2rem;
}

.images {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.image {
  width: 300px;
  height: 300px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 2s ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: all 2s ease-in-out;
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
