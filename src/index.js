import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { App as CapApp } from '@capacitor/app';
import { BrowserRouter } from 'react-router-dom';


CapApp.addListener('backButton', ({ canGoBack }) => {

  const urlArray = window.location.href.split("/")

  if (urlArray[urlArray.length - 1] === 'auth') {
    CapApp.exitApp();
    return
  }

  if(canGoBack){
    window.history.back();
  } else {
    CapApp.exitApp();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
