<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
                <h2 class="primary--text">Create a new note</h2>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <form @submit.prevent="createNote">
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
                            min-width="290px"
                        >
                            <v-text-field
                            slot="activator"
                            label="Date"
                            v-model="date"
                            required
                            readonly
                            ></v-text-field>
                            <v-date-picker v-model="date" no-title scrollable actions>
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
                                v-model="title"
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
                                v-model="note"
                                multi-line
                                required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm8>
                            <v-tooltip left>
                                <v-btn 
                                    fab 
                                    dark 
                                    small 
                                    icon
                                    color="accent" 
                                    slot="activator" 
                                    @click="onPickFile">
                                    <v-icon dark>add</v-icon>
                                </v-btn>
                                <span>Add photo</span>
                            </v-tooltip>
                            <input type="file" 
                                multiple
                                style="display: none;"
                                ref="fileInput" 
                                @change="onFilePicked"
                                accept="image/*">
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card class="grid">
                                <v-container fluid grid-list-sm>
                                    <v-layout row wrap>
                                        <v-flex xs2 v-for="image in imagesUrls" :key="image">
                                        <img class="image" v-bind:src="image" height="150px">
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-btn flat class="accent" 
                            dark type="submit"
                            :disabled="!valid">
                                Create note
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
      return {
        title: '',
        note: '',
        date: null,
        menu: false,
        images: [],
        imagesUrls: []
      }
  },
  computed: {
      valid () {
          return this.title && this.note && this.date
      }
  },
  methods: {
        createNote () {
            let note = {
                title: this.title, 
                note: this.note,
                date: this.date.toString(),
                images: this.images
            }
            this.$store.dispatch('createNote', note)
        },
        onPickFile () {
            this.$refs.fileInput.click()
        },
        onFilePicked (event) {
            let images = event.target.files
            this.images = images
            for (let i = 0; i < images.length; i++) {
                let image = images[i]
                const fileReader = new FileReader()
                fileReader.addEventListener('load', () => {
                    let imageUrl = fileReader.result
                    this.imagesUrls.push(imageUrl)
                })
                fileReader.readAsDataURL(image)
            }

        },
  }
}
</script>