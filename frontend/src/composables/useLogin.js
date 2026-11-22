import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from './useAuth.js';
import { ApiError } from '../services/apiClient.js';
import { isValidEmail } from '../validation/accountRules.js';

const DEFAULT_REDIRECT = '/calendar';

// Only follow redirects to paths inside this app (blocks "//evil.com" and full URLs).
function safeRedirect(target) {
    return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')
        ? target
        : DEFAULT_REDIRECT;
}

export function useLogin({auth = useAuth()} = {}) {
    const router = useRouter();
    const route = useRoute();
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const isSubmitting = ref(false);

    const validate = () => {
        if(!isValidEmail(email.value)) return "Please enter a valid email address.";
        if(!password.value) return "Please enter your password.";
        return "";
    };

    const login = async () => {
        if(isSubmitting.value) return;

        errorMessage.value = validate();
        if(errorMessage.value) return;

        isSubmitting.value = true;
        try {
            await auth.login(email.value, password.value);
            await router.push(safeRedirect(route.query.redirect));
        } catch (error) {
            errorMessage.value = error instanceof ApiError ? error.message : "Could not log in. Please try again.";
        } finally {
            isSubmitting.value = false;
        }
    };

    return {
        email,
        password,
        errorMessage,
        isSubmitting,
        login
    };
}
