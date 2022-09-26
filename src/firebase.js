import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

firebase.initializeApp({
    apiKey: "AIzaSyDhVbDd2EZSfS7eu7KNEn2cXx3UPtQ0uag",
    authDomain: "rookie-drive.firebaseapp.com",
    projectId: "rookie-drive",
    storageBucket: "rookie-drive.appspot.com",
    messagingSenderId: "569267608277",
    appId: "1:569267608277:web:165b0f13fd578bc3c3e05c"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, auth, firestore}