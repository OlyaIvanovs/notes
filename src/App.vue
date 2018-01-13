<template>
  <v-app>
    <v-toolbar class="primary" dark>
      <v-toolbar-side-icon 
        class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag='span' style="cursor: pointer;" class="display-1 pt-3">DailyNotes</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat dark v-for="item in menuItems" :key="item.id" :to='item.link'>
          <v-icon left>{{ item.icon }}</v-icon> 
          {{ item.title }}
        </v-btn>
        <v-btn flat dark>
          <v-icon left>exit_to_app</v-icon> 
          Log out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main> 
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign in', link: '/signin'},
          {icon: 'watch_later', title: 'All memories', link: '/memories'},
          {icon: 'note', title: 'Make note', link: '/memories/new'},
          {icon: 'person', title: 'Profile', link: '/profile'},
          {icon: 'sync', title: 'Shared notes', link: '/memories/shared'}
        ]
        return menuItems
      },
    },
    methods: {

    }
  }
</script>

<style>

</style>
