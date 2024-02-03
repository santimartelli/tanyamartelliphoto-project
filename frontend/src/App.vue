<!-- Componente principal que contiene todos los componentes del sitio -->

<template>
  <div id="app">
    <authenticated-nav v-if="isLoggedIn && isAdminPanel"></authenticated-nav>
    <the-navigation v-else></the-navigation>
    <main id="page-wrap">
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <!-- Aquí se renderiza el componente que corresponde a la ruta actual -->
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </main>
    <div id="footer">
      <the-social-networks v-if="!isAdminPanel"></the-social-networks>
      <footer-credits></footer-credits>
    </div>
  </div>
</template>

<script>
import TheNavigation from "./components/layout/TheNavigation.vue";
import TheSocialNetworks from "./components/layout/TheSocialNetworks.vue";
import FooterCredits from "./components/layout/FooterCredits.vue";
import { mapActions } from "vuex";
import AuthenticatedNav from "./components/layout/AuthenticatedNav.vue";

/**
 * Componente principal que contiene todos los componentes del sitio.
 * @vue-computed isLoggedIn - Devuelve si el usuario está autenticado.
 * @vue-computed isAdminPanel - Devuelve si se muestra la navegación para usuarios autenticados.
 * @vue-computed didAutoLogout - Devuelve si el usuario se deslogueó automáticamente.
 * @vue-methods getCategories - Llama a la acción getCategories del módulo categories.
 * @vue-methods getPictures - Llama a la acción getPictures del módulo pictures.
 * @vue-methods getMessages - Llama a la acción getMessages del módulo messages.
 * @vue-methods getBookings - Llama a la acción getBookings del módulo bookings.
 */
export default {
  components: {
    TheNavigation,
    TheSocialNetworks,
    FooterCredits,
    AuthenticatedNav,
  },

  /**
   * Propiedades calculadas del componente.
   * Devuelve si el usuario está autenticado.
   * Devuelve si se muestra la navegación para usuarios autenticados.
   * Devuelve si el usuario se deslogueó automáticamente.
   */
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    isAdminPanel() {
      return this.$route.name === "admin";
    },
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  /**
   * Realiza una serie de acciones cuando se crea el componente.
   * Llama a los métodos getCategories, getPictures, getMessages y getBookings de este componente.
   * Despacha la acción tryLogin del store.
   */
  created() {
    /**
     * Llama al método getCategories de este componente.
     */
    this.getCategories();

    /**
     * Llama al método getPictures de este componente.
     */
    this.getPictures();

    /**
     * Llama al método getMessages de este componente.
     */
    this.getMessages();

    /**
     * Llama al método getBookings de este componente.
     */
    this.getBookings();

    /**
     * Despacha la acción tryLogin del store.
     */
    this.$store.dispatch("tryLogin");
  },
  /**
   * Propiedades observadas del componente.
   * Si el usuario se desloguea automáticamente, redirige a la página de login.
   * @vue-watch didAutoLogout - Redirige a la página de login si el usuario se desloguea automáticamente.
   */
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace({ name: "login" });
      }
    },
  },
  /**
   * Cuando se monta el componente se añade un listener al evento resize de la ventana
   * para actualizar el ancho de la pantalla en el store.
   */
  mounted() {
    window.addEventListener("resize", this.updateScreenWidth);
  },
  /**
   * Cuando se desmonta el componente se elimina el listener del evento resize de la ventana.
   */
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScreenWidth);
  },
  methods: {
    /**
     * Actualiza el ancho de la pantalla en el store.
     */
    updateScreenWidth() {
      this.$store.dispatch("onResize");
    },

    /**
     * Llama a la acción getCategories del módulo categories, que devuelve las
     * categorías de la base de datos y las almacena en el estado de la aplicación.
     */
    ...mapActions("categories", ["getCategories"]),

    /**
     * Llama a la acción getPictures del módulo pictures, que devuelve las
     * imágenes de la base de datos y las almacena en el estado de la aplicación.
     */
    ...mapActions("pictures", ["getPictures"]),

    /**
     * Llama a la acción getMessages del módulo messages, que devuelve los
     * mensajes de la base de datos y los almacena en el estado de la aplicación.
     */
    ...mapActions("messages", ["getMessages"]),

    /**
     * Llama a la acción getBookings del módulo bookings, que devuelve las
     * reservas de la base de datos y las almacena en el estado de la aplicación.
     */
    ...mapActions("bookings", ["getBookings"]),
  },
};
</script>

<style>
/* Estilos para el componente App.vue que serían estilos generales */

@font-face {
  font-family: "Typewriter-light";
  src: local("Typewriter-light"),
    url(./assets/fonts/typewriter-serial-light-regular.ttf) format("truetype");
}

@font-face {
  font-family: "Typewriter-extralight";
  src: local("Typewriter-extralight"),
    url(./assets/fonts/typewriter-serial-extralight-regular.ttf)
      format("truetype");
}

@font-face {
  font-family: "Thesignature";
  src: local("Thesignature"),
    url(./assets/fonts/Thesignature.ttf) format("truetype");
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#page-wrap {
  flex: 1 0 auto;
}

#footer {
  flex-shrink: 0;
}

h2 {
  font-family: Typewriter-extralight, Helvetica, Arial, sans-serif;
  text-align: center;
  letter-spacing: 0.1rem;
}

p {
  font-size: 0.75rem;
  line-height: 2rem;
  letter-spacing: 0.1rem;
  text-align: justify;
}

a {
  text-decoration: none;
  color: #000;
}

.container {
  width: 70%;
  margin: 0 auto;
  box-sizing: border-box; /* Include padding in the container's width */
  padding: 0 1rem; /* Add padding to the container */
}

.btn a {
  color: #fff;
  text-decoration: none;
}

.btn:hover a {
  color: #f7bebe;
}

:root {
  --swiper-theme-color: #fff;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.route-enter-active {
  transition: all 1s ease;
  transform: translateY(1rem);
}

.route-leave-active {
  transition: all 0.3s ease;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(0);
}

/* MEDIA QUERIES */

@media (max-width: 1024px) {
  .container {
    width: 80%;
  }
}

@media (max-width: 768px) {
  .container {
    width: 90%;
  }
}

@media (max-width: 425px) {
  .container {
    width: 100%;
    padding: 1rem;
  }
}
</style>
