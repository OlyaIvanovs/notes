<template>
  <div style="margin: 0;">
    <!-- <v-tooltip left> -->
        <v-btn 
            fab 
            dark 
            small 
            icon
            color="accent" 
            @click="dialog = true">
            <v-icon dark>add</v-icon>
        </v-btn>
        <!-- <span>Add a member</span>
    </v-tooltip> -->
    <v-dialog v-model="dialog" max-width="290"> 
      <v-card>
        <v-card-title class="headline">Add a member</v-card-title>
        <v-card-text>
          <form>
          <v-layout row>
              <v-flex xs12>
                    <v-text-field
                        name="email"
                        label="Mail"
                        id="email"
                        v-model="email"
                        type="email"
                        :rules="emailRules"
                        required
                    ></v-text-field>
              </v-flex>
          </v-layout>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn color="green text--darken-2" flat="flat" @click="addMember">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                dialog: false,
                email: '',
                emailRules: [
                    (v) => !!v || 'E-mail is required',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(v) || 'E-mail must be valid'
                ]
            }
        },
        methods: {
            addMember () {
                this.$store.dispatch('addMember', this.email)
                this.dialog = false
            }
        }
    }
</script>