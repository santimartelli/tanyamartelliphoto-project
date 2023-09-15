<template>
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="show">
        <header>
          <slot name="header">
            <h2>{{ title }}</h2>
            <slot name="actions">
              <img src="../../assets/Icons/borrar.svg" @click="tryClose">
            </slot>
          </slot>

          <!-- <menu v-if="!fixed">
           
          </menu> -->
        </header>
        <section class="content">
          <slot></slot>
        </section>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
export default {
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
  emits: ["close"],
  methods: {
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
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #fff;
}

header {
  background-color: #000;
  color: #fff;
  width: 100%;
  font-size: 0.7rem;
  padding: 0.9rem;
  border-bottom: 5px solid #f7bebe;
}

header h2 {
  margin: 0;
}

section {
  padding: 2rem;
}

.content {
  display: flex;
  justify-content: center;
}

/* menu {
  padding: 1rem;
  display: flex;
  justify-content: right;
  align-items: center;
  margin: 0;
} */

header img {
  width: 25px;
  height: auto;
  cursor: pointer;
  position: absolute;
  right: 12px;
  top: 12px;
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
