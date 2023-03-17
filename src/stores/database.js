import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig';
import { nanoid } from 'nanoid'
import router from '../router';

export const useDatabaseStore = defineStore('database', {
    state: () => ({
        documents: [],
        loadingDoc: false,
        loading: false
    }),
    actions: {
        async getUrl(id) {
            try {
                const docRef = doc(db, "urls", id);
                const docSnap = await getDoc(docRef);


                if (!docSnap.exists()) {
                    return false;
                }

                return docSnap.data().name
            } catch (error) {
                console.log(error.code);
                return false;
            } finally {

            }
        },
        async getUrls() {
            if (this.documents.length !== 0) {
                return;
            }
            this.loadingDoc = true;
            try {
                const q = query(collection(db, 'urls'), where("user", "==", auth.currentUser.uid));
                const querySnapShot = await getDocs(q);
                querySnapShot.forEach(doc => {
                    // console.log(doc.id, doc.data());
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingDoc = false;
            }
        },
        async addUrl(name) {
            this.loading = true;
            try {
                const objectDoc = {
                    name,
                    short: nanoid(6),
                    user: auth.currentUser.uid
                }
                await setDoc(doc(db, "urls", objectDoc.short), objectDoc);
                // console.log(docRef.id)
                this.documents.push({
                    ...objectDoc,
                    id: objectDoc.short
                })
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async leerUrl(id) {
            try {
                const docRef = doc(db, "urls", id);
                const docSnap = await getDoc(docRef);


                if (!docSnap.exists()) {
                    throw new Error("No exite el error");
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No pues ser editado")
                }

                return docSnap.data().name
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {

            }
        },
        async updateUrl(id, name){
            this.loading = true;
            try {
                const docRef = doc(db, 'urls', id);

                const docSpan = await getDoc(docRef);
                if (!docSpan.exists()) {
                    throw new Error("No existe el documento");
                }
                if (docSpan.data().user !== auth.currentUser.uid) {
                    throw new Error("Este documento no se puede actualizar");
                }

                await updateDoc(docRef, {
                    name
                })
                this.documents =  this.documents.map((item) => item.id === id ? ({...item, name: name}): item);
                router.push('/')
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        },
        async deleteUrl(id) {
            try {
                this.loading = true;
                const docRef = doc(db, "urls", id);

                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("No exite el error");
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No pues ser eliminado")
                }

                await deleteDoc(docRef);
                this.documents = this.documents.filter(item => item.id !== id);
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loading = false;
            }
        }
    }
}) 