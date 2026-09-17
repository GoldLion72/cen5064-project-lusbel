<script setup>
import {ref} from 'vue'

const username = ref("")
const password = ref("")

const login = () => {
    // do API call here
}
</script>

<template>
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Login</p>
        </header>
        <div class="card-content">
            <div class="content">
                <div class="field">
                    <label class="label">Username</label>
                    <div class="contral has-icons-left">
                        <input class="input" type="text" placeholder="Username" v-model="username" />
                        <span class="icon is-small is-left">
                            <i class="fa-sold fa-user"></i>
                        </span>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left">
                        <input class="input" type="password" placeholder="Password" v-model="password" />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-lock"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>