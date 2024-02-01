<!-- Componente para hacer el inicio de sesión de un usuario -->

<template>
  <div>
    <registration-admin
      :show="!!openRegistration"
      @close="closeRegistrationDialog"
    >
      <div class="container-registration">
        <div v-if="isLoadingAdmin" class="form">
          <p class="authenticating">Registering...</p>
          <base-spinner />
        </div>
        <div
          v-if="
            registrationSuccess && !isLoadingAdmin && !adminRegistrationError
          "
          class="form"
        >
          <p style="color: green; padding-bottom: 1.5rem; font-size: 14px">
            Admin successfully registered!
          </p>
          <base-button
            style="margin-botom=1.5rem;"
            @click="closeRegistrationDialog"
            >Close</base-button
          >
        </div>
        <div
          v-if="
            adminRegistrationError && !registrationSuccess && !isLoadingAdmin
          "
          class="form"
        >
          <p style="color: red; padding-bottom: 1.5rem; font-size: 14px">
            Registration failed. Please try again!
          </p>
          <base-button
            style="margin-botom=1.5rem;"
            @click="closeRegistrationDialog"
            >Close</base-button
          >
        </div>

        <!-- Formulario de registro de un nuevo administrador -->

        <div
          v-if="
            !isLoadingAdmin && !registrationSuccess && !adminRegistrationError
          "
          class="form"
        >
          <div @submit.prevent="submitForm" class="inputs-container">
            <input
              type="text"
              v-model="newUsername"
              id="newUsername"
              placeholder="Username"
            />
            <div v-if="!formIsValidUsername" class="errors">
              Please enter a valid username, minimum 3 characters.
            </div>
            <input
              type="password"
              v-model="newPassword"
              id="newPassword"
              placeholder="Password"
            />
            <div v-if="!formIsValidPassword" class="errors">
              Please enter a valid password, minimum 6 characters.
            </div>
            <input
              type="password"
              v-model="newConfirmedPassword"
              id="newConfirmedPassword"
              placeholder="Confirm password"
            />
            <div v-if="!formIsValidConfirmedPassword" class="errors">
              Error, the passwords must match.
            </div>
            <input
              type="text"
              v-model="newCodeVerification"
              id="codeVerification"
              placeholder="Code verification"
            />
            <div v-if="!formIsValidCodeVerification" class="errors">
              Error, the code verification is not correct.
            </div>
            <div class="buttons-container">
              <base-button @click="adminRegistration">Register</base-button>
              <base-button @click="closeRegistrationDialog">Close</base-button>
            </div>
          </div>
        </div>
      </div>
    </registration-admin>
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
          <div class="buttons-container">
            <base-button @click="submitForm">Log In</base-button>
          </div>
        </form>
      </div>
      <p class="registration">
        To register as an admin click
        <span @click="openRegistrationDialog" class="here">here!</span>
      </p>
    </div>
  </div>
</template>

<script>
import RegistrationAdmin from "../components/ui/RegistrationAdmin.vue";

export default {
  /**
   * Componentes que usa el componente
   * @component RegistrationAdmin - Componente que muestra un dialogo para registrar un nuevo administrador.
   */
  components: {
    RegistrationAdmin,
  },

  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      error: null,
      openRegistration: false,
      newUsername: "",
      newPassword: "",
      newConfirmedPassword: "",
      newCodeVerification: "",
      codeVerification: "uZ*S3AV6^EaAe6$JjvwwrpWP@F@7Q",
      formIsValidUsername: true, //minimo 3 caracteres
      formIsValidPassword: true, // minimo 6 caracteres
      formIsValidConfirmedPassword: true, // minimo 6 caracteres
      formIsValidCodeVerification: true, // proporcionado por otro admin
      formIsValid: true,
      registrationSuccess: null,
      adminRegistrationError: null,
    };
  },

  methods: {
    /**
     * Intenta hacer el inicio de sesión de un usuario.
     */
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

    /**
     * Cierra el dialogo de error.
     */
    handleError() {
      this.error = null;
    },

    /**
     * Abre el dialogo para registrar un nuevo administrador.
     */
    openRegistrationDialog() {
      this.openRegistration = true;
    },

    /**
     * Cierra el dialogo para registrar un nuevo administrador y resetea el formulario.
     */
    closeRegistrationDialog() {
      this.openRegistration = false;
      this.newUsername = "";
      this.newPassword = "";
      this.newConfirmedPassword = "";
      this.newCodeVerification = "";
      this.formIsValidUsername = true; //minumum 3 characters
      this.formIsValidPassword = true; // minimum 6 characters
      this.formIsValidConfirmedPassword = true; // minimum 6 characters
      this.formIsValidCodeVerification = true; // provided from another admin
      this.formIsValid = true;
      this.isLoadingAdmin = null;
      this.registrationSuccess = null;
      this.adminRegistrationError = null;
    },

    /**
     * Intenta registrar un nuevo administrador.
     */
    async adminRegistration() {
      this.formIsValid = true;
      // Validaciones
      this.formIsValidUsername = this.newUsername.trim().length >= 3;
      this.formIsValidPassword = this.newPassword.trim().length >= 6;
      this.formIsValidConfirmedPassword =
        this.newPassword.trim() === this.newConfirmedPassword.trim();
      this.formIsValidCodeVerification =
        this.newCodeVerification.trim() === this.codeVerification;
      this.formIsValid =
        this.formIsValidUsername &&
        this.formIsValidPassword &&
        this.formIsValidConfirmedPassword &&
        this.formIsValidCodeVerification;

      if (this.formIsValid) {
        this.isLoadingAdmin = true;
        try {
          console.log("Registering the admin...");
          await this.$store.dispatch("adminRegistration", {
            username: this.newUsername,
            password: this.newPassword,
            password_repeat: this.newConfirmedPassword,
          });
          console.log("Admin registered successfully!");
          this.isLoadingAdmin = null;
          this.registrationSuccess = true;
          this.adminRegistrationError = null;
        } catch (error) {
          console.error("Error registering the admin:", error);
          this.isLoadingAdmin = null;
          this.registrationSucces = null;
          this.adminRegistrationError = true;
        }
      }
      this.isLoadingAdmin = false;
    },
  },
};
</script>

<style scoped>

/* Estilos para el componente LogIn.vue */

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
  margin: 30px;
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

.registration {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-top: 1rem;
  padding: 5px;
  text-align: center;
}

.here {
  cursor: pointer;
  text-decoration: underline;
}

.here:hover {
  color: #f79f9f;
}

.container-registration {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
}

.buttons-container div {
  margin: 0.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.inputs-container input {
  width: 100%;
}

.errors {
  width: 100%;
  color: red;
  font-size: 14px;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}
</style>
