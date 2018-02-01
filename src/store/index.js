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
        },
        updateMemoryDate (state, payload) {
            let memory = state.loadedMemories.find((memory) => {
                return memory.id == payload.id
            })
            memory.title = payload.title
            memory.note = payload.note
        },
        updateMemoryPhotos (state, payload) {
            let memory = state.loadedMemories.find((memory) => {
                return memory.id == payload.memoryId
            })
            memory.numPhotoUpdate = payload.numPhotoUpdate
            memory.images = payload.images
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
                    if (memory.id == memoryId) {
                        if (memory.images) {
                            for (let i = 0; i < memory.images.length; i++) {
                                if (memory.images[i] == null) {
                                    memory.images.splice(i, 1)
                                }
                            }
                            // for (const [i, image] of memory.images.entries()) {
                            //     if (image == null) {
                            //         memory.images.splice(i, 1)
                            //     }
                            // }
                        }
                        return memory
                    }
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
                        images: obj[key].images,
                        numPhotoUpdate: obj[key].numPhotoUpdate
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
                commit('setInfo', {
                    msg: "Your memory was deleted",
                    clr: 'warning',
                    icon: 'priority_high'
                })
            })  
            .catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        updateMemoryPhotos ({commit, getters, dispatch}, payload) {
            commit('setLoading', true)
            let user = getters.user
            let images = payload.images
            let updatedImages = []
            let promises = []
            let numPhotoUpdate = payload.numPhotoUpdate + 1
            let ref = firebase.database().ref('/users/' + user.id + '/notes/' + payload.memoryId)

            payload.deletedPhotos.forEach((photoName) => {
                firebase.storage().ref(photoName).delete()
            })

            function getImagePromise(image, index) {
                const filename = image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                let thisRef = firebase.storage().ref('notes/' + payload.memoryId + '_' + numPhotoUpdate +'_' + index + '.' + ext)
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
            
            Promise.all(promises)
            .then(results => {
                images = results
                ref.child('/images/').once('value').then((data) => {
                    let updatedImages = data.val()
                    if (updatedImages && images) {
                        updatedImages = updatedImages.concat(images)
                    }
                    if (payload.deletedPhotos) {
                        payload.deletedPhotos.forEach((photoName) => {
                            updatedImages
                            .splice(updatedImages.findIndex(image => image.name === photoName), 1)
                        })
                    }                   
                    ref.update({
                        numPhotoUpdate: numPhotoUpdate,
                        images: updatedImages
                    })
                    // .then(() => {
                    //     ref.child('images').orderByChild('name').equalTo(photoName).on('child_added', (snapshot) => {
                    //         snapshot.ref.remove()
                    //    })
                    // })
                    .then(() => {
                        commit('setLoading', false)
                        commit('updateMemoryPhotos', {
                            numPhotoUpdate: numPhotoUpdate,
                            images: updatedImages,
                            memoryId: payload.memoryId
                        })
                    })
                })
            })
            .catch(error => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        updateMemoryData ({commit, getters}, payload) {
            commit('setLoading', true)
            let user = getters.user
            const updateObj = {
                title: payload.title,
                note: payload.note,
                date: payload.date
            }
            firebase.database().ref('/users/' + user.id).child('/notes/' + payload.id)
            .update(updateObj)
            .then(() => {
                commit('setLoading', false)
                commit('updateMemoryDate', payload)
            })
            .catch(error => {
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
            .push({
                ...payload,
                numPhotoUpdate: 0
            })
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
                    let thisRef = firebase.storage()
                    .ref('notes/' + key + '_' + index + '.' + ext)
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
                let ref = firebase.database().ref('/users/' + user.id + '/notes/' + key)
                Promise.all(promises).then(results => {
                    images = results
                    return ref.update({
                        images: images
                    })
                    .then((data) => {
                        commit('setLoading', false)
                        commit('setInfo', {
                            msg: "New memory was added successfully",
                            clr: 'success',
                            icon: 'check_circle'
                        })
                        commit('createNote', {
                            title: payload.title, 
                            note: payload.note,
                            date: payload.date.toString(),
                            images: images,
                            id: key,
                            numPhotoUpdate: 0
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