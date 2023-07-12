<template>
  <div class="btn">
    <slot></slot>
  </div>
  <!-- <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link> -->
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
      default: "/",
    },
  },
};
</script>

<style scoped>
.btn {
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 250px;
  cursor: pointer;
  color: #000000;
  transition: all 0.5s;
  position: relative;
}

.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(231, 231, 231, 0.5);
  transition: all 0.5s;
}
.btn:hover::before {
  opacity: 0;
  transform: scale(0.5, 0.5);
}
.btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: all 0.3s;
  border: 1px solid rgba(8, 8, 8, 0.5);
  transform: scale(1.2, 1.2);
}
.btn:hover::after {
  opacity: 1;
  transform: scale(1, 1);
}

/* button,
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
  background-color: rgb(207, 226, 209);
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
} */
</style>
