import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        loadedMemories: []
    },
    
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        setLoadedMemories (state, payload) {
            state.loadedMemories = payload
        },
        createNote (state, payload) {
            console.log('createNote')
            console.log(payload)
        }
    },
    getters: {
        user (state) {
            return state.user
        },
        loadedMemories (state) {
            return state.loadedMemories.sort((a, b) => {
                return new Date(a.date) - new Date(b.date)
            })
            // .slice(0, 10)
        } 
    },
    actions: {
        autoSignIn ({commit, dispatch}, payload) {
            commit('setUser', {
                id: payload.uid
            })
            dispatch('loadMemories')
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
        loadMemories ({commit, getters}) {
            let user = getters.user
            firebase.database().ref('/users/' + user.id).child('/notes/').once('value')
            .then((data) => {
                const memories = []
                const obj = data.val()
                for (let key in obj) {
                    memories.push({
                        id: key,
                        title: obj[key].title,
                        note: obj[key].note,
                        date: obj[key].date,
                        images: obj[key].images
                    })
                }
                commit('setLoadedMemories', memories)
            } )
        },
        createNote ({commit, getters}, payload) {
            let user = getters.user
            let key
            let images
            firebase.database().ref('/users/' + user.id).child('/notes/')
            .push(payload)
            .then(data => {
                key = data.key
                return key
            })
            .then(key => {
                let images = payload.images
                let promises = []
                function getImagePromise(image, index) {
                    const filename = image.name
                    const ext = filename.slice(filename.lastIndexOf('.'))
                    let thisRef = firebase.storage().ref('notes/' + key + '_' + index + '.' + ext)
                    return thisRef.put(image).then((snapshot) => {
                        return snapshot.metadata.downloadURLs[0]
                    })
                } 
                for (let i = 0; i < images.length; i++) {
                    promises.push(getImagePromise(images[i], i))
                }
                Promise.all(promises).then(results => {
                    images = results
                    console.log(images)
                    return firebase.database().ref('/users/' + user.id + '/notes/')
                    .child(key).update({
                        images: images
                    }).then(() => {
                        commit('createNote', {
                            title: payload.title, 
                            note: payload.note,
                            date: payload.date.toString(),
                            images: images,
                            id: key
                        })
                    })
                });
            })
            .catch((error) => {
                console.log(error)
            }) 
        }
    }
})