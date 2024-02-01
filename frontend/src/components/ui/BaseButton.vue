<!-- Componente que es la base para los botones del sitio -->

<template>
  <div class="btn">
    <!-- La etiqueta 'slot' reserva un espacio para que el componente que use este componente pueda inyectar contenido -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  /**
   * Propiedades que recibe el componente.
   * @prop {string} mode - Modo del botón.
   * @prop {boolean} link - Indica si el botón es un enlace.
   * @prop {string} to - Ruta a la que redirige el botón.
   */
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

/* Estilos para el componente BaseButton.vue */

.btn {
  font-family: Typewriter-light;
  font-weight: 500;
  letter-spacing: 0.05rem;
  font-size: 0.8rem;
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
