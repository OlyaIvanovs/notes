import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        loadedMemories: [],
        loading: false,
        info: null,
        loading: false
    },
    mutations: {
        setLoading (state, payload) {
            state.loading = payload
        },
        setUser (state, payload) {
            state.user = payload
        },
        setLoadedMemories (state, payload) {
            state.loadedMemories = payload
        },
        createNote (state, payload) {
            state.loadedMemories.push(payload)
        },
        deleteMemory (state, payload) {
            state.loadedMemories
            .splice(state.loadedMemories.findIndex(memory => memory.id === payload), 1)
        },
        setInfo (state, payload) {
            state.info = payload
        },
        clearInfo (state, payload) {
            state.info = null
        },
        setLoading (state, payload) {
            state.loading = payload
        }
    },
    getters: {
        user (state) {
            return state.user
        },
        info (state) {
            return state.info
        },
        loading (state) {
            return state.loading
        },
        loadedMemories (state) {
            return state.loadedMemories.sort((a, b) => {
                return new Date(a.date) - new Date(b.date)
            })
            // .slice(0, 10)
        },
        loadedMemory (state, memoryId) {    
            return (memoryId) => {
                return state.loadedMemories.find((memory) => {
                    return memory.id == memoryId
                })
            }
        }, 
        loading (state) {
            return state.loading
        }
    },
    actions: {
        clearInfo ({commit}) {
            commit('clearInfo')
        },
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
            commit('setLoading', true)
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
                commit('setLoading', false)
                commit('setLoadedMemories', memories)
            }).catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        deleteMemory ({commit, getters}, payload) {
            let user = getters.user
            firebase.database().ref('/users/' + user.id).child('/notes/' + payload + '/images/')
            .once('value')
            .then((data) => {
                let images = data.val()
                if (images) {
                    for (let i = 0; i < images.length; i++) {
                        firebase.storage().ref(images[i].name)
                        .delete()
                        .catch(error => {
                            console.log(error)
                        })
                    }
                }
            })
            .then(() => {
                firebase.database().ref('/users/' + user.id).child('/notes/' + payload)
                .remove()
            })
            .then(() => {
                commit('deleteMemory', payload)
                commit('setInfo', "Your memory was deleted")
            })  
            .catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        createNote ({commit, getters}, payload) {
            commit('setLoading', true)
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
                        let metadata = {
                            'url': snapshot.metadata.downloadURLs[0],
                            'name': snapshot.metadata.fullPath
                        }
                        return metadata
                    })
                } 
                for (let i = 0; i < images.length; i++) {
                    promises.push(getImagePromise(images[i], i))
                }
                Promise.all(promises).then(results => {
                    images = results
                    return firebase.database().ref('/users/' + user.id + '/notes/')
                    .child(key).update({
                        images: images
                    }).then(() => {
                        commit('setLoading', false)
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