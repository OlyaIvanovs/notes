<template>
<div style="margin: 0;">
    <v-btn icon @click="dialog = true"><v-icon>share</v-icon></v-btn>
    <v-dialog v-model="dialog" max-width="290"> 
      <v-card v-if="members[0]">
        <v-card-title class="headline">Share with friends</v-card-title>
        <v-card-text>
          <form>
          <v-layout row>
              <v-flex xs12>
                <template v-for="member in members">
                    <v-switch 
                    :label="member.email" 
                    v-model="selectedMembers" 
                    :value="member"></v-switch>
                </template>
              </v-flex>
          </v-layout>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn color="green text--darken-2" flat="flat" @click="shareMemory">Share</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="headline">
            No friends to share :(
        </v-card-title>
        <v-card-text>
            <router-link :to="{name: 'Profile'}" style="cursor: pointer;" class="subheading">
                Invite friends to join your family 
            </router-link>
        </v-card-text>
      </v-card>
    </v-dialog>
</div>
</template>

<script>    
    import {mapGetters} from 'vuex' 

    export default {
        props: ['memoryId'],
        data () {
            return {
                dialog: false,
                selectedMembers: [],
                smembers: []
            }
        },
        watch: {
            selectedMembers (newVal, oldVal) {
                this.selectedMembers = newVal
            }
        },
        computed: {
            ...mapGetters(['members'])
        },
        watch: {
            members (newVal, oldVal) {
                this.members = newVal
            }
        },
        methods: {
            shareMemory () {
                this.$store.dispatch('shareMemory', {
                    selectedMembers: this.selectedMembers,
                    memoryId: this.memoryId
                })
                this.dialog = false
                this.selectedMembers = []
            }
        }
    }
</script>