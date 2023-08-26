<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card{
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  /* box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); */
  padding: 1rem;
  /* margin: 2rem auto; */
  /* max-width: 50rem; */
}
</style>