import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null
    },
    
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        createNote (state, payload) {
            console.log('createNote')
        }
    },
    getters: {
        user (state) {
            return state.user
        } 
    },
    actions: {
        autoSignIn ({commit}, payload) {
            commit('setUser', {
                id: payload.uid
            })
        },
        signUserUp ({commit}, payload) {
            firebase.auth()
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .then(userData => {
                const user = {
                    id: userData.uid
                }
                commit('setUser', user)
            })
            .catch(error => {
                console.log(error)
              });
        },
        signUserIn ({commit}, payload) {
            firebase.auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
            .then(userData => {
                const user = {
                    id: userData.uid
                }
                commit('setUser', user)
            })
            .catch(error => {
                console.log(error)
              });
        },
        logUserOut ({commit}) {
            firebase.auth().signOut().then(() => {
                commit('setUser', null)
            }).catch(error => {
                console.log(error)
              });
        },
        createNote ({commit, getters}, payload) {
            let user = getters.user
            firebase.database().ref('/users/' + user.id).child('/notes/')
            .push(payload)
            .then(data => {
                commit('createNote', payload)
            })
            .catch((error) => {
                console.log(error)
            }) 
        }
    }
})