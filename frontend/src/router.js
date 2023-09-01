import { createRouter, createWebHistory } from "vue-router";

import LandingPage from './pages/LandingPage.vue';
import AboutMe from './pages/AboutMe.vue';
import ContactForm from './pages/ContactForm.vue';
import PortfolioPage from './pages/PortfolioPage.vue';
import BookingForm from './pages/BookingForm.vue';
import LogIn from './pages/LogIn.vue';
import PortfolioCat from './pages/PortfolioCat.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home'},
    { path: '/home', name: 'home', component: LandingPage },
    { path: '/about', name: 'about', component: AboutMe },
    { path: '/contact', name: 'contact', component: ContactForm },
    { path: '/portfolio', name: 'portfolio', component: PortfolioPage },
    { path: '/portfolio/:id', name: 'portfoliocat', component: PortfolioCat},
    { path: '/booking', name: 'booking', component: BookingForm },
    { path: '/access', name: 'access', component: LogIn }

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
