// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from 'svelte/store';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyArRTjbUKOIgHAYXc2jUIkTjuGgk1urMfY",
	authDomain: "quickstart-1561521230800.firebaseapp.com",
	projectId: "quickstart-1561521230800",
	storageBucket: "quickstart-1561521230800.appspot.com",
	messagingSenderId: "514464852570",
	appId: "1:514464852570:web:50ca15a0fc7f9865780663",
	measurementId: "G-DMYX5RS7QL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();


/**
 * @returns a store with the current firebase user
 */

function userStore() {

	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
		  subscribe,
		}
	  }
	
	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
	unsubscribe = onAuthStateChanged(auth, (user) => {
		set(user);
	});

	return () => unsubscribe();
	});

	return {
		subscribe,
	};
}
	
export const user = userStore();