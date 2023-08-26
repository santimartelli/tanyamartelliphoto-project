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
  background-color: #565656;
  border: 1px solid #332e2e;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.2rem;
  cursor: pointer;
  transition: .5s ease all;
}

.btn:hover {
  background-color: #332e2e;
  color: #f7bebe;
}

</style>
