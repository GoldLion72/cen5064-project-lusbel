import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createWebHistory } from 'vue-router'
import { workoutOptions } from '../config/workoutOptions.js'

// FullCalendar does not render in jsdom, so replace the calendar with a simple stub
vi.mock('../components/CalendarView.vue', () => ({
  default: { name: 'CalendarView', template: '<div data-test="calendar-view">Calendar</div>' }
}))

// The shared auth store talks to the server through authApi; fake it so the user is logged in.
const testUser = { id: 'user-1', email: 'tester@example.com' }
vi.mock('../services/authApi.js', () => ({
  me: vi.fn(async () => testUser),
  login: vi.fn(async () => testUser),
  register: vi.fn(async () => testUser),
  logout: vi.fn(async () => ({}))
}))

import App from '../App.vue'
import { routes, createAppRouter } from '../main.js'
import { createAuthStore } from '../composables/useAuth.js'

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
    expect(wrapper.text()).toContain('Criteria')
    expect(wrapper.find('[data-test="calendar-view"]').exists()).toBe(false)
  })

  it('passes props to ProgressView at /progress', async () => {
    const { wrapper } = await mountAt('/progress');
    const props = wrapper.findComponent({name: 'ProgressView'}).props();
    expect(props.exerciseOptions).toEqual(workoutOptions.exerciseOptions);
    expect(props.metricOptions).toEqual(workoutOptions.metricOptions);
  })

  it('loads the correct view when a tab is clicked', async () => {
    const { wrapper, router } = await mountAt('/calendar')

    await tab(wrapper, 'Progress').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/progress')
    expect(wrapper.text()).toContain('Criteria')
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

  it('updates the URL via the History API', async () => {
    window.history.replaceState(null, '', '/calendar')
    const { wrapper } = await mountAt('/calendar', createWebHistory())
    const pushState = vi.spyOn(window.history, 'pushState')

    await tab(wrapper, 'Progress').trigger('click')
    await flushPromises()

    expect(pushState).toHaveBeenCalled()
    expect(window.location.pathname).toBe('/progress')
    pushState.mockRestore()
  })

  describe('ProgressView Route', () => {
    it('should pass the exerciseOptions and metricOptions props', async () => {

    })
  })
})

describe('auth routes', () => {
  it('defines login and create account routes', () => {
    const paths = routes.map(r => r.path)
    expect(paths).toContain('/login')
    expect(paths).toContain('/createaccount')
  })

  it('shows the logged-in user and the menu', async () => {
    const { wrapper } = await mountAt('/calendar')
    expect(wrapper.find('[data-test="current-user"]').text()).toBe(testUser.email)
    expect(wrapper.find('.menu-list').exists()).toBe(true)
  })
})

describe('auth guard', () => {
  // A separate store whose fake API decides whether someone is logged in.
  const routerWith = async (path, user) => {
    const me = vi.fn(async () => { if (!user) throw new Error('401'); return user })
    const auth = createAuthStore({ me })
    const router = createAppRouter(createMemoryHistory(), auth)
    router.push(path)
    await router.isReady()
    return { router, auth, me }
  }

  it('sends a logged-out user from /calendar to /login with a redirect back', async () => {
    const { router } = await routerWith('/calendar', null)
    expect(router.currentRoute.value.path).toBe('/login')
    expect(router.currentRoute.value.query.redirect).toBe('/calendar')
  })

  it('sends a logged-out user from /progress to /login', async () => {
    const { router } = await routerWith('/progress', null)
    expect(router.currentRoute.value.path).toBe('/login')
    expect(router.currentRoute.value.query.redirect).toBe('/progress')
  })

  it('sends a logged-out user from / to /login', async () => {
    const { router } = await routerWith('/', null)
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('lets a logged-out user open /login and /createaccount', async () => {
    const { router } = await routerWith('/createaccount', null)
    expect(router.currentRoute.value.path).toBe('/createaccount')
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('sends a logged-in user away from /login and /createaccount', async () => {
    const { router } = await routerWith('/login', testUser)
    expect(router.currentRoute.value.path).toBe('/calendar')
    await router.push('/createaccount')
    expect(router.currentRoute.value.path).toBe('/calendar')
  })

  it('asks the server who is logged in only once', async () => {
    const { router, auth, me } = await routerWith('/calendar', testUser)
    await router.push('/progress')
    await router.push('/calendar')
    expect(auth.isAuthenticated.value).toBe(true)
    expect(me).toHaveBeenCalledTimes(1)
  })
})
