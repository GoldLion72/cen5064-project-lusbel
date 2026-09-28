import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createWebHistory } from 'vue-router'

// FullCalendar does not render in jsdom, so replace the calendar with a simple stub
vi.mock('../components/CalendarView.vue', () => ({
  default: { name: 'CalendarView', template: '<div data-test="calendar-view">Calendar</div>' }
}))

import App from '../App.vue'
import { routes, createAppRouter } from '../main.js'

const mountAt = async (path, history = createMemoryHistory()) => {
  const router = createAppRouter(history)
  router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] }, attachTo: document.body })
  return { wrapper, router }
}

const tab = (wrapper, label) =>
  wrapper.findAll('.menu-list a').find(a => a.text() === label)

describe('route configuration', () => {
  it('defines calendar and progress routes', () => {
    const paths = routes.map(r => r.path)
    expect(paths).toContain('/calendar')
    expect(paths).toContain('/progress')
  })

  it('does not define a login route', () => {
    expect(routes.map(r => r.path)).not.toContain('/login')
  })
})

describe('routing', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('redirects / to /calendar', async () => {
    const { wrapper, router } = await mountAt('/')
    expect(router.currentRoute.value.path).toBe('/calendar')
    expect(wrapper.find('[data-test="calendar-view"]').exists()).toBe(true)
  })

  it('redirects unknown paths to /calendar', async () => {
    const { router } = await mountAt('/does-not-exist')
    expect(router.currentRoute.value.path).toBe('/calendar')
  })

  it('loads CalendarView at /calendar', async () => {
    const { wrapper } = await mountAt('/calendar')
    expect(wrapper.find('[data-test="calendar-view"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Progress tracking')
  })

  it('loads ProgressView at /progress', async () => {
    const { wrapper } = await mountAt('/progress')
    expect(wrapper.text()).toContain('Progress tracking')
    expect(wrapper.find('[data-test="calendar-view"]').exists()).toBe(false)
  })

  it('loads the correct view when a tab is clicked', async () => {
    const { wrapper, router } = await mountAt('/calendar')

    await tab(wrapper, 'Progress').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/progress')
    expect(wrapper.text()).toContain('Progress tracking')
    expect(wrapper.find('[data-test="calendar-view"]').exists()).toBe(false)

    await tab(wrapper, 'Calendar').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/calendar')
    expect(wrapper.find('[data-test="calendar-view"]').exists()).toBe(true)
  })
})

describe('active tab highlighting', () => {
  it('highlights only the Calendar tab on /calendar', async () => {
    const { wrapper } = await mountAt('/calendar')
    expect(tab(wrapper, 'Calendar').classes()).toContain('is-active')
    expect(tab(wrapper, 'Progress').classes()).not.toContain('is-active')
  })

  it('moves the highlight to the clicked tab', async () => {
    const { wrapper } = await mountAt('/calendar')
    await tab(wrapper, 'Progress').trigger('click')
    await flushPromises()
    expect(tab(wrapper, 'Progress').classes()).toContain('is-active')
    expect(tab(wrapper, 'Calendar').classes()).not.toContain('is-active')
  })
})

describe('no page reload on tab switch', () => {
  it('renders tabs as links with real hrefs', async () => {
    const { wrapper } = await mountAt('/calendar')
    expect(tab(wrapper, 'Calendar').attributes('href')).toBe('/calendar')
    expect(tab(wrapper, 'Progress').attributes('href')).toBe('/progress')
  })

  it('prevents the default browser navigation on click', async () => {
    const { wrapper } = await mountAt('/calendar')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    tab(wrapper, 'Progress').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('updates the URL via the History API and keeps the same app instance', async () => {
    window.history.replaceState(null, '', '/calendar')
    const { wrapper } = await mountAt('/calendar', createWebHistory())
    const navbarBefore = wrapper.find('.navbar').element
    const pushState = vi.spyOn(window.history, 'pushState')

    await tab(wrapper, 'Progress').trigger('click')
    await flushPromises()

    expect(pushState).toHaveBeenCalled()
    expect(window.location.pathname).toBe('/progress')
    // Same DOM node means the app was not torn down and re-rendered by a reload
    expect(wrapper.find('.navbar').element).toBe(navbarBefore)
    pushState.mockRestore()
  })
})
