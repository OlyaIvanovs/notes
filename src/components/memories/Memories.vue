<template>
    <v-container>
        <v-layout row justify-space-between>
            <v-flex xs12 sm6>
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field
                            name="input-1-3"
                            label="Find in memories..."
                            single-line
                            prepend-icon="search"
                            v-model="search"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <template v-for="(item, index) in filteredMemories">
                        <router-link style="display: block; text-decoration: none;"  
                        :to="{name: 'Memory', params: {id: item.id}}">
                            <v-card>
                                <v-list two-line>
                                    <v-list-tile :key="item.title">
                                    <v-list-tile-content>
                                        <v-list-tile-title class="primary--text">{{ item.title }}</v-list-tile-title>
                                        <v-list-tile-sub-title class="grey--text text--darken-4">{{ item.note }}</v-list-tile-sub-title>
                                        <v-list-tile-sub-title>{{ item.date | date}}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    </v-list-tile>
                                    <v-divider v-if="index + 1 < loadedMemories.length"></v-divider>
                                </v-list>
                            </v-card>
                        </router-link>
                        </template>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm5 class="hidden-xs-only">
                <h3 class="primary--text">Filter memories by date</h3>
                <v-date-picker 
                    color="accent" 
                    header-color="primary" 
                    v-model="picker" 
                    landscape>
                </v-date-picker>
                <v-btn v-if="picker"
                    flat 
                    class="accent" 
                    @click="clearDateFilter"
                    dark>
                    Clear date filter
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            picker: '',
            search: ''
        }
    },
    computed: {
        ...mapGetters(['loadedMemories']),
        filteredMemories () {
            let memories = this.loadedMemories
            if (this.search) {
                memories = memories.filter((memory) => {
                    return memory.title.match(this.search) || memory.note.match(this.search)
                })
            }
            if (this.picker) {
                let date = new Date(this.picker)
                memories = memories.filter((memory) => {
                    let memoryDate= new Date(memory.date)
                    return memoryDate.getTime() == date.getTime()
                })
            }
            return memories
        }
    },
    methods: {
        clearDateFilter () {
            this.picker = ''
        }
    }
}
</script>