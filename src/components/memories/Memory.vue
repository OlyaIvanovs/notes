<template>
    <v-container>
        <v-layout row wrap  v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular 
                :width="7"
                :size="70"
                indeterminate color="primary">
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-space-between v-else>
            <template v-if="memory">
                <v-flex xs5>
                    <template v-if="info">
                        <app-alert @dismissed="onDismiss" :text="info.msg" :color="info.clr"></app-alert>
                    </template>
                    <v-card>
                        <v-card-title>
                            <div>
                                <h2 class="primary--text">{{ memory.title }}</h2>
                                <span class="grey--text">{{ memory.date | date }}</span><br>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            {{ memory.note }}
                        </v-card-text>
                        <v-card-actions v-if="!memory.shared">
                            <v-spacer></v-spacer>
                            <app-share-memory-dialog :memoryId="memory.id"></app-share-memory-dialog>
                            <app-edit-dialog :memoryId="memory.id"></app-edit-dialog>
                            <app-delete-dialog :memoryId="memory.id"></app-delete-dialog>
                        </v-card-actions>
                        <v-card-text v-else>
                            <span class="grey--text">
                                <v-icon color="primary">sync</v-icon>
                                {{ memory.owner }} shared this memory with you
                            </span>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <template v-if="memory.images">
                        <v-carousel :cycle="false">
                            <v-carousel-item
                            v-for="(item,i) in memory.images"
                            :key="i"
                            :src="item.url"
                            transition="fade"
                            reverseTransition="fade"
                            ></v-carousel-item>
                        </v-carousel>
                        <app-edit-photo-dialog v-if="!memory.shared" :memoryId="memory.id"></app-edit-photo-dialog>
                    </template>
                </v-flex>
            </template>     
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    props: ['id'],
    data () {
        return {
            memoryOwner: ''
        }
    },
    computed: {
        memory () {
            return this.$store.getters.loadedMemory(this.id)
        },
        ...mapGetters(['loading', 'info'])
    },
    methods: {
        onDismiss () {
            this.$store.dispatch('clearInfo')
        }
    }
}
</script>