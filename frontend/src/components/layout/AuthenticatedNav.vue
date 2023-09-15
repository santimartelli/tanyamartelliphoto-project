<template>
  <div class="auth-nav">
    <div class="left">
      <div class="title">
        <h1 class="name-title">TanyaMartelli</h1>
      </div>
    </div>
    <div class="right">
      <li v-if="isAdminPanel">
        <router-link :to="{ name: 'home' }" class="router-link btn-link"
          >Home</router-link
        >
      </li>
      <li v-else>
        <router-link :to="{ name: 'admin' }" class="router-link btn-link"
          >Admin Panel</router-link
        >
      </li>
      <li>
        <a @click.prevent="logout" class="btn-link">LOGOUT</a>
      </li>
    </div>
  </div>
  <div class="welcome">
    <h3>
      {{ "Welcome " + username }}
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminPanelLink: false,
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.user.username;
    },
    isAdminPanel() {
      return this.$route.name === 'admin';
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace({ name: "home" });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.auth-nav {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #000;
  z-index: 99;
  font-size: 0.7rem;
  color: #fff;
}

.left,
.right {
  width: 50%;
  display: flex;
}

.left {
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
  justify-content: left;
}

.welcome {
  display: flex;
  justify-content: center;
  padding: .5rem;
  font-family: Typewriter-extralight;
  font-size: .8rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  background-color: #fadddd;
}

.right {
  display: flex;
  justify-content: flex-end;
  padding-right: 1rem;
}

li {
  list-style: none;
  cursor: pointer;
}

.btn-link {
  font-family: Typewriter-light;
  font-weight: 500;
  letter-spacing: 0.05rem;
  color: #fff;
  background-color: transparent;
  padding: 0.5rem 1rem;
  text-align: center;
  transition: all 0.5s ease-in-out;
}
.btn-link:hover {
  color: #f7bebe;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title h1 {
  letter-spacing: 0.3rem;
}
.name-title {
  font-family: Thesignature;
  font-weight: 400;
  font-size: 2rem;
  margin-bottom: 0;
}
</style>
