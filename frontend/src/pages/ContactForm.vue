<template>
  <div class="container">
    <h2>I would love to hear from you!</h2>
    <p>
      I truly appreciate your interest and consideration in my photography
      services! If you have any questions, want more information, or would like
      to get in touch with me, please don't hesitate to reach out using the
      contact form below. I'll respond to your message as soon as possible.
    </p>

    <div>
      <form>
        <input
          type="text"
          v-model="name"
          name="name"
          id="name"
          placeholder="Name"
        />
        <input
          type="text"
          v-model="email"
          id="email"
          placeholder="Email"
          />
          <label for="message">Message</label>
        <textarea
          id="message"
          rows="10"
          name="message"
          v-model="message"
        ></textarea>
        <div class="btn-container">
          <base-button @click="submitForm" value="Enviar">Enviar</base-button>
        </div>
      </form>
    </div>
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
.container {
  width: 60%;
  margin: 0 auto; /* Center the container */
  padding: 20px; /* Add some padding for spacing */
}

h2 {
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
  border: 1px solid #ccc;;
}

label {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: .65;
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

/* media queries */
@media (max-width: 855px) {
  .container{
    width: 98%;
  }
}

@media (max-width: 1235px) {
  form{
    width: 100%;
  }
}

</style>
