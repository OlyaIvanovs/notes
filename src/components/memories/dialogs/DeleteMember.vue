<template>
    <div style="margin: 0;">
        <v-btn icon @click="dialog=true">
            <v-icon color="primary">delete</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" max-width="290">
        <v-card>
            <v-card-title class="headline">Delete member?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent" flat="flat" @click="deleteMember">Yes</v-btn>
                <v-btn color="primary" flat="flat" @click="dialog = false">No</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: ['memberId'], 
        data () {
            return {
                dialog: false
            }
        },
        methods: {
          deleteMember () {
            this.dialog = false
            this.$store.dispatch('deleteMember', this.memberId)
          }
        }
    }
</script>