export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD1gMNNAffyRexfKpXWyR18PfJsSjdK-5Y",
  authDomain: "yekna-diplomski.firebaseapp.com",
  projectId: "yekna-diplomski",
  storageBucket: "yekna-diplomski.appspot.com",
  messagingSenderId: "33125822762",
  appId: "1:33125822762:web:d65a2313a17d4c94482e53",
};

export const FIREBASE_UI_CONFIG = (firebase: any) => ({
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "/",
});
