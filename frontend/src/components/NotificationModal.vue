<script setup>
import { onMounted } from 'vue';

const props = defineProps(['title', 'message', 'isNotificationActive']);
const emit = defineEmits('closeNotification')
const model = defineModel();

const closeNotification = () => {
    emit('closeNotification', false);
}

onMounted(() => {
    console.log("Mounted NotificationModal")
})
</script>

<template>
<div id="errorModal" class="modal" :class="{'is-active': props.isNotificationActive}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <div class="modal-card-head">
            <p class="modal-card-title">{{ props.title }}</p>
            <button class="delete" @click="closeNotification"></button>
        </div>
        <div class="modal-card-body">
            <p>{{ props.message }}</p>
        </div>
        <div class="modal-card-foot">
            <div class="buttons">
                <button class="button" @click="closeNotification">Ok</button>
            </div>
        </div>
    </div>
</div>
</template>