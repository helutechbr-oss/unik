import { initializeApp } from "./firebase/app/dist/index.esm.js";
import { getAuth } from "./firebase/auth/dist/index.esm.js";
import { getFirestore } from "./firebase/firestore/dist/index.esm.js";
import { getStorage } from "./firebase/storage/dist/index.esm.js";

const firebaseConfig = {
    apiKey: "AIzaSyB1kKppCK9a5fkNv3AatAmg-7kIWewikLg",
    authDomain: "rastreiamais-81087.firebaseapp.com",
    projectId: "rastreiamais-81087",
    storageBucket: "rastreiamais-81087.firebasestorage.app",
    messagingSenderId: "804875668297",
    appId: "1:804875668297:web:175d027f67b4faca192898",
    measurementId: "G-QML2D91DJW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <--- INICIALIZADO

export { auth, db, storage, firebaseConfig }; // <--- EXPORTADO