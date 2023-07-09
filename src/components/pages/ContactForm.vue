<template>
  <div class="container">
    <h2>I would love to hear from you!</h2>
    <p>
      Whether you're interested in booking a photoshoot, have a question about
      my services, or just want to say hello, please don't hesitate to fill out
      the contact form below. I will do my best to respond to your message
      within 24-48 hours.
    </p>
    <p>
      Please include as many details as possible about your inquiry, including
      the type of session you're interested in, the location, and any special
      requests or requirements. This helps ensure that I can provide you with
      the most accurate and helpful information.
    </p>

    <p>
      Thank you for considering me as your photographer, and I look forward to
      the opportunity to work with you!
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
          rows="4"
          v-model="message"
        ></textarea>
        <div class="btn">
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
  border-bottom: 1px solid #ddd;
  font-size: 0.8rem;
  padding: 5px 0;
  margin: 1rem 0;
  width: 100%;
  color: black;
}

input:focus,
textarea:focus {
  background-color: snow;
}

.btn {
  width: 100%;
  text-align: right;
}
</style>
