// Navigation guard: decides where a user may go based on login state.
// It receives the auth store instead of importing it, so tests can pass a fake.
export function createAuthGuard(auth) {
    return async (to) => {
        await auth.ensureLoaded();
        const loggedIn = auth.isAuthenticated.value;

        if(to.meta.requiresAuth && !loggedIn) {
            return {name: 'login', query: {redirect: to.fullPath}};
        }

        if(to.meta.guestOnly && loggedIn) {
            return {name: 'calendar'};
        }

        return true;
    };
}
