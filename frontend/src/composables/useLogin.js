import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useLogin() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const hasError = ref(false);

    const login = () => {
        //do login logic here
        router.push('/calendar');
    }

    return {
        email,
        password,
        hasError,
        login
    }
}