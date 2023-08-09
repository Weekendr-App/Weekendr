import { FIREBASE_CONFIG } from "@weekendr/src/config/firebase.config";
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
