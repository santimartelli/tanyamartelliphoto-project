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
    <!-- Versión móvil-->
    <section v-if="mobile" class="welcome-message">
        <div class="text-container">
          <h2><span class="highlight">Welcome!</span></h2>
          <p>
            I'm Tatiana, a passionate photographer based in Spain. From family
            portraits to fashion shots, I specialize in capturing life's most
            precious moments. Take a look at my portfolio and let's create
            beautiful memories together. Book a session or reach out for more
            information.
          </p>
          <div class="desc-image">
            <img
              src="../assets/images/tanyadesc.jpg"
              alt="Tatiana with camera in Zumaia's beach"
            />
          </div>
        </div>
      <!-- <div class="text-links">
        <router-link to="/booking">Book a session</router-link>
        <router-link to="/contact">Contact me</router-link>
      </div> -->
    </section>
    <section v-else class="welcome-message">
      <div class="text-image-container">
        <div class="text-container">
          <h2><span class="highlight">Welcome!</span></h2>
          <p>
            I'm Tatiana, a passionate photographer based in Spain. From family
            portraits to fashion shots, I specialize in capturing life's most
            precious moments. Take a look at my portfolio and let's create
            beautiful memories together. Book a session or reach out for more
            information.
          </p>
        </div>
        <div class="desc-image">
          <img
            src="../assets/images/tanyadesc.jpg"
            alt="Tatiana with camera in Zumaia's beach"
          />
        </div>
      </div>
      <!-- <div class="text-links">
        <router-link to="/booking">Book a session</router-link>
        <router-link to="/contact">Contact me</router-link>
      </div> -->
    </section>
    <section class="categories"></section>
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
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters(["screenWidth", "mobile"]),
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
/* General (apply to more than one section) */

h2 {
  font-family: Thesignature;
  font-size: 3rem;
  font-weight: 400;
}
.highlight {
  background: linear-gradient(90deg, #ffff 0%, #fae8e8 50%, #ffff 100%);
  background-repeat: no-repeat;
  background-size: 100% 30%;
  background-position: 0 85%;
}

/* Hero section */
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

/* Welcome message section */
.welcome-message {
  width: 80%;
  padding: 8rem 0;
  margin: 0 auto;
}
.text-image-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Text */
.text-image-container h2 {
  text-align: left;
  margin-bottom: 1rem;
  letter-spacing: 0.2rem;
  font-size: 3rem;
}
.text-image-container p {
  text-align: left;
  line-height: 2.5rem;
  font-size: 0.8rem;
  font-weight: 400;
}

/* Image */
.desc-image {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4rem;
}

.desc-image img {
  width: 400px;
  height: auto;
}

/* Links */

/* .text-links {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4rem;
  padding-top: 5rem;
}
.text-links a {
  text-decoration: none;
  color: black;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  transition: all 0.2s ease;
  text-transform: uppercase;
  padding: 1rem;
  border: 1px solid #f79f9f;
  border-radius: 3px;
}

.text-links a:hover {
  border: 1px solid #000;
} */

/* Featured images section*/
.featured-images {
  width: 100%;
  padding: 8rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}

.title-wrapper {
  width: 80%;
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

@media (max-width: 1235px) {
  .hero {
    height: 650px;
  }

  .welcome-message {
    padding: 6rem 0;
  }
  .title-wrapper {
    width: 80%;
  }

  /* .text-links a {
    font-size: 0.6rem;
  } */
}

@media (max-width: 1150px) {
  .text-image-container p {
    font-size: 0.75rem;
  }

  .text-image-container h2 {
    font-size: 2.75rem;
  }

  .text-image-container img {
    width: 350px;
  }

  .desc-image {
    margin-left: 2rem;
  }
}

@media (max-width: 950px) {
  .text-image-container img {
    width: 300px;
  }
}

@media (max-width: 854px) {
  .hero {
    height: 500px;
  }

  .hero img {
    min-height: 500px;
    object-fit: cover;
  }

  .welcome-message,
  .featured-images {
    width: 100%;
    padding: 3rem 0;
  }

  .text-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .welcome-message h2{
    padding-bottom: 1rem;
    font-size: 6rem;
  }
  .welcome-message p {
    width: 90%;
    font-size: 0.8rem;
    padding-bottom: 2rem;
  }

  .desc-image {
    margin: 0;
  }
  .title-wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

  }
  .featured-images h2 {
    font-size: 6rem;
  }

  /* .text-links {
    justify-content: center;
  } */

  @media (max-width: 500px) {
    .hero {
      height: 500px;
    }

    .hero img{
      min-height: 500px;
      object-fit: cover;
    }

    .welcome-message{
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .featured-images {
      padding: 2rem 0;
    }

    .title-wrapper {
      width: 100%;
    }

    .welcome-message h2,
    .featured-images h2 {
      font-size: 4rem;
    }

    .desc-image{
      width: 100%;
      margin: 0;
    }
    .desc-image img{
      width: 70%;
    }
    .welcome-message p {
      font-size: 0.8rem;
    }

    .text-links a {
      border: 0.6px solid #000;
    }
  }
}
</style>
