import { ref, computed, readonly } from 'vue';
import * as defaultAuthApi from '../services/authApi.js';

// Login state for the whole app. createAuthStore takes the API as a parameter so tests
// can pass a fake; useAuth() returns one shared instance (ES module singleton).
export function createAuthStore(authApi = defaultAuthApi) {
    const currentUser = ref(null);
    const isAuthenticated = computed(() => currentUser.value !== null);
    let loadPromise = null;

    const setUser = (user) => {
        currentUser.value = user ?? null;
        loadPromise = Promise.resolve(currentUser.value);
        return currentUser.value;
    };

    // Asks the server who is logged in (the cookie is httpOnly, so JavaScript can't read it).
    const fetchCurrentUser = async () => {
        try {
            return setUser(await authApi.me());
        } catch {
            return setUser(null);
        }
    };

    // Runs fetchCurrentUser only once per page load; later calls reuse the result.
    const ensureLoaded = () => {
        loadPromise ??= fetchCurrentUser();
        return loadPromise;
    };

    const login = async (email, password) => setUser(await authApi.login(email, password));

    const register = async (email, password) => setUser(await authApi.register(email, password));

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
        }
    };

    return {
        currentUser: readonly(currentUser),
        isAuthenticated,
        ensureLoaded,
        fetchCurrentUser,
        login,
        register,
        logout
    };
}

let sharedStore = null;

export function useAuth() {
    sharedStore ??= createAuthStore();
    return sharedStore;
}
