import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import CalendarView from './components/CalendarView.vue'
import ProgressView from './components/ProgressView.vue'
import { workoutOptions } from './config/workoutOptions.js'
import CreateAccountView from './components/CreateAccountView.vue'
import LoginView from './components/LoginView.vue'
import { useAuth } from './composables/useAuth.js'
import { createAuthGuard } from './router/authGuard.js'
const {exerciseOptions, metricOptions} = workoutOptions

export const routes = [
  { path: '/', redirect: '/calendar' },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/createaccount', name: 'createaccount', component: CreateAccountView, meta: { guestOnly: true } },
  { path: '/calendar', name: 'calendar', component: CalendarView, meta: { requiresAuth: true } },
  { path: '/progress', name: 'progress', component: ProgressView, props: {exerciseOptions, metricOptions}, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/calendar' }
]

export const createAppRouter = (history = createWebHistory(), auth = useAuth()) => {
  const router = createRouter({ history, routes })
  router.beforeEach(createAuthGuard(auth))
  return router
}

// Only mount when the #app element exists, so tests can import routes without mounting
if (document.querySelector('#app')) {
  createApp(App).use(createAppRouter()).mount('#app')
}
