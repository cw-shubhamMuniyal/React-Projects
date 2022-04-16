// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDqlRE_D1GC9kBzbjbdBepZ9M6D9e2SVuw",
    authDomain: "instagram-clone-react-6e923.firebaseapp.com",
    projectId: "instagram-clone-react-6e923",
    storageBucket: "instagram-clone-react-6e923.appspot.com",
    messagingSenderId: "416631041993",
    appId: "1:416631041993:web:589a678429509ca0f78218",
    measurementId: "G-K41K528WVF"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };