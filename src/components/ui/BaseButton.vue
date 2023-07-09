<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
  export default {
    props: {
      mode: {
        type: String,
        required: false,
        default: null,
      },
      link: {
        type: Boolean,
        required: false,
        default: false,
      },
      to: {
        type: String,
        required: false,
        default: '/',
      }
    }
  }
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem;
  font: inherit;
  color: rgb(0, 0, 0);
  cursor: pointer;
  margin-right: 0.5rem;
  display: inline-block;
  letter-spacing: 0.1rem;
  font-size: 0.8rem;
  background-color: #fff;
  border: 0.05em solid #000000;
  border-radius: 2px;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: snow;
  border: 0.05em solid #000000;
}

.flat {
  background-color: transparent;
  color: #3a0061;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>