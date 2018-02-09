<template>
    <v-container>
        <v-layout row v-if="error">
            <v-flex xs12 sm8>
                <app-alert @dismissed="onDismiss" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm8>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <v-form @submit.prevent="onSignUp" lazy-validation id='form'>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                        name="email"
                                        label="Mail"
                                        id="email"
                                        v-model="email"
                                        type="email"
                                        :rules="emailRules"
                                        required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                        name="password"
                                        label="Password"
                                        id="password"
                                        v-model="password"
                                        type="password"     
                                        required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                        name="confirmPassword"
                                        label="Confirm password"
                                        id="confirm_password"
                                        v-model="confirmPassword"
                                        :rules="[comparePasswords]"
                                        type="password"
                                        required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn flat class="accent" 
                                        dark type="submit"
                                        :disabled="!valid">
                                            Sign up
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    
    export default {
        data () {
            return {
                form: null,
                email: '',
                password: '',
                confirmPassword: '',
                emailRules: [
                    (v) => !!v || 'E-mail is required',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(v) || 'E-mail must be valid'
                ]
            }
        },
        computed: {
            comparePasswords () {
                return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
            },
            valid () {
                return this.email && 
                this.password && 
                this.confirmPassword && 
                !this.comparePasswords &&
                this.emailRules[1](this.email) === true
            },
            ...mapGetters(['user', 'error']),
        },
        watch: {
            user (value) {
                if (value !== null && value !== undefined) {
                    this.$router.push('/')
                }
            }
        },
        methods: {
            onSignUp () {
                const user = {
                    email: this.email,
                    password: this.password
                }
                this.$store.dispatch('signUserUp', user)
            },
            onDismiss () {
                this.$store.dispatch('clearError')
            } 
        }
    }
</script>
