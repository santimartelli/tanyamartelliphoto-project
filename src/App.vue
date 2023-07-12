<template>
  <the-navigation></the-navigation>
  <main id="page-wrap">
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
    <the-social-networks></the-social-networks>
  </main>
</template>

<script>
import TheNavigation from "./components/layout/TheNavigation.vue";
import TheSocialNetworks from "./components/layout/TheSocialNetworks.vue";


export default {
  components: {
    TheNavigation,
    TheSocialNetworks,
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

* {
  box-sizing: border-box;
}

html {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
}

h2 {
  font-family: Typewriter-extralight, Helvetica, Arial, sans-serif;
  text-align: center;
  letter-spacing: 0.1rem;
}

p {
  font-size: 0.75rem;
  line-height: 1.3rem;
  letter-spacing: 0.1rem;
  text-align: justify;
}

.container {
  width: 70%;
  margin: 0 auto;
  box-sizing: border-box; /* Include padding in the container's width */
  padding: 0 1rem; /* Add padding to the container */
}

.route-enter-from {
  opacity: 0;
}

.route-leave-to {
  opacity: 0;
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
}

.route-leave-to {
  opacity: 0;
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
