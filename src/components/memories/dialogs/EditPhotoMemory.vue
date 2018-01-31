<template>
  <div style="margin: 0;">
    <v-btn icon @click="dialog = true"><v-icon>edit</v-icon></v-btn>
    <v-dialog v-model="dialog" width="350px">
      <v-card>
        <v-card-title class="headline">Edit photos</v-card-title>
        <v-card-text>
            <ul class="photos">
                <li v-for="image in memory.images" :key="image.name">
                    <img class="image" :src="image.url" height="150px">
                    <v-btn icon @click="deletePhoto(image.name)">
                        <v-icon color="primary">delete</v-icon>
                    </v-btn>
                </li>
            </ul>
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
          },
          deletePhoto (name) {
              this.$store.dispatch('deletePhoto', {
                  memoryId: this.memory.id,
                  photoName: name
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

<style scoped>
.photos {
  list-style-type: none;
}
</style>