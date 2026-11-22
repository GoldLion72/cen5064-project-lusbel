import {ref} from'vue';
import { useRouter } from 'vue-router';

export function useCreateAccount() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const hasError = ref(false);

    const createAccount = () => {
        router.push('/login');
    }

    return {
        email,
        password,
        hasError,
        createAccount
    }
}