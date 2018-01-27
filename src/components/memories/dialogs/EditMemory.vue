<template>
  <div style="margin: 0;">
    <v-btn icon @click="dialog = true"><v-icon>edit</v-icon></v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Edit memory</v-card-title>
        <v-card-text>
          <form>
            <v-layout row>
              <v-flex xs12>
                  <v-text-field
                      name="title"
                      label="Title"
                      id="title"
                      v-model="memory.title"
                      required
                  ></v-text-field>
              </v-flex>
          </v-layout>
          <v-layout row>
              <v-flex xs12>
                  <v-text-field
                      name="Note"
                      label="Note"
                      id="note"
                      v-model="memory.note"
                      multi-line
                      required
                  ></v-text-field>
              </v-flex>
          </v-layout>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn color="green text--darken-2" flat="flat" @click="editMemory">Edit</v-btn>
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
          editMemory () {
            if (this.memory.title.trim() === '' || this.memory.note.trim() === '') {
                return
            }
            this.dialog = false
            this.$store.dispatch('updateMemoryData', {
                id: this.memory.id,  
                title: this.memory.title,
                note: this.memory.note
            })
          }
        },
        computed: {
          memory () {
            return this.$store.getters.loadedMemory(this.memoryId)
          },
        }
    }
</script>