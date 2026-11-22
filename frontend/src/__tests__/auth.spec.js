import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent } from 'vue'
import { useLogin } from '../composables/useLogin.js'
import { useCreateAccount } from '../composables/useCreateAccount.js'
import { createAuthStore } from '../composables/useAuth.js'
import { ApiError, requestJson } from '../services/apiClient.js'
import LoginView from '../components/LoginView.vue'
import CreateAccountView from '../components/CreateAccountView.vue'

const user = { id: 'user-1', email: 'a@b.com' }

const makeRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', component: { template: '<div/>' } },
    { path: '/calendar', component: { template: '<div/>' } },
    { path: '/progress', component: { template: '<div/>' } }
  ]
})

// Runs a composable inside a component so useRouter()/useRoute() work.
const withSetup = async (composable, startPath = '/login') => {
  const router = makeRouter()
  router.push(startPath)
  await router.isReady()
  let result
  mount(defineComponent({ setup() { result = composable(); return () => null } }), { global: { plugins: [router] } })
  return { result, router }
}

const fakeAuth = (overrides = {}) => ({
  login: vi.fn(async () => user),
  register: vi.fn(async () => user),
  ...overrides
})

describe('useLogin', () => {
  it('rejects an invalid email without calling the server', async () => {
    const auth = fakeAuth()
    const { result } = await withSetup(() => useLogin({ auth }))
    result.email.value = 'nope'
    result.password.value = 'password123'

    await result.login()

    expect(result.errorMessage.value).toBe('Please enter a valid email address.')
    expect(auth.login).not.toHaveBeenCalled()
  })

  it('logs in and goes to /calendar by default', async () => {
    const auth = fakeAuth()
    const { result, router } = await withSetup(() => useLogin({ auth }))
    result.email.value = 'a@b.com'
    result.password.value = 'password123'

    await result.login()

    expect(auth.login).toHaveBeenCalledWith('a@b.com', 'password123')
    expect(router.currentRoute.value.path).toBe('/calendar')
    expect(result.errorMessage.value).toBe('')
  })

  it('follows the redirect query after login', async () => {
    const { result, router } = await withSetup(() => useLogin({ auth: fakeAuth() }), '/login?redirect=/progress')
    result.email.value = 'a@b.com'
    result.password.value = 'password123'

    await result.login()

    expect(router.currentRoute.value.path).toBe('/progress')
  })

  it('ignores redirects that leave the app', async () => {
    const { result, router } = await withSetup(() => useLogin({ auth: fakeAuth() }), '/login?redirect=//evil.example')
    result.email.value = 'a@b.com'
    result.password.value = 'password123'

    await result.login()

    expect(router.currentRoute.value.path).toBe('/calendar')
  })

  it('shows the server message on failure and stays on the page', async () => {
    const auth = fakeAuth({ login: vi.fn(async () => { throw new ApiError(401, 'Invalid email or password.') }) })
    const { result, router } = await withSetup(() => useLogin({ auth }))
    result.email.value = 'a@b.com'
    result.password.value = 'wrongpass1'

    await result.login()

    expect(result.errorMessage.value).toBe('Invalid email or password.')
    expect(result.isSubmitting.value).toBe(false)
    expect(router.currentRoute.value.path).toBe('/login')
  })
})

describe('useCreateAccount', () => {
  const fill = (result, { email = 'a@b.com', password = 'password123', confirm = password } = {}) => {
    result.email.value = email
    result.password.value = password
    result.confirmPassword.value = confirm
  }

  it('rejects a weak password', async () => {
    const auth = fakeAuth()
    const { result } = await withSetup(() => useCreateAccount({ auth }))
    fill(result, { password: 'short' })

    await result.createAccount()

    expect(result.errorMessage.value).toMatch(/at least 8 characters/)
    expect(auth.register).not.toHaveBeenCalled()
  })

  it('rejects mismatched passwords', async () => {
    const auth = fakeAuth()
    const { result } = await withSetup(() => useCreateAccount({ auth }))
    fill(result, { confirm: 'password124' })

    await result.createAccount()

    expect(result.errorMessage.value).toBe('Passwords do not match.')
    expect(auth.register).not.toHaveBeenCalled()
  })

  it('registers and goes to /calendar', async () => {
    const auth = fakeAuth()
    const { result, router } = await withSetup(() => useCreateAccount({ auth }))
    fill(result)

    await result.createAccount()

    expect(auth.register).toHaveBeenCalledWith('a@b.com', 'password123')
    expect(router.currentRoute.value.path).toBe('/calendar')
  })

  it('shows a taken-email error from the server', async () => {
    const auth = fakeAuth({ register: vi.fn(async () => { throw new ApiError(409, 'An account with that email already exists.') }) })
    const { result } = await withSetup(() => useCreateAccount({ auth }))
    fill(result)

    await result.createAccount()

    expect(result.errorMessage.value).toBe('An account with that email already exists.')
  })
})

describe('auth store', () => {
  it('tracks login and logout', async () => {
    const api = { me: vi.fn(), login: vi.fn(async () => user), register: vi.fn(), logout: vi.fn(async () => ({})) }
    const auth = createAuthStore(api)

    await auth.login('a@b.com', 'password123')
    expect(auth.isAuthenticated.value).toBe(true)
    expect(auth.currentUser.value).toEqual(user)

    await auth.logout()
    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.currentUser.value).toBeNull()
  })

  it('treats a failed /me call as logged out', async () => {
    const auth = createAuthStore({ me: vi.fn(async () => { throw new ApiError(401, 'Not logged in.') }) })

    await auth.ensureLoaded()

    expect(auth.isAuthenticated.value).toBe(false)
  })
})

describe('apiClient.requestJson', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sends credentials and JSON, and unwraps data', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ success: true, data: user }) }))
    vi.stubGlobal('fetch', fetchMock)

    const data = await requestJson('/auth/login', { method: 'POST', body: { email: 'a@b.com' } })

    expect(data).toEqual(user)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:3000/api/auth/login')
    expect(options.credentials).toBe('include')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ email: 'a@b.com' })
  })

  it('throws ApiError with the server message and status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 409, json: async () => ({ success: false, message: 'Taken.' }) })))

    await expect(requestJson('/auth/register', { method: 'POST', body: {} })).rejects.toMatchObject({ status: 409, message: 'Taken.' })
  })

  it('throws a friendly ApiError when the server is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))

    await expect(requestJson('/auth/me')).rejects.toMatchObject({ status: 0 })
  })
})

describe('auth views', () => {
  let router
  beforeEach(async () => {
    router = makeRouter()
    router.addRoute({ path: '/createaccount', component: { template: '<div/>' } })
    router.push('/login')
    await router.isReady()
  })

  it('LoginView shows a validation error when submitted empty', async () => {
    const wrapper = mount(LoginView, { global: { plugins: [router] } })

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Please enter a valid email address.')
  })

  it('CreateAccountView has a confirm password field and shows mismatch errors', async () => {
    const wrapper = mount(CreateAccountView, { global: { plugins: [router] } })

    await wrapper.find('#emailInput').setValue('a@b.com')
    await wrapper.find('#passwordInput').setValue('password123')
    await wrapper.find('#confirmPasswordInput').setValue('different1')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Passwords do not match.')
  })
})
