import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './useAuth.js';
import { ApiError } from '../services/apiClient.js';
import { isValidEmail, isStrongPassword, PASSWORD_RULE_MESSAGE } from '../validation/accountRules.js';

export function useCreateAccount({auth = useAuth()} = {}) {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const isSubmitting = ref(false);

    const validate = () => {
        if(!isValidEmail(email.value)) return "Please enter a valid email address.";
        if(!isStrongPassword(password.value)) return PASSWORD_RULE_MESSAGE;
        if(password.value !== confirmPassword.value) return "Passwords do not match.";
        return "";
    };

    // Registering also logs the user in (the server sets the auth cookie), so go straight to the app.
    const createAccount = async () => {
        if(isSubmitting.value) return;

        errorMessage.value = validate();
        if(errorMessage.value) return;

        isSubmitting.value = true;
        try {
            await auth.register(email.value, password.value);
            await router.push('/calendar');
        } catch (error) {
            errorMessage.value = error instanceof ApiError ? error.message : "Could not create account. Please try again.";
        } finally {
            isSubmitting.value = false;
        }
    };

    return {
        email,
        password,
        confirmPassword,
        errorMessage,
        isSubmitting,
        createAccount
    };
}
