<!-- Componente de la página de inicio -->

<template>
  <div class="container-landing-page">
    <section class="hero">
      <transition-group name="fade" tag="div">
        <div
          v-for="(picture, index) in pictures"
          :key="picture.picrureId"
          class="image-container"
          v-show="index === currentImageIndex"
        >
          <img
            :src="picture.picturePath"
            :alt="'Picture category: ' + picture.categoryName"
          />
        </div>
      </transition-group>
    </section>

    <!-- Versión móvil-->

    <section v-if="mobile" class="welcome-message">
      <div class="text-container">
        <h2><span class="highlight">Welcome!</span></h2>
        <p>
          I am Tatiana, a passionate photographer based in Costa Brava, Spain. I specialize
          in capturing life's most precious moments, from female and family
          portraits to fashion and events shots. Take a look at my portfolio and
          let's create beautiful memories together! Book a session or reach out
          for more information.
        </p>
        <div class="desc-image">
          <img
            src="../assets/images/tanyadesc.jpg"
            alt="Tatiana with camera in Zumaia's beach"
          />
        </div>
      </div>
    </section>
    <section v-else class="welcome-message">
      <div class="text-image-container">
        <div class="text-container">
          <h2><span class="highlight">Welcome!</span></h2>
          <p>
            I am Tatiana, a passionate photographer based in Costa Brava, Spain. I specialize
            in capturing life's most precious moments, from female and family
            portraits to fashion and events shots. Take a look at my portfolio
            and let's create beautiful memories together! Book a session or
            reach out for more information.
          </p>
        </div>
        <div class="desc-image">
          <img
            src="../assets/images/tanyadesc.jpg"
            alt="Tatiana with camera in Zumaia's beach"
          />
        </div>
      </div>
    </section>
    <section v-show="mobile" class="lema-mob">
      <p>
        "Loving photography <br />
        since 1986"
      </p>
    </section>
    <section v-show="!mobile" class="lema">
      <p>"Loving photography since 1986"</p>
    </section>
    <section class="categories">

      <!--Versión escritorio-->

      <swiper
        :navigation="true"
        :keyboard="{
          enabled: true,
        }"
        :clickable="true"
        :slidesPerView="1"
        :spaceBetween="0"
        :breakpoints="{
          '640': {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          '768': {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          '1024': {
            slidesPerView: 3,
            spaceBetween: 2,
          },
        }"
        :modules="modules"
        class="mySwiper"
      >
        <SwiperSlide v-for="picture in uniquePictures" :key="picture.picrureId">
          <div class="container-cat swiper-mobile">
            <img :src="picture.picturePath" :alt="picture.picrureId" />
            <div class="cat-link">
              <p class="centered">{{ picture.categoryName }}</p>
              <div class="space"></div>
              <router-link
                :to="'/portfolio/' + picture.categoryId"
                class="btn-link"
                >View portfolio</router-link
              >
            </div>
          </div>
        </SwiperSlide>
      </swiper>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";

// Importacion de estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Importacion de componentes de Swiper
import { Keyboard, Pagination, Navigation } from "swiper/modules";

export default {
  /**
   * Componentes que usa el componente
   * @component Swiper - Componente que muestra un slider de imágenes.
   * @component SwiperSlide - Componente que muestra una imagen en el slider.
   */
  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      modules: [Keyboard, Pagination, Navigation],
      currentImageIndex: 0,
    };
  },

  methods: {
    /**
     * Cambia la imagen principal que que se muestra.
     */
    changeImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.pictures.length;
    },
  },

  computed: {
    /**
     * Usa la función mapGetters de Vuex para obtener el ancho de la pantalla y si es móvil o no.
     * @returns {number} Ancho de la pantalla.
     * @returns {boolean} Indica si la pantalla es móvil o no.
     */
    ...mapGetters(["screenWidth", "mobile"]),

    /**
     * Obtiene las imagenes desde el estado de la aplicación.
     * @returns {Array} Array de objetos con las imágenes.
     */
    pictures() {
      return this.$store.getters["pictures/pictures"];
    },

    /**
     * Hace que no se repitan las categorías de las imágenes.
     */
    uniquePictures() {
      return this.pictures.filter(
        (picture, index, self) =>
          self.findIndex((p) => p.categoryName === picture.categoryName) ===
          index
      );
    },
  },

  /**
   * Llama ala función changeImage para cambiar la imagen principal cada 9 segundos.
   */
  created() {
    setInterval(this.changeImage, 9000);
  },
};
</script>

<style scoped>

/* Estilos para el componente LandingPage.vue */

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

/* Sección de la imagen principal */

.container-landing-page {
  width: 100%;
}

.hero {
  position: relative;
  height: 750px;
  overflow: hidden;
}

.image-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.image-container img {
  width: 100%;
  min-height: 750px;
  object-fit: cover;
}

/* Sección mensaje de bienvenida */

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

/* Texto */

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

/* Imágen */

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
  transition: all 0.2s ease-in-out;
}

/* Sección lema */

.lema {
  width: 100%;
  background-color: #f7f7f7;
  padding: 8rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lema-mob {
  width: 100%;
  background-color: #f7f7f7;
  padding: 6rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lema p,
.lema-mob p {
  font-family: Typewriter-extralight;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0.2rem;
  line-height: 3rem;
  text-align: center;
  transition: all 0.2s ease-in-out;
}

/* Sección categorías */

.categories {
  width: 100%;
  padding: 0;
  background-color: #fff;
  padding: 0 0 8rem 0;
}

.swiper {
  height: 400px;
}

.swiper-mobile {
  width: 100%;
  max-height: auto;
}

.swiper-slide img {
  width: 100%;
  height: auto;
  min-height: 400px;
  object-fit: cover;
}

.container-cat {
  position: relative;
  width: 100%;
  height: 100%;
}

.cat-link {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.centered {
  font-family: thesignature;
  width: 100%;
  color: #fff;
  font-size: 6rem;
  cursor: default;
  font-weight: 200;
}

.space {
  height: 2rem;
}

.btn-link {
  font-family: Typewriter-light;
  font-weight: 500;
  letter-spacing: 0.05rem;
  font-size: 1rem;
  color: #fff;
  background-color: #f7bebe;
  border-radius: 3px;
  padding: 1rem;
  width: fit-content;
  text-align: center;
  opacity: 0.9;
  transition: all 0.2s ease-in-out;
}

.btn-link:hover {
  color: #fff;
  background-color: transparent;
  border: 1px solid #fff;
}

/* Animaciones */

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

/* MEDIA QUERIES */

@media (max-width: 1235px) {
  .welcome-message {
    padding: 8rem 0;
  }
  .title-wrapper {
    width: 80%;
  }
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
  .welcome-message {
    width: 100%;
    padding: 8rem 0;
  }

  .text-container {
    margin-top: -3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .welcome-message h2 {
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

  .title-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .featured-images h2 {
    font-size: 6rem;
  }

  @media (max-width: 500px) {
    .welcome-message {
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

    .desc-image {
      width: 100%;
      margin: 0;
    }

    .desc-image img {
      width: 70%;
    }

    .welcome-message p {
      font-size: 0.8rem;
    }
  }
}
</style>
