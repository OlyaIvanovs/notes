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
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon><v-icon>share</v-icon></v-btn>
                            <app-edit-dialog :memoryId="memory.id"></app-edit-dialog>
                            <app-delete-dialog :memoryId="memory.id"></app-delete-dialog>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <template v-if="memory.images">
                        <v-carousel :cycle="false">
                            <v-carousel-item
                            v-for="(item,i) in memory.images"
                            v-bind:key="i"
                            v-bind:src="item.url"
                            transition="fade"
                            reverseTransition="fade"
                            ></v-carousel-item>
                        </v-carousel>
                        <app-edit-photo-dialog :memoryId="memory.id"></app-edit-photo-dialog>
                    </template>
                </v-flex>
            </template>     
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: ['id'],
    data () {
        return {

        }
    },
    computed: {
        memory () {
            return this.$store.getters.loadedMemory(this.id)
        },
        loading () {
            return this.$store.getters.loading
        }
    },
    methods: {

    }
}
</script>