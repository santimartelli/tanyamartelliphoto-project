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
  <section class="contactDetails">
      <p>+34 682 833 107</p>
      <p>tanyamartelliphoto@gmail.com</p>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
.redes-sociales {
  height: 85px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
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
  display: block;
}

.redes-sociales img:hover {
  opacity: 1;
}

.contactDetails {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 85px;
}

.contactDetails p {
  padding: 0 1rem;
  font-size: 11px;
  opacity: 0.7;
}
</style>



