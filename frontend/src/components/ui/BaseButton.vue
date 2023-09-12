<template>
  <div class="btn"><slot></slot></div>
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
/* Button */
/* .btn {
  padding: 0.5rem;
  background-color: #fff;
  color: #000;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  transition: all 0.2s ease;
  padding: 1rem;
  border: 1px solid #f79f9f;
  border-radius: 3px;
  cursor: pointer;
}

.btn:hover {
  border: 1px solid #000;
} */

.btn {
  font-family: Typewriter-light;
  font-weight: 500;
  letter-spacing: 0.05rem;
  font-size: .8rem;
  color: #000;
  padding: 0.5rem 3rem;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 3px;
  width: fit-content;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}
.btn:hover {
  border: 1px solid #f79f9f;
}
</style>
