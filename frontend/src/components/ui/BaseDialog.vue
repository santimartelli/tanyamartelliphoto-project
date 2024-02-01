<!-- Componente que es la base de los dialogos del sitio -->

<template>
  <!-- La etiqueta 'teleport' permite que el contenido de este componente se renderice en el elemento que se le indique en el atributo 'to' -->
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="show">
        <section class="content">
          <slot></slot>
          <base-button @click="tryClose">Close</base-button>
        </section>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
export default {
  /**
   * Propiedades que recibe el componente.
   * @prop {boolean} show - Indica si el dialogo se muestra o no.
   * @prop {string} title - Título del dialogo.
   * @prop {boolean} fixed - Indica si el dialogo es fijo o no.
   */
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  /**
   * Emite el evento 'close' cuando se cierra el dialogo. Lo que permite que el
   * componente que use este componente pueda reaccionar a este evento.
   */
  emits: ["close"],
  methods: {
    /**
     * Cierra el dialogo si no es fijo y emite el evento 'close'.
     */
    tryClose() {
      if (this.fixed) {
        return;
      }
      this.$emit("close");
    },
  },
};
</script>

<style scoped>

/* Estilos para el componente BaseDialog.vue */

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 100;
}

dialog {
  font-family: typewriter-light;
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 5px;
  border: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #fff;
}

section {
  padding: 2rem;
}

.content {
  color: red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active {
  transition: all 0.2s ease-out;
}

.dialog-leave-active {
  transition: all 0.2s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>
