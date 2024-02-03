<!-- Componente que muestra un dialogo sin formulario -->

<template>
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop1"></div>
    <transition name="dialog">
      <dialog open v-if="show">
        <section class="content">
          <slot></slot>
            <base-button @click="closeSuccessMessage">Cerrar</base-button>
        </section>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
/**
 * Componente que muestra un dialogo de feedback.
 * @vue-prop {boolean} show - Indica si el dialogo se muestra o no.
 * @vue-emits {close} - Emite el evento 'close' cuando se cierra el dialogo.
 * @vue-methods tryClose - Cierra el dialogo y emite el evento 'close'.
 * @vue-methods closeSuccessMessage - Cierra el dialogo y emite el evento 'close'.
 */
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      alertOk: false,
    };
  },
  emits: ["close"],
  methods: {
    tryClose() {
      if (this.alertOk) {
        // Resetea el estado de la alerta
        this.alertOk = 0;
      } else {
        this.$emit("close");
      }
    },
    closeSuccessMessage() {
      this.alertOk = 0;
      this.$emit("close");
    },
  },
};
</script>

<style scoped>

/* Estilos para el componente OkDialog.vue */

.backdrop1 {
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
  top: 12vh;
  left: 10%;
  width: 80%;
  z-index: 999;
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
  /* transform: scale(0); */
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
  /* transform: scale(1); */
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>
