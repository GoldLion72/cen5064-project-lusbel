<script setup>
import { useLogin } from '../composables/useLogin';

const {email, password, hasError, login} = useLogin();

</script>

<template>
    <div class="hero is-fullheight">
        <div class="hero-head">
            <div class="container">
                <div class="box">
                    <p class="title">Login</p>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left">
                            <input class="input" type="text" placeholder="Email" v-model="email" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope"></i>
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

                    <div class="buttons">
                        <button id="signInBtn" class="button is-primary" @click="login">Sign In</button>
                    </div>

                    <p class="help is-danger" v-if="hasError">Invalid email or password.</p>
                    <RouterLink to="/createaccount">Don't have an account? Sign up here.</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>