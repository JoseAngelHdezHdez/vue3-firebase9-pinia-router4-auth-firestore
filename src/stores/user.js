import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '../firebaseConfig';
import router from '../router';
import { useDatabaseStore } from './database'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false
    }),
    getters: {

    },
    actions: {
        async registerUser(email, password) {
            try {
                this.loadingUser = true;
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                console.log(user);
                this.userData = {
                    email: user.email,
                    uid: user.uid
                };
                router.push('/');
            } catch (error) {
                console.log(error.code);
                return error.code;  
            } finally {
                this.loadingUser = false;
            }
        },
        async loginUser(email, password) {
            try {
                this.loadingUser = true;
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                // console.log(user);
                this.userData = {
                    email: user.email,
                    uid: user.uid
                };
                router.push('/');
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async logoutUser() {
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                this.loadingUser = true;
                await signOut(auth);
                this.userData = null;
                router.push('/login');
            } catch (error) {
                console.log(error);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, user => {
                    if (user) {
                        this.userData = {
                            email: user.email,
                            uid: user.uid
                        };
                    } else {
                        this.userData = null;
                        const databaseStore = useDatabaseStore();
                        databaseStore.$reset();
                    }
                    resolve(user);
                }, e => reject(e));
                unsuscribe();
            });
        }
    }
})