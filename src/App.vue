<script setup>
import {ref} from 'vue'
import CalendarView from './components/CalendarView.vue'

const activeTab = ref("")
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
            <a :class="{'is-active': activeTab === 'calendar'}" @click="activeTab='calendar'">Calendar</a>
          </li>
          <li>
            <a :class="{'is-active': activeTab === 'progress'}" @click="activeTab='progress'">Progress</a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-10">
      <main>
        <CalendarView v-if="activeTab === 'calendar'"/>
      </main>
    </div>
  </div>
</template>
