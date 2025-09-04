// This file is aliased as '@/lib/firebase/firebase-admin' and used by Genkit flows.
// It is also used by server actions.

import admin from 'firebase-admin';
import { firebaseConfig } from './config';

// To deploy, you must set the FIREBASE_SERVICE_ACCOUNT environment variable.
// The value should be the JSON content of your service account key file.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT environment variable is not set. Cannot initialize Firebase Admin SDK.'
    );
  }
  // In development, we can allow it to proceed without a service account
  // for client-side only workflows, but server actions will fail.
  console.warn(
    'FIREBASE_SERVICE_ACCOUNT is not set. Firebase Admin SDK is not initialized. Server-side operations will fail.'
  );
}

const getFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    if (serviceAccountString) {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: firebaseConfig.databaseURL,
      });
    } else {
      // In development, initialize without credentials. This will have limited permissions.
      admin.initializeApp({
        databaseURL: firebaseConfig.databaseURL,
      });
    }
  }
  return admin;
};

// We call it here to initialize on module load
getFirebaseAdmin();


export { getFirebaseAdmin };
