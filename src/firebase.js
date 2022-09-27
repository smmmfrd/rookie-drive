// 9 dependencies
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

const auth = getAuth();
// const firestore = firebase.firestore();

export { db, auth }