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
            console.log(payload)
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