import { createRouter, createWebHistory } from "vue-router";

import LandingPage from './pages/LandingPage.vue';
import ServicesPrices from './pages/ServicesPrices.vue';
import ContactForm from './pages/ContactForm.vue';
import BookingForm from './pages/BookingForm.vue';
import LogIn from './pages/LogIn.vue';
import PortfolioCat from './pages/PortfolioCat.vue';
import AdminPanel from './pages/AdminPanel.vue';
import store from './store/index.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //generate a route for not found pages
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
  scrollBehavior() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    });
  },
});

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
