import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAurQF8Uh7msemboErT-XaBW5yjWdf_FSc",
  authDomain: "ch4tb0.firebaseapp.com",
  projectId: "ch4tb0",
  storageBucket: "ch4tb0.appspot.com",
  messagingSenderId: "97557932135",
  appId: "1:97557932135:web:17ec0b70e3de35b7380cc2",
  measurementId: "G-QL4JEWBNV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Find all widget divs
const WidgetDivs = document.querySelectorAll('.custom-chatbox-widget')

// Inject our React App into each
WidgetDivs.forEach(div => {
  const root = ReactDOM.createRoot(div);
  root.render(
    <React.StrictMode>
      <App indentifier={div.dataset.identifier} />
    </React.StrictMode>
  )
})