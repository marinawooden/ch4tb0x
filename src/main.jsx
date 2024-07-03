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
  apiKey: "AIzaSyBPIvjm5m_hz1ACPbkdpuQrs2pRiaD2JMM",
  authDomain: "ch4tb0x-5e481.firebaseapp.com",
  projectId: "ch4tb0x-5e481",
  storageBucket: "ch4tb0x-5e481.appspot.com",
  messagingSenderId: "559616115385",
  appId: "1:559616115385:web:509f9a23e6b5202d951168"
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