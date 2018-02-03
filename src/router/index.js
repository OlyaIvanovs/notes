import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SignIn from '@/components/user/SignIn'
import SignUp from '@/components/user/SignUp'
import Profile from '@/components/user/Profile'
import Memory from '@/components/memories/Memory'
import CreateMemory from '@/components/memories/CreateMemory'
import Memories from '@/components/memories/Memories'
import SharedMemories from '@/components/memories/SharedMemories'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Memories', component: Memories, beforeEnter: AuthGuard },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/signin', name: 'SignIn', component: SignIn },
    { path: '/profile', name: 'Profile', component: Profile, beforeEnter: AuthGuard },
    { path: '/memories/new', name: 'CreateMemory', component: CreateMemory, beforeEnter: AuthGuard },
    { path: '/memories/shared', name: 'SharedMemories', component: SharedMemories, beforeEnter: AuthGuard },
    { path: '/memories/:id', name: 'Memory', component: Memory,  props: true, beforeEnter: AuthGuard }
  ],
  mode: 'history'
})
