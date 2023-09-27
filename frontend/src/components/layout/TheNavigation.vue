<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <nav>
      <!-- Versión de escritorio 1-->

      <ul v-if="!mobile && !segundoNav">
        <div class="nav-items">
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'home' }"
              >HOME</router-link
            >
          </li>
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'about' }"
              >SOBRE MÍ</router-link
            >
          </li>
          <li
            @mouseover="showDropdown = true"
            @mouseleave="showDropdown = false"
            @click="toggleShowDropdown"
          >
            <a
              class="link sparkle u-hover--sparkle porfolio-arrow-container"
              @click.prevent
              >PORTFOLIO
              <img
                v-if="!showDropdown"
                src="../../assets/Icons/flecha-abajo.png" />
              <img v-else src="../../assets/Icons/flecha-arriba.png"
            /></a>
            <transition name="dropdown">
              <ul v-if="showDropdown" class="dropdown">
                <li v-for="cat in categories" :key="cat.categoryId">
                  <router-link
                    :to="'/portfolio/' + cat.categoryId"
                    class="li-a"
                    >{{ cat.categoryName }}</router-link
                  >
                </li>
              </ul>
            </transition>
          </li>
        </div>
        <li class="logo">
          <div class="title">
            <h1 class="name-title">TanyaMartelli</h1>
            <h1 class="photography-title">PHOTOGRAPHY</h1>
          </div>
        </li>
        <div class="nav-items">
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'booking' }"
              >RESERVAS</router-link
            >
          </li>
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'contact' }"
              @click="toggleMobileNav"
              >CONTACTO</router-link
            >
          </li>
          <li>
            <router-link
                v-if="!isLoggedIn"
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'login' }"
                @click="toggleMobileNav"
                >LOGIN</router-link
              >
              <router-link
                v-else
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'admin' }"
                @click="toggleMobileNav"
                >ADMIN</router-link
              >
          </li>
        </div>
      </ul>

      <!-- Versión de escritorio 2-->

      <ul v-if="segundoNav">
        <li class="logo">
          <div class="title">
            <h1 class="name-title">TanyaMartelli</h1>
            <h1 class="photography-title">PHOTOGRAPHY</h1>
          </div>
        </li>
        <div class="nav-items">
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'home' }"
              >HOME</router-link
            >
          </li>
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'about' }"
              >SOBRE MÍ</router-link
            >
          </li>
          <li
            @mouseover="showDropdown = true"
            @mouseleave="showDropdown = false"
            @click="toggleShowDropdown"
          >
            <a
              class="link sparkle u-hover--sparkle porfolio-arrow-container"
              @click.prevent
              >PORTFOLIO
              <img
                v-if="!showDropdown"
                src="../../assets/Icons/flecha-abajo.png" />
              <img v-else src="../../assets/Icons/flecha-arriba.png"
            /></a>
            <transition name="dropdown">
              <ul v-if="showDropdown" class="dropdown">
                <li v-for="cat in categories" :key="cat.categoryId">
                  <router-link
                    :to="'/portfolio/' + cat.categoryId"
                    class="li-a"
                    >{{ cat.categoryName }}</router-link
                  >
                </li>
              </ul>
            </transition>
          </li>
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'booking' }"
              >RESERVAS</router-link
            >
          </li>
          <li>
            <router-link
              class="link sparkle u-hover--sparkle"
              :to="{ name: 'contact' }"
              @click="toggleMobileNav"
              >CONTACTO</router-link
            >
          </li>
          <li>
            <router-link
                v-if="!isLoggedIn"
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'login' }"
                @click="toggleMobileNav"
                >LOGIN</router-link
              >
              <router-link
                v-else
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'admin' }"
                @click="toggleMobileNav"
                >ADMIN</router-link
              >
          </li>
        </div>
      </ul>

      <!-- Versión móvil -->

      <div>
        <router-link v-if="mobile" class="link" :to="{ name: 'home' }"
          ><div class="title">
            <h1 class="name-title">TanyaMartelli</h1>
            <h1 class="photography-title">PHOTOGRAPHY</h1>
          </div>
        </router-link>
        <div class="icon">
          <i
            @click="toggleMobileNav"
            v-show="mobile"
            :class="{ 'icon-active': mobileNav }"
            ><img src="../../assets/Icons/menu.png" alt="menu"
          /></i>
        </div>
      </div>
      <transition name="mobile-nav">
        <div v-show="mobileNav && mobile" class="dropdown-nav link">
          <div class="title">
            <h1 class="name-title">TanyaMartelli</h1>
            <h1 class="photography-title">PHOTOGRAPHY</h1>
          </div>
          <ul class="dropdown-items">
            <li>
              <router-link
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'home' }"
                @click="toggleMobileNav"
                >HOME</router-link
              >
            </li>
            <li>
              <router-link
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'about' }"
                @click="toggleMobileNav"
                >SOBRE MÍ</router-link
              >
            </li>
            <li @click="toggleShowDropdown">
              <a
                class="link sparkle u-hover--sparkle porfolio-arrow-container"
                @click.prevent
                >PORTFOLIO
                <img
                  v-if="!showDropdown"
                  src="../../assets/Icons/flecha-abajo.png" />
                <img v-else src="../../assets/Icons/flecha-arriba.png"
              /></a>
              <transition name="dropdown">
                <ul v-if="showDropdown" class="dropdown">
                  <li
                    v-for="cat in categories"
                    :key="cat.categoryId"
                    @click="toggleMobileNav"
                  >
                    <router-link
                      :to="'/portfolio/' + cat.categoryId"
                      class="li-a"
                      >{{ cat.categoryName }}</router-link
                    >
                  </li>
                </ul>
              </transition>
            </li>

            <li>
              <router-link
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'booking' }"
                @click="toggleMobileNav"
                >RESERVAS</router-link
              >
            </li>
            <li>
              <router-link
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'contact' }"
                @click="toggleMobileNav"
                >CONTACTO</router-link
              >
            </li>
            <li>
              <router-link
                v-if="!isLoggedIn"
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'login' }"
                @click="toggleMobileNav"
                >LOGIN</router-link
              >
              <router-link
                v-else
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'admin' }"
                @click="toggleMobileNav"
                >ADMIN</router-link
              >
            </li>
          </ul>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      scrolledNav: null,
      mobileNav: null,
      scrollPosition: 0,
      showDropdown: false,
    };
  },
  computed: {
    ...mapGetters(["screenWidth", "mobile", "segundoNav", "primerNav"]),
    categories() {
      return this.$store.getters["categories/categories"];
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
    toggleShowDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    updateScroll() {
      const scrollPosition = window.scrollY;
      if (scrollPosition >= this.scrollPosition && this.scrollPosition > 120) {
        this.scrolledNav = true;
      } else {
        this.scrolledNav = false;
      }
      this.scrollPosition = scrollPosition;
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace({ name: "home" });
    },
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
  },
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 99;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: #fff;
  transition: 0.5s ease all;

  nav {
    // position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: 0.5s ease all;

    ul,
    link {
      display: flex;
      list-style: none;
      padding: 0;
      align-items: center;
    }

    li {
      margin: 1rem;
      letter-spacing: 0.1rem;
    }

    .nav-items {
      display: flex;
      flex-direction: row;
    }

    .porfolio-arrow-container {
      display: flex;
      align-items: center;
    }

    .porfolio-arrow-container img {
      width: 15px;
    }

    .link {
      transition: 0.5s ease all;
      text-decoration: none;
      color: #000;
      font-size: 0.8rem;
    }

    .title {
      font-family: typewriter-extralight;
      padding: 1rem 3rem;
    }

    .title h1 {
      letter-spacing: 0.3rem;
    }
    .name-title {
      font-family: Thesignature;
      font-weight: 400;
      font-size: 3rem;
      margin-bottom: 0;
    }
    .photography-title {
      font-size: 0.6rem;
    }

    .sparkle {
      max-width: 10em;
      margin: auto auto;
    }
    .sparkle:hover {
      cursor: pointer;
    }

    .u-hover--sparkle {
      box-sizing: border-box;
      position: relative;
      padding: 0.2em 0.8em;
    }

    .u-hover--sparkle::before,
    .u-hover--sparkle::after {
      content: "";
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      transform-origin: center;
    }

    .u-hover--sparkle::before {
      border-bottom: 0.8em solid #fae8e8;
      transform: scale3d(0, 1, 1);
      z-index: -100;
    }
    .u-hover--sparkle::after {
      transform: scale3d(1, 0, 1);
    }
    .u-hover--sparkle:hover::before,
    .u-hover--sparkle:hover::after {
      transform: scale3d(1, 1, 1);
      transition: transform 900ms;
    }

    .router-link-exact-active::before {
      border-bottom: 0.8em solid #fae8e8;
      transform: scale3d(1, 1, 1);
      z-index: -100;
    }

    .icon {
      display: flex;
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 99;

      i {
        cursor: pointer;
        height: 40px;
        width: 40px;
        transition: 0.8s ease all;
      }
    }

    .icon-active {
      transform: rotate(-180deg);
    }

    .dropdown {
      display: flex;
      flex-direction: column;
      position: absolute;
      margin: 0;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      background-color: #fff;
      transition: 0.5s ease all;
      z-index: 99;
    }

    .dropdown ul {
      display: flex;
      flex-direction: column;
    }

    .dropdown li {
      width: 100%;
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 0.8rem;
    }
    .dropdown li:hover {
      background-color: #fae8e8;
    }

    .li-a {
      margin: 0;
      padding: 1rem;
      display: block;
      width: 100%;
      height: 100%;
    }

    .dropdown-enter-active,
    .dropdown-leave-active {
      transition: opacity 0.5s;
    }
    .dropdown-enter-from,
    .dropdown-leave-to {
      opacity: 0;
    }
    .dropdown-enter-to,
    .dropdown-leave-from {
      opacity: 1;
    }

    .dropdown-nav {
      display: flex;
      flex-direction: column;
      position: fixed;
      width: 100%;
      margin: 0;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      background-color: #fff;
      top: 0;
      left: 0;
      transition: 0.5s ease all;

      ul {
        display: flex;
        flex-direction: column;

        li {
          margin-left: 0;
          .link {
            color: #000;
          }
        }
      }
    }

    .mobile-nav-enter-active,
    .mobile-nav-leave-active {
      transition: all 1s ease;
    }

    .mobile-nav-enter-from,
    .mobile-nav-leave-active {
      transform: translateY(-100%);
    }

    .mobile-nav-enter-to,
    .mobile-nav-leave-from {
      transform: translateY(0);
    }
  }
  &.scrolled-nav {
    transform: translateY(-100%);
    transition: 0.5s ease all;

    &:hover {
      transform: translateY(0);
    }
  }
}

@media (max-width: 1235px) {
  nav ul {
    flex-direction: column;
  }
  .nav-items {
    flex-direction: row;
  }

  .logo {
    margin: 0;
  }

  .nav-items li {
    margin-top: 0.2rem;
  }
}

@media (max-width: 500px) {
  i {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  i img {
    height: 30px;
    width: 30px;
  }

  header nav .name-title {
    font-size: 2.5rem;
  }

  header nav .photography-title {
    font-size: 0.5rem;
  }
}
</style>
