<!-- Componente que contiene el formulario de contacto general -->

<template>
  <div>

    <!-- Dialogo con mensaje feedback cuando se envía formulario -->

    <ok-dialog :show="!!okMessage" @close="closeDialog">
      <h2>Mensaje enviado correctamente!</h2>
      <p>{{ okMessage }}</p>
    </ok-dialog>
    <ok-dialog :show="!!errorMessage" @close="closeDialog">
      <h2>Error!</h2>
      <p>{{ errorMessage }}</p>
    </ok-dialog>
    <div class="container">

      <!-- Texto -->

      <h2>Me encantaría saber de tí!</h2>
      <p>
        Aprecio mucho tu interés y consideración hacia mis servicios de
        fotografía! Si tienes preguntas, necesitas más información o simplemente
        quieres charlar conmigo, no dudes en usar el formulario de contacto de
        aquí abajo. Te responderé a la mayor brevedad posible.
      </p>

      <!-- Formulario -->

      <div>
        <form @submit.prevent="addNewMessage">
          <input
            type="text"
            v-model.trim="newMessageName"
            name="messageName"
            id="messageName"
            placeholder="Nombre"
          />
          <div v-if="!formIsValidName" class="errors">
            Por favor introduce un nombre válido.
          </div>

          <input
            type="text"
            v-model.trim="newMessageEmail"
            id="messageEmail"
            placeholder="Email"
          />
          <div v-if="!formIsValidEmail" class="errors">
            Por favor introduce un email válido.
          </div>

          <label for="messageContent">Mensaje</label>
          <textarea
            id="messageContent"
            rows="10"
            name="messageContent"
            v-model.trim="newMessageContent"
          ></textarea>
          <div v-if="!formIsValidContent" class="errors">
            Por favor introduce un mensaje válido.
          </div>
          <div class="btn-container">
            <base-button @click="addNewMessage" value="Enviar"
              >Enviar</base-button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import OkDialog from "../components/ui/OkDialog.vue";
/**
 * Componente que contiene el formulario de contacto general.
 * @vue-data {string} newMessageName - Nombre del remitente del mensaje.
 * @vue-data {string} newMessageEmail - Email del remitente del mensaje.
 * @vue-data {string} newMessageContent - Contenido del mensaje.
 * @vue-data {boolean} formIsValidName - Indica si el nombre es válido.
 * @vue-data {boolean} formIsValidEmail - Indica si el email es válido.
 * @vue-data {boolean} formIsValidContent - Indica si el contenido del mensaje es válido.
 * @vue-data {boolean} formIsValid - Indica si el formulario es válido.
 * @vue-data {string} okMessage - Mensaje de éxito al enviar el formulario.
 * @vue-data {string} errorMessage - Mensaje de error al enviar el formulario.
 * @vue-components {OkDialog} - Componente que muestra un dialogo de feedback.
 * @vue-methods addNewMessage - Añade un nuevo mensaje a la base de datos y almacena el resultado en el estado de la aplicación.
 * @vue-methods isValidEmail - Comprueba si el email es válido con una expresión regular.
 * @vue-methods closeDialog - Cierra el dialogo y resetea el formulario.
 * @vue-created - Resetea okMessage cuando se crea el componente para que no se muestre el dialogo.
 */
export default {
  components: {
    OkDialog,
  },

  data() {
    return {
      newMessageName: "",
      newMessageEmail: "",
      newMessageContent: "",
      formIsValidName: true,
      formIsValidEmail: true,
      formIsValidContent: true,
      formIsValid: true,
      okMessage: null,
      errorMessage: null,
    };
  },

  methods: {
    /**
     * Añade un nuevo mensaje a la base de datos y almacena el resultado en el estado de la aplicación.
     */
    async addNewMessage() {
      this.formIsValid = true;
      // Validaciones
      this.formIsValidName = !!this.newMessageName.trim();
      this.formIsValidEmail = this.isValidEmail(this.newMessageEmail.trim());
      this.formIsValidContent = !!this.newMessageContent.trim();
      this.formIsValid =
        this.formIsValidName &&
        this.formIsValidEmail &&
        this.formIsValidContent;

      if (this.formIsValid) {
        try {
          await this.$store.dispatch("messages/addNewMessage", {
            messageName: this.newMessageName,
            messageEmail: this.newMessageEmail,
            messageContent: this.newMessageContent,
          });
          this.okMessage =
            "Gracias por tu mensaje! Te responderé a la mayor brevedad posible!";
        } catch (error) {
          console.error("Error enviando mensaje: ", error);
          this.errorMessage =
            "Ocurrió un error enviando tu mensaje. Por favor inténtalo de nuevo más tarde.";
        }
      }
    },

    /**
     * Comprueba si el email es válido con una expresión regular.
     */
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Cierra el dialogo y resetea el formulario.
     */
    closeDialog() {
      this.newMessageName = "";
      this.newMessageEmail = "";
      this.newMessageContent = "";
      this.formIsValidName = true;
      this.formIsValidEmail = true;
      this.formIsValidContent = true;
      this.formIsValid = true;
      this.okMessage = null;
      this.errorMessage = null;
    },
  },

  /**
   * Resetea okMessage cuando se crea el componente para que no se muestre el dialogo.
   */
  created() {
    this.okMessage = null;
  },
};
</script>

<style scoped>
/* Estilos para el componente ContactForm.vue */

.container {
  width: 60%;
  margin: 0 auto;
  padding: 20px;
}

.container > h2 {
  text-align: center;
  padding-bottom: 1rem;
}

form {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  padding-top: 3rem;
}

input {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-bottom: 1.5rem;
  padding: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
}

textarea {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-bottom: 1.5rem;
  padding: 5px;
  border: 1px solid #ccc;
}

label {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: 0.65;
  padding: 0 5px 5px 5px;
}

input:focus {
  outline: none;
  border-bottom: 1px solid #f79f9f;
}

textarea:focus {
  outline: none;
  border: 1px solid #f79f9f;
}

.btn-container {
  display: flex;
  justify-content: center;
}

.errors {
  color: red;
  font-size: 14px;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

/* MEDIA QUERIES */

@media (max-width: 855px) {
  .container {
    width: 98%;
  }
}

@media (max-width: 1235px) {
  form {
    width: 100%;
  }
}
</style>
