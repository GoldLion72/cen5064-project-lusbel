import {ref, reactive, watch} from 'vue';

export function useNotification() {
    const createEmptyNotification = () => ({
        notificationTitle: "",
        notificationMessage: ""
    });

    const notification = reactive(createEmptyNotification());
    const showNotification = ref(false);

    const setNotification = (data) => {
        Object.assign(notification, data);
    }

    watch(showNotification, (isOpen) => {
        if(!isOpen) {
            setNotification(createEmptyNotification());
        }
    })

    return {notification, showNotification, setNotification};
}