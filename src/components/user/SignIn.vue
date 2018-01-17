<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm8>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <v-form @submit.prevent="onSignIn" lazy-validation>
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
                                        :counter="10"
                                        required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn flat class="accent" 
                                        dark type="submit"
                                        :disabled="!valid">
                                            Sign in
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
    export default {
        data () {
            return {
                email: '',
                password: '',
                emailRules: [
                    (v) => !!v || 'E-mail is required',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(v) || 'E-mail must be valid'
                ]
            }
        },
        computed: {
            valid () {
                return this.email && 
                this.password && 
                this.emailRules[1](this.email) === true
            },
            user () {
                return this.$store.getters.user
            }
        },
        watch: {
            user (value) {
                if (value !== null && value !== undefined) {
                    this.$router.push('/')
                }
            }
        },
        methods: {
            onSignIn () {
                this.$store.dispatch('signUserIn', {
                    email: this.email,
                    password: this.password
                })
            } 
        }
    }
</script>

