<template>
  <div class="container-login">
    <img src="https://scontent-bcn1-1.xx.fbcdn.net/v/t39.30808-6/290960090_430784209059409_970148872348183412_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=932fsWpOOwwAX_DkQSz&_nc_ht=scontent-bcn1-1.xx&oh=00_AfCiCtQJi-ehudI-pw9B2l9NJoTi0wZqYTnWbPMBlcJICg&oe=64FEFE5F" alt="Logo Tanya Martelli Photography">
    <form @submit.prevent="submitForm">
      <input type="text" v-model="username" id="username" placeholder="Username" />
      <input type="password" v-model="password" id="password" placeholder="Password" />
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      });
      this.$router.replace({ name: 'admin' });
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
  margin-bottom: 20px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #eee;
}

</style>
