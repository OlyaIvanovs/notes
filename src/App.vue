<template>
  <v-app>
    <v-toolbar class="primary" dark>
      <v-toolbar-side-icon 
        class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag='span' style="cursor: pointer;" class="display-2">
          DailyNotes
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <div 
        v-if="user" 
        style="text-align: right; padding: 0 0 10px 0;">
          You logged in as {{user.email}}
        </div>
        <v-toolbar-items class="hidden-xs-only">
        <v-btn flat dark v-for="item in menuItems" :key="item.id" :to='item.link'>
          <v-icon>{{ item.icon }}</v-icon> 
          &nbsp;
          <template v-if="item.title == 'Profile' && user.notifications[0]">
            <v-badge overlapleft color="orange">
              <v-icon slot="badge" dark>notifications</v-icon>
              {{ item.title }}
            </v-badge>
          </template>
          <template v-else>
            {{ item.title }}
          </template>
        </v-btn>
        <v-btn flat dark @click="onLogOut" v-if="user">
          <v-icon>exit_to_app</v-icon>
          Log out
        </v-btn>
      </v-toolbar-items>
      </div>
      
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
      user () {
        return this.$store.getters.user
      },
      menuItems () {
        let menuItems
        if (this.user) {
          menuItems = [
            {icon: 'note', title: 'Take a note', link: '/memories/new'},
            {icon: 'person', title: 'Profile', link: '/profile'}
          ]
        } else {
          menuItems = [
            {icon: 'face', title: 'Sign up', link: '/signup'},
            {icon: 'lock_open', title: 'Sign in', link: '/signin'},
          ]
        }         
        return menuItems
      },
    },
    methods: {
      onLogOut () {
        this.$store.dispatch('logUserOut')
        this.$router.push({name: 'SignIn'})
      }
    }
  }
</script>

<style>

</style>
