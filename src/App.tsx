import "./assets/scss/themes.scss";
import "./App.css";
import RouteIndex from "../src/Routes/Index";

import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
fakeBackend();

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// const firebaseConfig = {
//   apiKey: import.meta.env.REACT_APP_APIKEY,
//   authDomain: import.meta.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: import.meta.env.REACT_APP_DATABASEURL,
//   projectId: import.meta.env.REACT_APP_PROJECTID,
//   storageBucket: import.meta.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.REACT_APP_MESSAGINGSENDERID,
//   appId: import.meta.env.REACT_APP_APPID,
//   measurementId: import.meta.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

function App() {
  return <RouteIndex />;
}

export default App;
