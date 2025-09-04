import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './config';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

if (process.env.NODE_ENV === 'development') {
    // Point to the RTDB emulator running on localhost.
    // connectDatabaseEmulator(db, "localhost", 9000);
    
    // Point to the Auth emulator running on localhost.
    try {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        console.log("Firebase Auth emulator connected");
    } catch(e) {
        console.warn("Could not connect to Firebase Auth emulator. If you are not running it, this is expected.");
    }
}


export { app, auth, db };
