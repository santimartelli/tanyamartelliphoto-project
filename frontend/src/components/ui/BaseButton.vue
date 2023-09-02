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
.btn {
  display: inline-block;
  padding: 1rem 0.5rem;
  background-color: #fff;
  color: #000;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  transition: all 0.2s ease;
  text-transform: uppercase;
  padding: 1rem;
  border: 1px solid #f79f9f;
  border-radius: 3px;
  cursor: pointer;
}

.btn:hover {
  border: 1px solid #000;
}
</style>
