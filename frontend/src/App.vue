<template>
  <div id="app">
    <authenticated-nav v-if="isLoggedIn && isAdminPanel"></authenticated-nav>
    <the-navigation v-else></the-navigation>
    <main id="page-wrap">
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
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

export default {
  components: {
    TheNavigation,
    TheSocialNetworks,
    FooterCredits,
    AuthenticatedNav,
  },
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
  created() {
    this.getCategories();
    this.getPictures();
    this.getMessages();
    this.getBookings();
    this.$store.dispatch("tryLogin");
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace({ name: "login" });
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateScreenWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScreenWidth);
  },
  methods: {
    updateScreenWidth() {
      this.$store.dispatch("onResize");
    },
    ...mapActions("categories", ["getCategories"]),
    ...mapActions("pictures", ["getPictures"]),
    ...mapActions("messages", ["getMessages"]),
    ...mapActions("bookings", ["getBookings"]),
  },
};
</script>

<style>
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

/*generate the media queries for the cpntainer to occupy 100% width*/
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
