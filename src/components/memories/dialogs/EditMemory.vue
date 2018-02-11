<template>
  <div style="margin: 0;">
    <v-btn icon @click="dialog = true"><v-icon>edit</v-icon></v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Edit memory</v-card-title>
        <v-card-text>
          <form>
            <v-layout row wrap>
              <v-flex xs11 sm5>
                <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menu"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px">
                      <v-text-field
                      slot="activator"
                      label="Date"
                      v-model="memory.date"
                      required
                      ></v-text-field>
                      <v-date-picker v-model="memory.date" no-title scrollable actions>
                        <template slot-scope="{ save, cancel }">
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                <v-btn flat color="primary" @click="save">OK</v-btn>
                            </v-card-actions>
                        </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
            </v-layout>
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
          <v-btn color="green text--darken-2" flat="flat" @click="editMemory">Save</v-btn>
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
                dialog: false,
                menu: false
            }
        },
        methods: {
          editMemory () {
            if (this.memory.title.trim() === '' || this.memory.note.trim() === '') {
                return
            }
            let newDate = new Date(this.memory.date)
            this.dialog = false
            this.$store.dispatch('updateMemoryData', {
                id: this.memory.id,  
                title: this.memory.title,
                note: this.memory.note,
                date: newDate.toISOString()
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