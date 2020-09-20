import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, combineReducers, compose } from "redux";
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import 'firebase/database';

import firebase from "firebase/app";
import fbConfig from "./fb-config";

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  profileFactory: (userData, profileData, firebase) => {
    const { user } = userData;
    console.log(JSON.stringify(userData))
    console.log(JSON.stringify(profileData))
    return {
      uid: userData.uid,
      displayName: userData.displayName,
      email: userData.email,
      photoURL: userData.photoURL,
      averageWPM: 60,
    };
  },
};

firebase.initializeApp(fbConfig);

firebase.firestore();

firebase.firestore().settings({
  ignoreUndefinedProperties: true,
});

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const initialState = {};
const store = createStore(rootReducer, initialState);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <App />
        </ReactReduxFirebaseProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
