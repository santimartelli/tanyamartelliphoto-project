<template>
  <section class="redes-sociales">
    <ul>
      <li>
        <a
          href="https://www.instagram.com/tanyamartelli_photo/"
          target="_blank"
          rel="noopener noreferrer"
          ><img src="../../assets/Icons/instagram.png" alt="Logo de Instagram"
        /></a>
      </li>
      <li>
        <a
          href="https://www.facebook.com/tanyamartelli/"
          target="_blank"
          rel="noopener noreferrer"
          ><img src="../../assets/Icons/facebook.png" alt="Logo de Facebook"
        /></a>
      </li>
      <li>
        <a
          href="https://www.linkedin.com/in/tatiana-martelli-3107587a/"
          target="_blank"
          rel="noopener noreferrer"
          ><img src="../../assets/Icons/linkedin.png" alt="Logo de Linkedin"
        /></a>
      </li>
      <li>
        <a
          href="https://wa.me/34682833107"
          target="_blank"
          rel="noopener noreferrer"
          ><img src="../../assets/Icons/whatsapp.png" alt="Logo de WhatsApp"
        /></a>
      </li>
    </ul>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
.redes-sociales {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.redes-sociales ul {
  display: flex;
  list-style: none;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.redes-sociales ul li {
  padding: 1rem;
}

.redes-sociales ul li a img {
  width: 25px;
  height: auto;
  opacity: 0.7;
}

.redes-sociales img:hover {
  opacity: 1;
}
</style>
