<template>
  <div class="container">
    <h2>I would love to hear from you!</h2>
    <p>
      I truly appreciate your interest and consideration in my photography
      services! If you have any questions, want more information, or would like
      to get in touch with me, please don't hesitate to reach out using the
      contact form below. I'll respond to your message as soon as possible.
    </p>

    <base-card>
      <form>
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" v-model="name" />
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" v-model="email" />
        <label for="message">Mensaje:</label>
        <textarea
          id="message"
          name="message"
          rows="10"
          v-model="message"
        ></textarea>
        <div class="btn-container">
          <base-button @click="submitForm" value="Enviar">Enviar</base-button>
        </div>
      </form>
    </base-card>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      message: "",
    };
  },
  validations() {
    return {
      name: { required },
      email: { required },
      message: { required },
    };
  },
  methods: {
    submitForm() {
      this.v$.$validate();
      if (!this.v$.$error) {
        alert("Mensaje enviado correctamente");
      } else {
        alert(
          "Se ha producido un error, por favor rellena los campos correctamente"
        );
      }
    },
  },
};
</script>

<style scoped>
label {
  letter-spacing: 0.1rem;
  font-size: 0.8rem;
  color: black;
}
input,
textarea {
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  background-color: white;
  border: 0.5px solid rgb(235, 228, 228);
  font-size: 0.8rem;
  padding: 5px;
  margin-top: 12px;
  margin-bottom: 2rem;
  width: 100%;
  color: black;
}

input:focus,
textarea:focus {
  border: 0.5px solid slategray;
}

.btn-container {
  display: flex;
  justify-content: center;
}
</style>
