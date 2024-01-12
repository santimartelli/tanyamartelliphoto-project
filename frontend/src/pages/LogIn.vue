<template>
  <div>
    <base-dialog :show="!!error" title="Error!" @close="handleError">
      <p>{{ error }}</p></base-dialog
    >
    <div class="container-login">
      <img
        src="../assets/images/logo.jpg"
        alt="Logo Tanya Martelli Photography"
      />
      <div v-if="isLoading">
        <p class="authenticating">Authenticating...</p>
        <base-spinner />
      </div>
      <div v-else>
        <form @submit.prevent="submitForm">
          <input
            type="text"
            v-model="username"
            id="username"
            placeholder="Username"
          />
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="Password"
          />
          <div class="button-container">
            <base-button @click="submitForm">Log In</base-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
        });
        this.$router.push({ name: "admin" });
      } catch (err) {
        this.error =
          err.message ||
          "Failed to log in, check your credentials and try again.";
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
.container-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.container-login img {
  width: 120px;
  height: auto;
  margin-bottom: 30px;
  border-radius: 15px;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
}
input {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-bottom: 1.5rem;
  padding: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
}

.authenticating {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-bottom: 20px;
  padding: 5px;
  text-align: center;
}

input:focus {
  outline: none;
  border-bottom: 1px solid #f79f9f;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
