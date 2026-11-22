<script setup>
import { useCreateAccount } from '../composables/useCreateAccount';

const {email, password, confirmPassword, errorMessage, isSubmitting, createAccount} = useCreateAccount();

</script>

<template>
    <div class="hero is-fullheight">
        <div class="hero-head">
            <div class="container">
                <form class="box" @submit.prevent="createAccount" novalidate>
                    <p class="title">Create Account</p>
                    <div class="field">
                        <label class="label" for="emailInput">Email</label>
                        <div class="control has-icons-left">
                            <input id="emailInput" class="input" placeholder="Email" type="email" autocomplete="email" v-model="email" />
                            <span class="icon is-small is-left">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="passwordInput">Password</label>
                        <div class="control has-icons-left">
                            <input id="passwordInput" class="input" placeholder="Password" type="password" autocomplete="new-password" v-model="password"/>
                            <span class="icon is-small is-left">
                                <i class="fa-solid fa-lock"></i>
                            </span>
                        </div>
                        <p class="help">At least 8 characters, including a letter and a number.</p>
                    </div>

                    <div class="field">
                        <label class="label" for="confirmPasswordInput">Confirm Password</label>
                        <div class="control has-icons-left">
                            <input id="confirmPasswordInput" class="input" placeholder="Confirm Password" type="password" autocomplete="new-password" v-model="confirmPassword"/>
                            <span class="icon is-small is-left">
                                <i class="fa-solid fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <p class="help is-danger" v-if="errorMessage" role="alert">{{ errorMessage }}</p>
                    <div class="buttons">
                        <button id="createBtn" type="submit" class="button is-primary" :class="{'is-loading': isSubmitting}" :disabled="isSubmitting">Create</button>
                    </div>

                    <RouterLink to="/login">Already have an account? Log in here.</RouterLink>
                </form>
            </div>
        </div>
    </div>
</template>
