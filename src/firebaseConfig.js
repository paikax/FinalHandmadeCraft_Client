import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import config from '~/config';

const firebaseConfig = {
    apiKey: 'AIzaSyCBMZAZWUQYM2EAlACJao5x-vt4GwVtImI',
    authDomain: 'handmadecraftfinal.firebaseapp.com',
    projectId: 'handmadecraftfinal',
    storageBucket: 'handmadecraftfinal.appspot.com',
    messagingSenderId: '76205863553',
    appId: '1:76205863553:web:3ea065b7e4b6e664f9d380',
    measurementId: 'G-QD5LJCLC3Y',
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const name = result.user.displayName;
        const profilePic = result.user.photoURL;
        const email = result.user.email;
        const userId = result.user.uid;

        localStorage.setItem('name', name);
        localStorage.setItem('profilePic', profilePic);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', userId);

        window.location.replace(config.routes.home);
    } catch (error) {
        console.log(error);
    }
};

export const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem('name');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');

    window.location.replace(config.routes.login);
};

export const uploadImageToFirebase = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    // Assign a default name if file.name is undefined
    const fileName = file.name || `image-${Date.now()}`;

    try {
        const storageRef = ref(storage, `images/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Uploaded a file!', snapshot);
    } catch (error) {
        console.error('Error uploading file: ', error);
    }
};
