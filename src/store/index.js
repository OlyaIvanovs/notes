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
        loading: false,
        members: [],
        error: null
    },
    mutations: {
        shareMemory (state, payload) {
            let memory = state.loadedMemories.find((memory) => {
                return memory.id == payload.memoryId
            })
            payload.selectedMembers.forEach(member => {
                if (memory.sharedList.indexOf(member.email) == -1) {
                    memory.sharedList.push(member.email)
                }
            })
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state, payload) {
            state.error = null
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setUser (state, payload) {
            state.user = payload
        },
        setLoadedMemories (state, payload) {
            state.loadedMemories = payload
        },
        setInfo (state, payload, commit) {
            state.info = payload
            setTimeout(() => {
                state.info = null
            }, 2000)
        },
        setMembers (state, payload) {
            state.members = payload
        },
        createNote (state, payload) {
            state.loadedMemories.push(payload)
        },
        deleteMemory (state, payload) {
            state.loadedMemories
            .splice(state.loadedMemories.findIndex(memory => memory.id === payload), 1)
        },
        addMember (state, payload) {
            state.members.push(payload)
        },
        deleteMember (state, payload) {
            state.members
            .splice(state.members.findIndex(member => member.id === payload), 1)
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
        error (state) {
            return state.error
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
        members (state) {
            return state.members
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
        shareMemory ({commit}, payload) {
            let promises = []
            let memoryId = payload.memoryId

            function getSelectedMemberPromise(member){
                return firebase.database()
                .ref('/notes/' + memoryId + '/shared/' + member.uid)
                .set({ email: member.email})
                .then(() => {
                    firebase.database().ref('/users/' + member.uid).child('/notes/')
                    .push({id: memoryId})
                })
            } 
            
            if (payload.selectedMembers.length == 0) {
                commit('setInfo', {
                    msg: "You haven't share your memory;( Try again.",
                    clr: 'warning',
                    icon: 'priority_high'
                })
            } else {
                payload.selectedMembers.forEach(member => {
                    promises.push(getSelectedMemberPromise(member))
                })
    
                Promise.all(promises).then(() => {
                    commit('shareMemory', payload)
                    commit('setInfo', {
                        msg: "Hooray! You've shared your memory",
                        clr: 'warning',
                        icon: 'priority_high'
                    })
                })
                .catch(error => {
                    console.log(error)
                    commit('setError', error)
                })
            }
        },
        clearInfo ({commit}) {
            commit('clearInfo')
        },
        clearError ({commit}) {
            commit('clearError')
        },
        autoSignIn ({commit, dispatch}, payload) {
            commit('setUser', {
                id: payload.uid,
                email: payload.email
            })
            dispatch('loadMemories')
            dispatch('members')
        },
        signUserUp ({commit}, payload) {
            firebase.auth()
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .then(userData => {
                const user = {
                    id: userData.uid,
                    email: userData.email
                }
                firebase.database().ref('/users/' + userData.uid).update({
                    email: userData.email
                })
                userData.sendEmailVerification()
                commit('setUser', user)
            })
            .catch(error => {
                console.log(error)
                commit('setError', error)
            })
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
                commit('setError', error)
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
            let promises = []

            function getMemoryPromise(id, user) {
                return firebase.database().ref('/notes/' + id)
                .once('value').then(data => {
                    let info = data.val()
                    let shared = (user != data.val().owner)
                    let sharedList = []
                    if (data.val().shared) {
                        for (let key in data.val().shared) {
                            sharedList.push(data.val().shared[key].email)
                        }
                    } 
                    return {
                        id: data.key,
                        title: info.title,
                        note: info.note,
                        date: info.date,
                        images: info.images,
                        numPhotoUpdate: info.numPhotoUpdate,
                        owner: info.owner,
                        shared: shared,
                        sharedList: sharedList
                    }
                }).then((data) => {
                    let memory = data
                    firebase.database().ref('/users/' + data.owner).once('value')
                    .then((data) => {
                        memory.owner = data.val().email
                    })
                    return memory
                }) 
            } 

            let user = getters.user
            firebase.database().ref('/users/' + user.id)
            .child('/notes/').once('value')
            .then((data) => {
                let memories = []
                const obj = data.val()
                for (let key in obj) {
                    promises.push(getMemoryPromise(obj[key].id, user.id))
                }
                Promise.all(promises).then(results => {
                    commit('setLoading', false)
                    commit('setLoadedMemories', results)
                })
            }).catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        members ({commit, getters}) {
            commit('setLoading', true)
            let user = getters.user
            firebase.database().ref('/users/' + user.id)
            .child('/members/')
            .once('value')
            .then((data) => {
                commit('setLoading', false)
                const members = []
                const obj = data.val()
                for (let key in obj) {
                    firebase.database().ref('/users/' + obj[key])
                    .once('value')
                    .then((data) => {
                        members.push({
                            id: key,
                            uid: obj[key],
                            email: data.val().email
                        })
                    })
                }
                commit('setMembers', members)
            }).catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        deleteMember ({commit, getters}, payload) {

            let user = getters.user
            firebase.database().ref('/users/' + user.id)
            .child('/members/' + payload)
            .remove()
            .then(() => {
                commit('deleteMember', payload)
                commit('setInfo', {
                    msg: "Member was deleted",
                    clr: 'warning',
                    icon: 'priority_high'
                })
            })
            .catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        deleteMemory ({commit, getters}, payload) {
            let user = getters.user
            firebase.database().ref('/notes/' + payload + '/owner/')
            .once('value')
            .then(data => {
                firebase.database().ref('/users/' + data.val()).child('/notes/')
                .orderByChild('id').equalTo(payload).on('child_added', (snapshot) => {
                    snapshot.ref.remove()
                })
            })
            .then(() => {
                firebase.database().ref('/notes/' + payload + '/images/')
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
            })
            .then(() => {
                firebase.database().ref('/notes/' + payload)
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
            let ref = firebase.database()
            .ref('/notes/' + payload.memoryId)

            payload.deletedPhotos.forEach((photoName) => {
                firebase.storage().ref(photoName).delete()
            })

            function getImagePromise(image, index) {
                const filename = image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                let thisRef = firebase.storage()
                .ref('notes/' + payload.memoryId + '_' + numPhotoUpdate +'_' + index + '.' + ext)
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
            firebase.database().ref('/notes/' + payload.id)
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
        addMember ({commit, getters}, payload) {
            commit('setLoading', true)
            let user = getters.user
            firebase.database().ref('/users/').once('value')
            .then((data) => {
                let users = data.val()
                for (let key in users) {
                    if (users[key].email == payload) {
                        return key
                    }
                } 
                throw new Error('User with this email is not registered yet. You can invite him.')
                
            })
            .then((key) => {
                firebase.database().ref('/users/' + user.id)
                .child('/members/')
                .push(key)
                .then(() => {
                    commit('setLoading', false)
                    commit('addMember', {
                        id: key,
                        email: payload
                    })
                })
            })
            .catch((error) => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
            }) 
        },
        createNote ({commit, getters}, payload) {
            commit('setLoading', true)
            let user = getters.user
            let key
            let images
            firebase.database()
            .ref('/notes/')
            .push({
                ...payload,
                numPhotoUpdate: 0,
                shared: [], 
                owner: user.id
            })
            .then(data => {
                key = data.key
                firebase.database().ref('/users/' + user.id)
                .child('/notes/').push({id: key})
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
                let ref = firebase.database().ref('/notes/' + key)
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
                            numPhotoUpdate: 0,
                            shared: false
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