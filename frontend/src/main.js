import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import CalendarView from './components/CalendarView.vue'
import ProgressView from './components/ProgressView.vue'

export const routes = [
  { path: '/', redirect: '/calendar' },
  { path: '/calendar', name: 'calendar', component: CalendarView },
  { path: '/progress', name: 'progress', component: ProgressView },
  { path: '/:pathMatch(.*)*', redirect: '/calendar' }
]

export const createAppRouter = (history = createWebHistory()) =>
  createRouter({ history, routes })

// Only mount when the #app element exists, so tests can import routes without mounting
if (document.querySelector('#app')) {
  createApp(App).use(createAppRouter()).mount('#app')
}
