<!-- Componente para hacer el inicio de sesión de un usuario -->

<template>
  <div>
    <!-- Dialogo de registro de administrador -->

    <registration-admin
      :show="!!openRegistration"
      @close="closeRegistrationDialog"
    >
      <div class="container-registration">
        <div v-if="isLoadingAdmin" class="form">
          <p class="authenticating">Registrando...</p>
          <base-spinner />
        </div>
        <div
          v-if="
            registrationSuccess && !isLoadingAdmin && !adminRegistrationError
          "
          class="form"
        >
          <p style="color: green; padding-bottom: 1.5rem; font-size: 14px">
            Administrador registrado correctamente!
          </p>
          <base-button
            @click="closeRegistrationDialog"
            >Cerrar</base-button
          >
        </div>
        <div
          v-if="
            adminRegistrationError && !registrationSuccess && !isLoadingAdmin
          "
          class="form"
        >
          <p style="color: red; padding-bottom: 1.5rem; font-size: 14px">
            Error en el registro, por favor inténtelo de nuevo.
          </p>
          <base-button
            @click="closeRegistrationDialog"
            >Cerrar</base-button
          >
        </div>

        <!-- Formulario  -->

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
              placeholder="Usuario"
            />
            <div v-if="!formIsValidUsername" class="errors">
              Por favor introduce un nombre de usuario válido, mínimo 3
              caracteres.
            </div>
            <input
              type="password"
              v-model="newPassword"
              id="newPassword"
              placeholder="Contraseña"
            />
            <div v-if="!formIsValidPassword" class="errors">
              Por favor introduce una contraseña válida, mínimo 6 caracteres.
            </div>
            <input
              type="password"
              v-model="newConfirmedPassword"
              id="newConfirmedPassword"
              placeholder="Confirma la contraseña"
            />
            <div v-if="!formIsValidConfirmedPassword" class="errors">
              Error, las contraseñas no coinciden.
            </div>
            <input
              type="text"
              v-model="newCodeVerification"
              id="codeVerification"
              placeholder="Código de verificación"
            />
            <div v-if="!formIsValidCodeVerification" class="errors">
              Error, el código de verificación no es correcto.
            </div>
            <div class="buttons-container">
              <base-button @click="adminRegistration">Enviar</base-button>
              <base-button @click="closeRegistrationDialog">Cerrar</base-button>
            </div>
          </div>
        </div>
      </div>
    </registration-admin>

    <!-- Dialogo de error en el inicio de sesión -->

    <base-dialog :show="!!error" title="Error!" @close="handleError">
      <p>{{ error }}</p></base-dialog
    >
    <div class="container-login">
      <img
        src="../assets/images/logo.jpg"
        alt="Logo Tanya Martelli Photography"
      />
      <div v-if="isLoading">
        <p class="authenticating">Autenticando...</p>
        <base-spinner />
      </div>
      <div v-else>
        <form @submit.prevent="submitForm">
          <input
            type="text"
            v-model="username"
            id="username"
            placeholder="Usuario"
          />
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="Contraseña"
          />
          <div class="buttons-container">
            <base-button @click="submitForm">Iniciar Sesión</base-button>
          </div>
        </form>
      </div>
      <p class="registration">
        Para registrarse como administrador, haga click
        <span @click="openRegistrationDialog" class="here">aqui!</span>
      </p>
    </div>
  </div>
</template>

<script>
import RegistrationAdmin from "../components/ui/RegistrationAdmin.vue";
/**
 * Componente para hacer el inicio de sesión de un usuario.
 * @vue-data {string} username - Nombre de usuario.
 * @vue-data {string} password - Contraseña.
 * @vue-data {boolean} isLoading - Indica si se está autenticando.
 * @vue-data {string} error - Mensaje de error.
 * @vue-data {boolean} openRegistration - Indica si el dialogo de registro de administrador está abierto.
 * @vue-data {string} newUsername - Nuevo nombre de usuario.
 * @vue-data {string} newPassword - Nueva contraseña.
 * @vue-data {string} newConfirmedPassword - Confirmación de la nueva contraseña.
 * @vue-data {string} newCodeVerification - Código de verificación.
 * @vue-data {string} codeVerification - Código de verificación.
 * @vue-data {boolean} formIsValidUsername - Indica si el nombre de usuario es válido.
 * @vue-data {boolean} formIsValidPassword - Indica si la contraseña es válida.
 * @vue-data {boolean} formIsValidConfirmedPassword - Indica si la confirmación de la contraseña es válida.
 * @vue-data {boolean} formIsValidCodeVerification - Indica si el código de verificación es válido.
 * @vue-data {boolean} formIsValid - Indica si el formulario es válido.
 * @vue-data {boolean} registrationSuccess - Indica si el registro fue exitoso.
 * @vue-data {boolean} adminRegistrationError - Indica si hubo un error en el registro.
 * @vue-components {RegistrationAdmin} - Componente que muestra el dialogo para registrar un nuevo administrador.
 * @vue-methods submitForm - Intenta hacer el inicio de sesión de un usuario.
 * @vue-methods handleError - Cierra el dialogo de error.
 * @vue-methods openRegistrationDialog - Abre el dialogo para registrar un nuevo administrador.
 * @vue-methods closeRegistrationDialog - Cierra el dialogo para registrar un nuevo administrador y resetea el formulario.
 * @vue-methods adminRegistration - Intenta registrar un nuevo administrador.
 * @vue-slot - Contenido del dialogo de registro de administrador.
 */
export default {
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
      codeVerification: process.env.VUE_APP_CODE_VERIFICATION,
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
          "Credenciales incorrectas, por favor inténtelo de nuevo.";
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
          console.log("Registrando administrador...");
          await this.$store.dispatch("adminRegistration", {
            username: this.newUsername,
            password: this.newPassword,
            password_repeat: this.newConfirmedPassword,
          });
          console.log("Administador registrado correctamente!");
          this.isLoadingAdmin = null;
          this.registrationSuccess = true;
          this.adminRegistrationError = null;
        } catch (error) {
          console.error("Error en el registro: ", error);
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
