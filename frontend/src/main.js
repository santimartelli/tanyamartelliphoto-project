/**
 * @fileoverview Este archivo es el encargado de crear la aplicación de Vue,
 * la cual es el punto de entrada de la aplicación.
 */

/**
 * Importa todas las dependencias necesarias.
 */
import { createApp } from 'vue';
import store from './store/index.js';
import router from './router.js';
import App from './App.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
import BaseDialog from './components/ui/BaseDialog.vue';

/**
 * Crea la aplicación de Vue.
 * @returns {Object} - La aplicación de Vue.
 */
const app = createApp(App);

/**
 * Le dice a la aplicación que use el router.
 */
app.use(router);

/**
 * Le dice a la aplicación que use el store.
 */
app.use(store);

/**
 * Registra los componentes globales de la aplicación.
 */
app.component('base-button', BaseButton);
app.component('base-spinner', BaseSpinner);
app.component('base-dialog', BaseDialog);

/**
 * Monta la aplicación en el elemento con el ID app.
 */
app.mount('#app');

