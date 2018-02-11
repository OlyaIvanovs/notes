<template>
    <v-container>
        <v-layout row wrap align-center v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular 
                    indeterminate 
                    :width="6"
                    :size="70"
                    color="primary">
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <template v-else>
            <v-layout row v-if="error">
                <v-flex xs12 sm8>
                    <app-alert @dismissed="onDismiss" :text="error.message"></app-alert>
                </v-flex>
            </v-layout>
            <v-layout row>
                <ul class="pb-5">
                    <li style="list-style-type: none;" 
                    v-for="(notification, i) in user.notifications" :key="i">
                        <v-alert 
                            color="warning" 
                            icon="info"
                            dismissible
                            @input="onClose(i)"
                            :value="true">
                            {{ notification.msg }}
                        </v-alert>
                    </li>
                </ul>
            </v-layout>
            <v-layout row>
                <v-flex xs12>
                    <h2 class="primary--text">My family</h2>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-list>
                    <v-list-tile v-for="(member,i) in members" :key="i" >
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ member.email }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <app-delete-member-dialog :memberId="member.id"></app-delete-member-dialog>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-layout>
            <v-layout row>
                <v-flex xs12 sm8>
                    <app-add-member-dialog></app-add-member-dialog>
                </v-flex>
            </v-layout>
        </template>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    data () {
        return {

        }
    },
    methods: {
        onDismiss () {
            this.$store.dispatch('clearError')
        },
        onClose (i) {
            this.$store.dispatch('removeNotification', {
                notificationId: this.user.notifications[i].key,
                userId: this.user.id
            })
            this.user.notifications.splice(i, 1)
        }
    },
    computed: {
            ...mapGetters(['members', 'loading', 'error', 'user']),
            members () {
                return this.$store.getters.members
            },
        }
}
</script>