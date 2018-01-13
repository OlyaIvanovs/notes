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

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/signin', name: 'SignIn', component: SignIn },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/memories/new', name: 'CreateMemory', component: CreateMemory },
    { path: '/memories/shared', name: 'SharedMemories', component: SharedMemories },
    { path: '/memories/:id', name: 'Memory', component: Memory },
    { path: '/memories', name: 'Memories', component: Memories }
  ]
})
