<script setup>
import { onMounted } from 'vue';

const props = defineProps(['title', 'message']);

const isNotificationActive = defineModel();

onMounted(() => {
    console.log("Mounted NotificationModal")
})
</script>

<template>
<div id="errorModal" class="modal" :class="{'is-active': isNotificationActive}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <div class="modal-card-head">
            <p class="modal-card-title">{{ props.title }}</p>
            <button class="delete" @click="isNotificationActive=false"></button>
        </div>
        <div class="modal-card-body">
            <p>{{ props.message }}</p>
        </div>
        <div class="modal-card-foot">
            <div class="buttons">
                <button class="button" @click="isNotificationActive=false">Ok</button>
            </div>
        </div>
    </div>
</div>
</template>