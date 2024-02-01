<!-- Componente que muestra los créditos del sitio -->

<template>
  <div class="footer">
    <p>
      Site by <a href="https://www.linkedin.com/in/santiagomartelli/" target="_blank">Santiago Martelli</a> &#169; 2024
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>

/* Estilos para el componente FooterCredits.vue */

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.footer {
  text-align: center;
  background-color: rgb(226, 226, 226);
  max-height: 40px;
}

.footer p {
  font-size: 0.7rem;
  color: #000;
  text-align: center;
}

.footer p a {
  color: #000;
  text-decoration: none;
}

.footer p a:hover {
  color: #00065d;
}


</style>