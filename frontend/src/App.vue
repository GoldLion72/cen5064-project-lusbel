<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item">
        WholeFit
      </a>
    </div>
  </nav>
  <div class="columns">
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
</template>
