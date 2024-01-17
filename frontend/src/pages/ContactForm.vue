<template>
  <div>
    <ok-dialog :show="!!okMessage" @close="closeSuccessMessage">
      <p>{{ okMessage }}</p>
    </ok-dialog>
    <div class="container">
      <h2>I would love to hear from you!</h2>
      <p>
        I truly appreciate your interest and consideration in my photography
        services! If you have any questions, want more information, or would
        like to get in touch with me, please don't hesitate to reach out using
        the contact form below. I'll respond to your message as soon as
        possible.
      </p>

      <div>
        <form @submit.prevent="addNewMessage">
          <input
            type="text"
            v-model.trim="newMessageName"
            name="messageName"
            id="messageName"
            placeholder="Name"
          />
          <div v-if="!formIsValidName" class="errors">
            Please enter a valid name
          </div>

          <input
            type="text"
            v-model.trim="newMessageEmail"
            id="messageEmail"
            placeholder="Email"
          />
          <div v-if="!formIsValidEmail" class="errors">
            Please enter a valid email address
          </div>

          <label for="messageContent">Message</label>
          <textarea
            id="messageContent"
            rows="10"
            name="messageContent"
            v-model.trim="newMessageContent"
          ></textarea>
          <div v-if="!formIsValidContent" class="errors">
            Please enter a message
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
    };
  },
  methods: {
    addNewMessage() {
      this.formIsValid = true;

      // Validate Name
      this.formIsValidName = !!this.newMessageName.trim();
      // Validate Email
      this.formIsValidEmail = this.isValidEmail(this.newMessageEmail.trim());
      // Validate Message Content
      this.formIsValidContent = !!this.newMessageContent.trim();

      // Check overall form validity
      this.formIsValid =
        this.formIsValidName &&
        this.formIsValidEmail &&
        this.formIsValidContent;

      if (this.formIsValid) {
        this.$store.dispatch("messages/addNewMessage", {
          messageName: this.newMessageName,
          messageEmail: this.newMessageEmail,
          messageContent: this.newMessageContent,
        });
        this.okMessage = "Your message has been sent successfully!";
      }
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    closeSuccessMessage() {
      // Reset the form and hide the success message
      this.newMessageName = "";
      this.newMessageEmail = "";
      this.newMessageContent = "";
      this.formIsValidName = true;
      this.formIsValidEmail = true;
      this.formIsValidContent = true;
      this.formIsValid = true;
      this.okMessage = null;
    },
  },
  created() {
    this.okMessage = null;
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

ok-dialog p{
  font-size: 1.2rem;
  color: #00aa55;
  padding: 1rem;
}

/* media queries */
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
