<!-- Componente que muestra el dialogo con el formulario para editar una categoria -->

<template>
  <teleport to="body">
  <div v-if="show" @click="close" class="backdrop3"></div>
    <transition name="dialog">
      <dialog open v-if="show">
        <div class="section">
          <h3>Nuevo nombre de la categoria</h3>
          <form @submit.prevent="submitForm">
            <slot></slot>
          </form>
        </div>
      </dialog>
    </transition>
</teleport>
</template>

<script>
/**
 * Componente que muestra el dialogo con el formulario para editar una categoria.
 * @vue-prop {boolean} show - Indica si el dialogo se muestra o no.
 * @vue-emits {close} - Emite el evento 'close' cuando se cierra el dialogo.
 * @vue-methods close - Cierra el dialogo y emite el evento 'close'.
 */
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close"],
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>

/* Estilos para el componente EditCategoryDialog.vue */

h3 {
  text-align: center;
  padding: 1rem;
}

.backdrop3 {
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
  height: auto;
  z-index: 999;
  border-radius: 5px;
  border: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
}

.section {
  width: 80%;
  margin: 0px auto;
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
