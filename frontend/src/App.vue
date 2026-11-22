<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth.js'

const router = useRouter()
const { currentUser, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item">
        WholeFit
      </a>
    </div>
    <div class="navbar-end" v-if="isAuthenticated">
      <span class="navbar-item" data-test="current-user">{{ currentUser.email }}</span>
      <div class="navbar-item">
        <button class="button is-light" data-test="logout-btn" @click="handleLogout">Log out</button>
      </div>
    </div>
  </nav>
  <div class="columns" v-if="isAuthenticated">
    <div class="column is-2">
      <aside class="menu">
        <p class="menu-label">General</p>
        <ul class="menu-list">
          <li>
            <RouterLink to="/calendar" active-class="is-active">Calendar</RouterLink>
          </li>
          <li>
            <RouterLink to="/progress" active-class="is-active">Progress</RouterLink>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-10">
      <main>
        <RouterView/>
      </main>
    </div>
  </div>
  <main v-else>
    <RouterView/>
  </main>
</template>
