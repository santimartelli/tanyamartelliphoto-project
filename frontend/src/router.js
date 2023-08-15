import { createRouter, createWebHistory } from "vue-router";

import LandingPage from '../src/components/pages/LandingPage.vue';
import AboutMe from './components/pages/AboutMe.vue';
import ContactForm from './components/pages/ContactForm.vue';
import PortfolioPage from './components/pages/PortfolioPage.vue';
import BookingForm from './components/pages/BookingForm.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home'},
    { path: '/home', name: 'home', component: LandingPage },
    { path: '/about', name: 'about', component: AboutMe },
    { path: '/contact', name: 'contact', component: ContactForm },
    { path: '/portfolio', name: 'portfolio', component: PortfolioPage },
    { path: '/booking', name: 'booking', component: BookingForm }
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

export default router;
