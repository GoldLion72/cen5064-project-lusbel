<script setup>
</script>

<template>
    <div class="hero is-fullheight">
        <div class="hero-head">
            <div class="container">
                <div class="box">
                    <p class="title">Create Account</p>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left">
                            <input id="emailInput" class="input" type="text" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control has-icons-left">
                            <input id="passwordInput" class="input" type="password"/>
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <div class="buttons">
                        <button id="createBtn" class="button is-primary">Create</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>