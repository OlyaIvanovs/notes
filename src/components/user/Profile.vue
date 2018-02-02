<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
                <h2 class="primary--text">My family</h2>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-list>
                <v-list-tile v-for="(member,i) in members" :key="i" >
                    <v-list-tile-content>
                        <v-list-tile-title>{{ member.email }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
        </v-list>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm8>
                <app-add-member-dialog></app-add-member-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
      return {

      }
  },
  computed: {
        members () {
            return this.$store.getters.members
        },
    }
}
</script>