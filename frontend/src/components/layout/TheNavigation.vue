<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <nav>
      <!-- Versión de escritorio -->
      <ul v-show="!mobile">
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
          <a class="link sparkle u-hover--sparkle" @click.prevent
            >PORTFOLIO
            <img
              v-if="!showDropdown"
              src="../../assets/Icons/flecha-abajo.png"
              style="width: 10px" />
            <img
              v-else
              src="../../assets/Icons/flecha-arriba.png"
              style="width: 10px"
          /></a>
          <ul v-if="showDropdown" class="dropdown">
            <li v-for="cat in categories" :key="cat.CategoryID">
              <router-link :to="'/portfolio/' + cat.CategoryID" class="li-a">{{
                cat.CategoryName
              }}</router-link>
            </li>
          </ul>
        </li>
        <li class="logo">
          <div class="title">
            <h1 class="name-title">TANYAMARTELLI</h1>
            <h1 class="photography-title">PHOTOGRAPHY</h1>
          </div>
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
            >CONTACTO</router-link
          >
        </li>
        <li>
          <router-link
            class="link sparkle u-hover--sparkle"
            :to="{ name: 'access' }"
            >MINI-SESSIONS</router-link
          >
        </li>
      </ul>
      <!-- Versión móvil -->
      <div>
        <router-link v-show="mobile" class="link" :to="{ name: 'home' }"
          ><div class="title">
            <h1 class="name-title">TANYAMARTELLI</h1>
            <h1 class="photography-title">PHOTOGRAPHY</h1>
          </div>
        </router-link>
        <div class="icon">
          <i
            @click="toggleMobileNav"
            v-show="mobile"
            class="far fa-bars"
            :class="{ 'icon-active': mobileNav }"
          ></i>
        </div>
      </div>
      <transition name="mobile-nav">
        <div v-show="mobileNav" class="dropdown-nav link">
          <div class="title">
            <h1 class="name-title">TANYAMARTELLI</h1>
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
            <li>
              <router-link
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'portfolio' }"
                @click="toggleMobileNav"
                >PORTFOLIO</router-link
              >
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
                class="link sparkle u-hover--sparkle"
                :to="{ name: 'access' }"
                >MINI-SESSIONS</router-link
              >
            </li>
          </ul>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      scrolledNav: null,
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      scrollPosition: 0,
      showDropdown: false,
      categories: [],
    };
  },
  created() {
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
    this.getCategories();
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
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
      if (scrollPosition >= this.scrollPosition) {
        this.scrolledNav = true;
      } else {
        this.scrolledNav = false;
      }
      this.scrollPosition = scrollPosition;
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 988) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
    },
    getCategories() {
      axios
        .get("http://localhost:3000/api/categories")
        .then((res) => {
          this.categories = res.data;
          console.log(this.categories);
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
      font-size: 1.2rem;
      margin-bottom: 1rem;
      // transition: all 0.5s ease;
    }
    .photography-title {
      font-size: 0.6rem;
      // transition: all 0.5s ease;
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
        font-size: 24px;
        transition: 0.8s ease all;
      }
    }

    .icon-active {
      transform: rotate(180deg);
    }

    .dropdown {
      display: flex;
      flex-direction: column;
      position: absolute;
      margin: 0;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      background-color: #fff;
      transition: 0.5s ease all;
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
</style>
