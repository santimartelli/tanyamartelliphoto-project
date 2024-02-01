<!--Componente que muestra la barra de navegación cuando el usuario está autenticado.-->

 <template>
  <div class="auth-nav">
    <div class="left">
      <div class="title">
        <h1 class="name-title">TanyaMartelli</h1>
      </div>
    </div>
    <div class="right">
      <li>
        <router-link :to="{ name: 'home' }" class="router-link btn-link"
          >Home</router-link
        >
      </li>
      <li>
        <a @click.prevent="logout" class="btn-link">LOGOUT</a>
      </li>
    </div>
  </div>
  <div class="welcome">
    <p>ADMIN PANEL DE {{ username }}</p>
  </div>
</template>

<script>

export default {
  computed: {
    /**
     * Devuelve el nombre de usuario en mayúsculas.
     * @returns {string} Nombre de usuario en mayúsculas.
     */
    username() {
      const username = this.$store.state.auth.user.username;
      return username.toUpperCase();
    },
  },

  methods: {
    /**
     * Cierra sesión de usuario y redirige a la página de inicio.
     */
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace({ name: "home" });
    },
  },
};
</script>

<style scoped>

/* Estilos para el componente AuthenticatedNav.vue */

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
  padding: 0.5rem;
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
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: Typewriter-light;
  letter-spacing: 0.2rem;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}

.welcome p {
  color: rgb(22, 103, 11);
  font-size: 1rem;
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

/* Media queries para pantallas de hasta 450px de ancho.*/

@media (max-width: 450px) {
  .auth-nav {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  .left,
  .right {
    width: 100%;
    justify-content: center;
  }
  .left {
    justify-content: center;
  }
  .right {
    justify-content: center;
    margin-bottom: 1rem;
  }
  .btn-link {
    font-size: 0.5rem;
  }
  .name-title {
    font-size: 1.5rem;
  }
}
</style>
