<template>
  <div style="margin: 0;">
    <v-btn icon @click="dialog = true"><v-icon>edit</v-icon></v-btn>
    <v-dialog v-model="dialog" width="350px">
      <v-card>
        <v-card-title class="headline">Edit photos</v-card-title>
        <v-card-text>
            <ul class="photos">
                <li v-for="image in memory.images" :key="image.name">
                    <img class="image" :src="image.url" width="250px">
                    <v-btn icon @click="deletePhoto(image.name, $event)">
                        <v-icon color="primary">delete</v-icon>
                    </v-btn>
                </li>
                <li v-for="addedImage in addedImagesUrls" :key="addedImage.url">
                    <img class="image" :src="addedImage.url" width="250px">
                    <v-btn icon @click="deleteAddedPhoto(addedImage.id)">
                        <v-icon 
                        color="primary">
                        delete
                        </v-icon>
                    </v-btn>
                </li>
            </ul>
            <form>
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
            </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn color="green text--darken-2" flat="flat" @click="editPhotosMemory">Edit</v-btn>
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
                menu: false,
                addedImages: [],
                addedImagesUrls: [],
                addedImagesId: 0,
                deletedPhotos: []
            }
        },
        methods: {
          editPhotosMemory () {
            this.dialog = false
            this.$store.dispatch('updateMemoryPhotos', {
                images: this.addedImages,
                memoryId: this.memory.id,
                numPhotoUpdate: this.memory.numPhotoUpdate,
                deletedPhotos: this.deletedPhotos
                })
            },
            deletePhoto (name, event) {
                event.target.closest('li').style.display = 'none'
                this.deletedPhotos.push(name)
            },
            deleteAddedPhoto (addedImageId) {
                this.addedImagesUrls.splice(this.addedImagesUrls.indexOf(image => {
                    image.id == addedImageId
                }), 1)
            },
            onPickFile () {
                this.$refs.fileInput.click()
            },
            onFilePicked (event) {
                let images = event.target.files
                this.addedImages = images
                for (let i = 0; i < images.length; i++) {
                    let image = images[i]
                    const fileReader = new FileReader()
                    fileReader.addEventListener('load', () => {
                        let addedImageUrl = {
                            url: fileReader.result,
                            id: this.addedImagesId
                        }
                        this.addedImagesId = this.addedImagesId + 1
                        this.addedImagesUrls.push(addedImageUrl)
                    })
                    fileReader.readAsDataURL(image)
                }
            },
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