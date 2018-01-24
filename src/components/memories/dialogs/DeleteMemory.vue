<template>
  <div style="margin: 0;">
    <v-btn icon @click="dialog = true"><v-icon>delete</v-icon></v-btn>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete memory?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" flat="flat" @click="deleteMemory">Yes</v-btn>
          <v-btn color="primary" flat="flat" @click="dialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    export default {
        props: ['memoryId'], 
        data () {
            return {
                dialog: false
            }
        },
        methods: {
          deleteMemory () {
            this.dialog = false
            this.$store.dispatch('deleteMemory', this.memoryId)
            this.$router.push({'name': 'Memories'})
          }
        }
    }
</script>