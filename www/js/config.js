import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js"; // <--- ADICIONADO

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