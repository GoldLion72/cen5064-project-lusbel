<script setup>
import { useLogin } from '../composables/useLogin';

const {email, password, errorMessage, isSubmitting, login} = useLogin();

</script>

<template>
    <div class="hero is-fullheight">
        <div class="hero-head">
            <div class="container">
                <form class="box" @submit.prevent="login" novalidate>
                    <p class="title">Login</p>
                    <div class="field">
                        <label class="label" for="emailInput">Email</label>
                        <div class="control has-icons-left">
                            <input id="emailInput" class="input" type="email" placeholder="Email" autocomplete="email" v-model="email" />
                            <span class="icon is-small is-left">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="passwordInput">Password</label>
                        <div class="control has-icons-left">
                            <input id="passwordInput" class="input" type="password" placeholder="Password" autocomplete="current-password" v-model="password" />
                            <span class="icon is-small is-left">
                                <i class="fa-solid fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <p class="help is-danger" v-if="errorMessage" role="alert">{{ errorMessage }}</p>
                    <div class="buttons">
                        <button id="signInBtn" type="submit" class="button is-primary" :class="{'is-loading': isSubmitting}" :disabled="isSubmitting">Sign In</button>
                    </div>

                    <RouterLink to="/createaccount">Don't have an account? Sign up here.</RouterLink>
                </form>
            </div>
        </div>
    </div>
</template>
