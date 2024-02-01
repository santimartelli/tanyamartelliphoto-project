import { createRouter, createWebHistory } from "vue-router";

import LandingPage from './pages/LandingPage.vue';
import ServicesPrices from './pages/ServicesPrices.vue';
import ContactForm from './pages/ContactForm.vue';
import BookingForm from './pages/BookingForm.vue';
import LogIn from './pages/LogIn.vue';
import PortfolioCat from './pages/PortfolioCat.vue';
import AdminPanel from './pages/AdminPanel.vue';
import store from './store/index.js';

/**
 * @fileoverview Este archivo es el encargado de crear el router de Vue,
 * el cual es el encargado de manejar las rutas de la aplicación.
 */

const router = createRouter({
  /**
   * Indica el modo de historia que se usará. En este caso se usará el modo
   * history, el cual usa el API de history del navegador para cambiar la URL
   * sin recargar la página y para mantener el estado de la página en el historial.
   */
  history: createWebHistory(),

  /**
   * Indica las rutas que tendrá la aplicación.
   * @property {string} path - La ruta de la página.
   * @property {string} name - El nombre de la ruta.
   * @property {Object} component - El componente que se renderizará cuando se visite la ruta.
   * @property {Object} meta - La metadata de la ruta.
   * @property {boolean} meta.requiresAuth - Indica si la ruta requiere autenticación.
   * @property {boolean} meta.requiresUnAuth - Indica si la ruta requiere que el usuario no esté autenticado.
   */
  routes: [
    { path: '/:notFound(.*)', redirect: '/home'},
    { path: '/', redirect: '/home'},
    { path: '/home', name: 'home', component: LandingPage },
    { path: '/prices', name: 'prices', component: ServicesPrices },
    { path: '/contact', name: 'contact', component: ContactForm },
    { path: '/portfolio/:id', name: 'portfoliocat', component: PortfolioCat},
    { path: '/booking', name: 'booking', component: BookingForm },
    { path: '/admin', name: 'admin', component: AdminPanel, meta: { requiresAuth: true }},
    { path: '/login', name: 'login', component: LogIn, meta: { requiresUnAuth: true }},

  ],

  /**
   * Indica el comportamiento del scroll cuando se cambia de ruta,
   * en este caso se indica que el scroll se posicione en la parte superior
   * de la página.
   */
  scrollBehavior() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    });
  },
});

/**
 * Indica que se ejecutará antes de cada cambio de ruta, en este caso se
 * indica que si la ruta requiere autenticación y el usuario no está autenticado
 * se redirija a la página de inicio de sesión, y si la ruta requiere que el usuario
 * no esté autenticado y el usuario está autenticado se redirija a la página de inicio.
 * @param {Object} to - La ruta a la que se va a cambiar.
 * @param {Object} _ - La ruta desde la que se va a cambiar.
 * @param {Function} next - La función que se debe llamar para continuar con el cambio de ruta.
 */
router.beforeEach((to, _, next) => {
  if(to.meta.requiresAuth && !store.getters.isAuthenticated){
    next('/login');
  } else if(to.meta.requiresUnAuth && store.getters.isAuthenticated){
    next('/home');
  } else {
    next();
  }
});

export default router;
