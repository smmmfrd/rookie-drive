import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// 9 dependencies
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyDhVbDd2EZSfS7eu7KNEn2cXx3UPtQ0uag",
    authDomain: "rookie-drive.firebaseapp.com",
    projectId: "rookie-drive",
    storageBucket: "rookie-drive.appspot.com",
    messagingSenderId: "569267608277",
    appId: "1:569267608277:web:165b0f13fd578bc3c3e05c"
});

// 9
const firebaseConfig = {
    apiKey: "AIzaSyDhVbDd2EZSfS7eu7KNEn2cXx3UPtQ0uag",
    authDomain: "rookie-drive.firebaseapp.com",
    projectId: "rookie-drive",
    storageBucket: "rookie-drive.appspot.com",
    messagingSenderId: "569267608277",
    appId: "1:569267608277:web:165b0f13fd578bc3c3e05c"
}
initializeApp(firebaseConfig);
const db = getFirestore()

const auth = firebase.auth();
const firestore = firebase.firestore();

export { db, firebase, auth, firestore}